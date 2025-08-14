"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

type Props = {
  src: string;
  poster?: string;
  delaySec?: number; // デフォルト5秒
  onTick?: (rest: number) => void; // 残り秒を親へ通知
};

// webkitPlaysInline 付き型
interface HTMLVideoElementWithWebkit extends HTMLVideoElement {
  webkitPlaysInline?: boolean;
}

/**
 * HLS：マニフェスト準備完了後にカウント開始 → 終了で“音あり自動再生”を試みる。
 * - ブロックされた場合は、次の任意クリックで開始（0秒から音あり）。
 */
export default function HlsPlayerDelayedStart({
  src,
  poster,
  delaySec = 5,
  onTick,
}: Props) {
  const ref = useRef<HTMLVideoElementWithWebkit>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [ready, setReady] = useState(false);

  // 準備（iOS: ネイティブ / その他: hls.js）
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

  // 準備後にカウントダウン → 音あり自動再生
  useEffect(() => {
    if (!ready) return;
    let rest = delaySec;
    onTick?.(rest);
    const timer = window.setInterval(() => {
      rest -= 1;
      onTick?.(rest);
      if (rest <= 0) {
        window.clearInterval(timer);
        void startFromZeroWithSound();
      }
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, delaySec]);

  const startFromZeroWithSound = async () => {
    const v = ref.current;
    if (!v) return;
    try {
      v.currentTime = 0;
      v.muted = false;
      await v.play();
    } catch {
      const handler = () => {
        document.removeEventListener("pointerdown", handler);
        v.currentTime = 0;
        v.muted = false;
        v.play().catch(() => {});
      };
      document.addEventListener("pointerdown", handler, {
        once: true,
        passive: true,
      });
    }
  };

  return (
    <video
      ref={ref}
      poster={poster}
      style={{ width: "100%", background: "black", borderRadius: 8 }}
    />
  );
}
