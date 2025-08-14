"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  controls?: boolean;
  delaySec?: number; // デフォルト5秒
  onTick?: (rest: number) => void; // 残り秒を親へ通知（タイトル表示用）
};

// webkitPlaysInline 付き型
interface HTMLVideoElementWithWebkit extends HTMLVideoElement {
  webkitPlaysInline?: boolean;
}

/**
 * MP4：カウントダウン後に“音あり自動再生”を試みる。
 * - ブロックされた場合は、ページの任意クリックで開始（0秒から音あり）。
 */
export default function AutoPlayVideoDelayedStart({
  src,
  poster,
  width = 480,
  height = 270,
  controls = true,
  delaySec = 5,
  onTick,
}: Props) {
  const ref = useRef<HTMLVideoElementWithWebkit>(null);

  // 初期化
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playsInline = true;
    v.webkitPlaysInline = true;
    v.preload = "auto";
    v.loop = true;
    v.src = src;

    // 事前に無音で prime しても良いが、ここでは純粋に遅延後に試行
  }, [src]);

  // 遅延カウントダウン → 音あり自動再生を試行
  useEffect(() => {
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
  }, [delaySec]);

  // 0秒から音あり開始（失敗時は次のクリックで開始）
  const startFromZeroWithSound = async () => {
    const v = ref.current;
    if (!v) return;
    try {
      v.currentTime = 0;
      v.muted = false; // いきなり音ありを試みる
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
      width={width}
      height={height}
      controls={controls}
      style={{ maxWidth: "100%", background: "black", borderRadius: 8 }}
    />
  );
}
