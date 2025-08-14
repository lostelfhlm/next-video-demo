"use client";

import { useEffect, useId, useRef } from "react";

type Props = { id: string; title?: string };

// 最小限の YT 型定義（any を使わない）
type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLDivElement | string,
        opts: {
          videoId: string;
          playerVars?: Record<string, number>;
          events?: Record<string, (e: unknown) => void>;
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youTubeApiPromise: Promise<void> | null = null;
function loadYouTubeIframeAPI(): Promise<void> {
  if (youTubeApiPromise) return youTubeApiPromise;
  youTubeApiPromise = new Promise<void>((resolve) => {
    if (typeof window !== "undefined" && window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    window.onYouTubeIframeAPIReady = () => resolve();
    document.body.appendChild(tag);
  });
  return youTubeApiPromise;
}

/** iOS対策：全画面の“初回クリック”で 0秒から音あり開始（YouTube IFrame API） */
export default function YouTubeEmbedPrimeStart({
  id,
  title = "YouTube video",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const domId = useId();

  useEffect(() => {
    let disposed = false;

    const init = async () => {
      await loadYouTubeIframeAPI();
      if (disposed || !containerRef.current || !window.YT || !window.YT.Player)
        return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: id,
        playerVars: {
          autoplay: 0,
          mute: 1, // ミュートでロード
          playsinline: 1,
          rel: 0,
        },
      });
    };
    void init();

    const handler = () => {
      document.removeEventListener("pointerdown", handler);
      const p = playerRef.current;
      if (p) {
        p.seekTo(0, true);
        p.unMute();
        p.playVideo();
      }
    };
    document.addEventListener("pointerdown", handler, {
      once: true,
      passive: true,
    });

    return () => {
      disposed = true;
      document.removeEventListener("pointerdown", handler);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [id]);

  return (
    <div
      id={`yt-${domId}`}
      ref={containerRef}
      title={title}
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: 8,
        overflow: "hidden",
      }}
    />
  );
}
