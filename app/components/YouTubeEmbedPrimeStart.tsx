"use client";

import { useEffect, useRef } from "react";

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
        el: HTMLIFrameElement | string,
        opts: {
          videoId: string;
          playerVars?: Record<string, number>;
          events?: Record<string, (e: unknown) => void>;
        },
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

/**
 * iOS対策：YouTube を全画面の“初回クリック”で音あり開始
 * - 初期はミュート読み込み（自動再生対策）
 * - 初回クリックで unMute + playVideo（必要なら seekTo(0,true)）
 */
export default function YouTubeEmbedPrimeStart({
  id,
  title = "YouTube video",
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let player: YTPlayer | null = null;
    let disposed = false;

    // YouTube IFrame API を読み込む
    const loadYouTubeAPI = () =>
      new Promise<void>((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
          return;
        }
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = () => resolve();
        document.body.appendChild(tag);
      });

    const initPlayer = () => {
      if (!iframeRef.current || !window.YT || !window.YT.Player) return;
      player = new window.YT.Player(iframeRef.current, {
        videoId: id,
        playerVars: {
          autoplay: 0, // 初期は再生しない
          mute: 1,     // ミュートでロード
          playsinline: 1,
          rel: 0,
        },
      });
    };

    void loadYouTubeAPI().then(() => {
      if (!disposed) initPlayer();
    });

    // 全局初回クリックで有声開始
    const handler = () => {
      document.removeEventListener("pointerdown", handler);
      if (player) {
        player.seekTo(0, true);
        player.unMute();
        player.playVideo();
      }
    };
    document.addEventListener("pointerdown", handler, { once: true, passive: true });

    return () => {
      disposed = true;
      document.removeEventListener("pointerdown", handler);
      player?.destroy();
    };
  }, [id]);

  return (
    <div style={{ aspectRatio: "16 / 9", width: "100%" }}>
      <iframe
        ref={iframeRef}
        title={title}
        width="100%"
        height="100%"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        style={{ border: 0, borderRadius: 8 }}
      />
    </div>
  );
}
