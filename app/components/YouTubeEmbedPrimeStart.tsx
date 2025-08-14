"use client";

import { useEffect, useRef } from "react";
import { loadYouTubeIframeAPI, YTPlayer } from "../lib/youtubeApi";

type Props = { id: string; title?: string };

export default function YouTubeEmbedPrimeStart({
  id,
  title = "YouTube video",
}: Props) {
  const targetRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    let disposed = false;

    const init = async () => {
      await loadYouTubeIframeAPI();
      if (disposed || !targetRef.current || !window.YT || !window.YT.Player)
        return;

      playerRef.current = new window.YT.Player(targetRef.current, {
        videoId: id,
        playerVars: { autoplay: 0, mute: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: () => {
            readyRef.current = true;
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
    };

    void init();

    const onFirstPointer = () => {
      document.removeEventListener("pointerdown", onFirstPointer);
      const p = playerRef.current;
      if (p && readyRef.current) {
        p.seekTo(0, true);
        p.unMute();
        p.playVideo();
      }
    };
    document.addEventListener("pointerdown", onFirstPointer, {
      once: true,
      passive: true,
    });

    return () => {
      disposed = true;
      document.removeEventListener("pointerdown", onFirstPointer);
      playerRef.current?.destroy();
      playerRef.current = null;
      readyRef.current = false;
    };
  }, [id, title]);

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
    </div>
  );
}
