"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  controls?: boolean;
  firstDelaySec?: number; // 最初のカウントダウン（デフォルト5秒）
  secondDelaySec?: number; // 2回目のカウントダウン（デフォルト3秒）
  onTick?: (rest: number, phase: number) => void; // 残り秒と現在のフェーズを親へ通知
};

// webkitPlaysInline 付き型
interface HTMLVideoElementWithWebkit extends HTMLVideoElement {
  webkitPlaysInline?: boolean;
}

/**
 * MP4：二段階カウントダウン後に"音あり自動再生"を試みる。
 * - 最初のカウントダウン終了後、再度カウントダウンを行い、その後自動再生を開始。
 * - ブロックされた場合は、ページの任意クリックで開始（0秒から音あり）。
 */
export default function AutoPlayVideoDoubleCountdown({
  src,
  poster,
  width = 480,
  height = 270,
  controls = true,
  firstDelaySec = 5,
  secondDelaySec = 3,
  onTick,
}: Props) {
  const ref = useRef<HTMLVideoElementWithWebkit>(null);
  const [phase, setPhase] = useState(1); // フェーズ1: 最初のカウントダウン、フェーズ2: 2回目のカウントダウン

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

  // 最初の遅延カウントダウン
  useEffect(() => {
    let rest = firstDelaySec;
    onTick?.(rest, 1);
    const timer = window.setInterval(() => {
      rest -= 1;
      onTick?.(rest, 1);
      if (rest <= 0) {
        window.clearInterval(timer);
        setPhase(2); // 次のフェーズへ
      }
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstDelaySec]);

  // 2回目の遅延カウントダウン → 音あり自動再生を試行
  useEffect(() => {
    if (phase !== 2) return;
    
    let rest = secondDelaySec;
    onTick?.(rest, 2);
    const timer = window.setInterval(() => {
      rest -= 1;
      onTick?.(rest, 2);
      if (rest <= 0) {
        window.clearInterval(timer);
        void startFromZeroWithSound();
      }
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondDelaySec]);

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
