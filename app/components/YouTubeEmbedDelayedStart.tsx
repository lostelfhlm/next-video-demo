"use client";

import { useEffect, useRef, useState } from "react";
import { loadYouTubeIframeAPI, YTPlayer } from "../lib/youtubeApi";

type Props = {
  id: string;
  title?: string;
  delaySec?: number;
  onTick?: (rest: number) => void;
};

export default function YouTubeEmbedDelayedStart({
  id,
  title = "YouTube video",
  delaySec = 5,
  onTick,
}: Props) {
  const targetRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(true);

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

  useEffect(() => {
    if (!ready) return;
    let rest = delaySec;
    onTick?.(rest);
    const t = window.setInterval(() => {
      rest -= 1;
      onTick?.(rest);
      if (rest <= 0) {
        window.clearInterval(t);
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
    return () => window.clearInterval(t);
  }, [ready, delaySec, onTick]);

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
