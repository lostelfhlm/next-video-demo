"use client";

import { useState, useRef, useEffect } from "react";
import { loadYouTubeIframeAPI, YTPlayer } from "../lib/youtubeApi";

type Props = {
  id: string;
  title?: string;
};

/**
 * YouTube：ボタンクリック後に"音あり自動再生"を試みる。
 * - ボタンをクリックするとYouTubeプレーヤーが生成され、API準備完了後に自動再生を開始。
 */
export default function YouTubeEmbedButtonStart({
  id,
  title = "YouTube video",
}: Props) {
  const [showPlayer, setShowPlayer] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(true);

  // プレーヤーを表示
  const handleButtonClick = () => {
    setShowPlayer(true);
  };

  // プレーヤーが表示された後にYouTube APIの初期化
  useEffect(() => {
    if (!showPlayer) return;

    let disposed = false;

    const init = async () => {
      try {
        await loadYouTubeIframeAPI();
        if (disposed || !targetRef.current || !window.YT || !window.YT.Player)
          return;

        playerRef.current = new window.YT.Player(targetRef.current, {
          videoId: id,
          playerVars: {
            autoplay: 0, // 初期状態では自動再生しない
            mute: 0, // ミュートしない
            playsinline: 1,
            rel: 0,
          },
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

              // API準備完了後に再生を試みる
              const p = playerRef.current;
              if (!p) return;

              try {
                p.seekTo(0, true);
                p.unMute();
                p.playVideo();
              } catch {
                // 自動再生がブロックされた場合は、ユーザーのクリックを待つ
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
  }, [showPlayer, id, title]);

  return (
    <div>
      {!showPlayer ? (
        <button
          onClick={handleButtonClick}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ビデオを表示して再生
        </button>
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 0,
            paddingTop: "56.25%",
            // iPadのSafariで問題が発生するため、borderRadiusとoverflow:hiddenの組み合わせを避ける
            // borderRadius: 8,
            // overflow: "hidden",
            background: "black",
          }}
        >
          <div ref={targetRef} style={{ position: "absolute", inset: 0 }} />
          {/* フォールバックとメインプレーヤーの重複を避けるため、readyがtrueの場合はフォールバックを表示しない */}
          {fallback && !ready && (
            <iframe
              src={`https://www.youtube.com/embed/${id}?autoplay=0&mute=0&playsinline=1&rel=0`}
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
      )}
    </div>
  );
}
