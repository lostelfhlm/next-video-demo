"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

// HLSの「有声オート再生」を試みるデモ
type Props = { src: string; poster?: string };

export default function HlsPlayerWithSound({ src, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const video = ref.current!;
    let hls: Hls | undefined;

    const tryPlay = async () => {
      try {
        await video.play();
        setBlocked(false);
      } catch {
        setBlocked(true);
      }
    };

    // iOS Safari はネイティブHLS
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.muted = false; // 有声
      video.autoplay = true;
      video.playsInline = true;
      video.src = src;
      const onLoadedMeta = () => tryPlay();
      video.addEventListener("loadedmetadata", onLoadedMeta);
      return () => video.removeEventListener("loadedmetadata", onLoadedMeta);
    }

    // その他ブラウザは hls.js
    if (Hls.isSupported()) {
      hls = new Hls({ lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      video.muted = false; // 有声
      video.autoplay = true;
      video.playsInline = true;

      const onManifest = () => tryPlay();
      hls.on(Hls.Events.MANIFEST_PARSED, onManifest);
      return () => {
        hls?.off(Hls.Events.MANIFEST_PARSED, onManifest);
        hls?.destroy();
      };
    }
  }, [src]);

  const onManualPlay = async () => {
    const v = ref.current!;
    try {
      await v.play();
      setBlocked(false);
    } catch {
      setBlocked(true);
    }
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block", width: "100%" }}
    >
      <video
        ref={ref}
        poster={poster}
        controls
        preload="metadata"
        style={{ width: "100%", background: "black", borderRadius: 8 }}
        loop
      />
      {blocked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "#fff",
            borderRadius: 8,
          }}
        >
          <button
            onClick={onManualPlay}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            タップして有声再生
          </button>
          <span style={{ fontSize: 12, opacity: 0.9 }}>
            ※ 自動再生ポリシーでブロック
          </span>
        </div>
      )}
    </div>
  );
}
