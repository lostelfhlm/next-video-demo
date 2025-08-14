"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

type Props = { src: string; poster?: string };

// HTMLVideoElement に webkitPlaysInline を追加した型
interface HTMLVideoElementWithWebkit extends HTMLVideoElement {
  webkitPlaysInline?: boolean;
}

/** iOS対策：全画面の“初回クリック”で 0秒から音あり開始（HLS） */
export default function HlsPlayerPrimeStart({ src, poster }: Props) {
  const ref = useRef<HTMLVideoElementWithWebkit>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    v.playsInline = true;
    v.webkitPlaysInline = true;
    v.preload = "auto";
    v.controls = true;
    v.loop = true;

    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = src;
      const onLoaded = () => setReady(true);
      v.addEventListener("loadedmetadata", onLoaded);
      return () => v.removeEventListener("loadedmetadata", onLoaded);
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: true });
      hlsRef.current = hls;
      hls.attachMedia(v);
      hls.loadSource(src);
      const onManifest = () => setReady(true);
      hls.on(Hls.Events.MANIFEST_PARSED, onManifest);
      return () => {
        hls.off(Hls.Events.MANIFEST_PARSED, onManifest);
        hls.destroy();
        hlsRef.current = null;
      };
    }

    setReady(false);
  }, [src]);

  const startFromZeroWithSound = async () => {
    const v = ref.current;
    if (!v || !ready) return;
    try {
      v.muted = true;
      await v.play(); // 解錠
      v.pause();
      v.currentTime = 0;
      v.muted = false;
      await v.play(); // 本番
    } catch {}
  };

  useEffect(() => {
    if (!ready) return;
    const handler = () => {
      document.removeEventListener("pointerdown", handler);
      void startFromZeroWithSound();
    };
    document.addEventListener("pointerdown", handler, {
      once: true,
      passive: true,
    });
    return () => document.removeEventListener("pointerdown", handler);
  }, [ready]);

  return (
    <video
      ref={ref}
      poster={poster}
      style={{ width: "100%", background: "black", borderRadius: 8 }}
    />
  );
}
