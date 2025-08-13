"use client";

import { useEffect, useRef } from "react";
// 型定義は必要に応じて @types を導入
import Hls from "hls.js";

// 日本語コメント
type Props = { src: string; poster?: string };

export default function HlsPlayer({ src, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current!;
    // iOS Safari は HLS をネイティブ再生できる
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }
    // その他ブラウザは hls.js を利用
    if (Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      autoPlay         // ← 自動再生（muted 前提）
      muted            // ← 静音が必須
      playsInline      // ← iOS インライン再生
      controls
      preload="metadata"
      style={{ width: "100%", background: "black", borderRadius: 8 }}
    />
  );
}
