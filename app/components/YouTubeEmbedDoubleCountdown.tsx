"use client";

import { useEffect, useRef, useState } from "react";
import { loadYouTubeIframeAPI, YTPlayer } from "../lib/youtubeApi";

type Props = {
  id: string;
  title?: string;
  firstDelaySec?: number; // 最初のカウントダウン（デフォルト5秒）
  secondDelaySec?: number; // 2回目のカウントダウン（デフォルト3秒）
  onTick?: (rest: number, phase: number) => void; // 残り秒と現在のフェーズを親へ通知
};

/**
 * YouTube：API準備完了後に二段階カウントダウン → 終了で"音あり自動再生"を試みる。
 * - 最初のカウントダウン終了後、再度カウントダウンを行い、その後自動再生を開始。
 * - ブロックされた場合は、次の任意クリックで開始（0秒から音あり）。
 */
export default function YouTubeEmbedDoubleCountdown({
  id,
  title = "YouTube video",
  firstDelaySec = 5,
  secondDelaySec = 3,
  onTick,
}: Props) {
  const targetRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(true);
  const [phase, setPhase] = useState(1); // フェーズ1: 最初のカウントダウン、フェーズ2: 2回目のカウントダウン

  useEffect(() => {
    let disposed = false;

    const init = async () => {
      try {
        await loadYouTubeIframeAPI();
        if (disposed || !targetRef.current || !window.YT || !window.YT.Player)
          return;

        playerRef.current = new window.YT.Player(targetRef.current, {
          videoId: id,
          playerVars: { autoplay: 0, mute: 1, playsinline: 1, rel: 0 },
          events: {
            onReady: () => {
              setReady(true);
              setFallback(false);
              const iframe = targetRef.current?.querySelector(
                "iframe"
              ) as HTMLIFrameElement | null;
              if (iframe) {
                iframe.style.position = "absolute";
                iframe.style.inset = "0";
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                iframe.title = title;
                iframe.setAttribute(
                  "allow",
                  "autoplay; encrypted-media; picture-in-picture; fullscreen"
                );
              }
            },
          },
        });
      } catch {
        setFallback(true);
      }
    };

    void init();

    return () => {
      disposed = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      setReady(false);
    };
  }, [id, title]);

  // 準備後に最初のカウントダウン開始
  useEffect(() => {
    if (!ready) return;
    
    let rest = firstDelaySec;
    onTick?.(rest, 1);
    const timer = window.setInterval(() => {
      rest -= 1;
      onTick?.(rest, 1);
      if (rest <= 0) {
        window.clearInterval(timer);
        setPhase(2); // 次のフェーズへ
      }
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, firstDelaySec]);

  // 2回目のカウントダウン → 音あり自動再生を試行
  useEffect(() => {
    if (phase !== 2) return;
    
    let rest = secondDelaySec;
    onTick?.(rest, 2);
    const timer = window.setInterval(() => {
      rest -= 1;
      onTick?.(rest, 2);
      if (rest <= 0) {
        window.clearInterval(timer);
        const p = playerRef.current;
        if (!p) return;
        try {
          p.seekTo(0, true);
          p.unMute();
          p.playVideo();
        } catch {
          const h = () => {
            document.removeEventListener("pointerdown", h);
            p.seekTo(0, true);
            p.unMute();
            p.playVideo();
          };
          document.addEventListener("pointerdown", h, {
            once: true,
            passive: true,
          });
        }
      }
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondDelaySec]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 0,
        paddingTop: "56.25%",
        borderRadius: 8,
        overflow: "hidden",
        background: "black",
      }}
    >
      <div ref={targetRef} style={{ position: "absolute", inset: 0 }} />
      {fallback && (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      )}
    </div>
  );
}
