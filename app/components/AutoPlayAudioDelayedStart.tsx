"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  width?: number;
  height?: number;
  controls?: boolean;
  delaySec?: number; // デフォルト5秒
  onTick?: (rest: number) => void; // 残り秒を親へ通知（タイトル表示用）
};

/**
 * MP3：カウントダウン後に音声あり自動再生を試みる。
 * - ブロックされた場合は、ページの任意クリックで開始。
 */
export default function AutoPlayAudioDelayedStart({
  src,
  width = 300,
  height = 54,
  controls = true,
  delaySec = 5,
  onTick,
}: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [countdown, setCountdown] = useState(delaySec);
  const [countdownActive, setCountdownActive] = useState(true);

  // 初期化
  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    
    audio.preload = "auto";
    audio.src = src;

    // 再生状態の監視
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("play", () => setIsPlaying(true));
      audio.removeEventListener("pause", () => setIsPlaying(false));
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, [src]);

  // 遅延カウントダウン → 音声あり自動再生を試行
  useEffect(() => {
    let rest = delaySec;
    setCountdown(rest);
    onTick?.(rest);
    
    const timer = window.setInterval(() => {
      rest -= 1;
      setCountdown(rest);
      onTick?.(rest);
      
      if (rest <= 0) {
        window.clearInterval(timer);
        setCountdownActive(false);
        void startWithSound();
      }
    }, 1000);
    
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delaySec]);

  // 音声あり開始（失敗時は次のクリックで開始）
  const startWithSound = async () => {
    const audio = ref.current;
    if (!audio) return;
    
    try {
      await audio.play();
      setBlocked(false);
    } catch {
      setBlocked(true);
      
      const handler = () => {
        document.removeEventListener("pointerdown", handler);
        audio.play().catch(() => {});
      };
      
      document.addEventListener("pointerdown", handler, {
        once: true,
        passive: true,
      });
    }
  };

  const onManualPlay = async () => {
    const audio = ref.current;
    if (!audio) return;
    
    try {
      await audio.play();
      setBlocked(false);
    } catch {
      setBlocked(true);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <audio
        ref={ref}
        controls={controls}
        preload="metadata"
        style={{ width: width, maxWidth: "100%" }}
      />
      
      {/* 再生状態の視覚的表示 */}
      <div
        style={{
          marginTop: 8,
          padding: "4px 8px",
          borderRadius: 4,
          backgroundColor: countdownActive 
            ? "#ff9800" 
            : isPlaying 
              ? "#4caf50" 
              : "#f44336",
          color: "white",
          fontSize: 12,
          display: "inline-block",
        }}
      >
        {countdownActive 
          ? `カウントダウン中: ${countdown}秒` 
          : isPlaying 
            ? "再生中" 
            : "停止中"}
      </div>
      
      {blocked && !countdownActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "#fff",
            borderRadius: 4,
            padding: 8,
            minHeight: 54,
          }}
        >
          <button
            onClick={onManualPlay}
            style={{
              padding: "8px 12px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
            }}
          >
            タップして再生
          </button>
          <span style={{ fontSize: 12, opacity: 0.9 }}>
            ※ 自動再生がブロックされました
          </span>
        </div>
      )}
    </div>
  );
}
