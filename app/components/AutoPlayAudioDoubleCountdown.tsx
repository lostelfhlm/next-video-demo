"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  width?: number;
  height?: number;
  controls?: boolean;
  firstDelaySec?: number; // 最初のカウントダウン（デフォルト5秒）
  secondDelaySec?: number; // 2回目のカウントダウン（デフォルト3秒）
  onTick?: (rest: number, phase: number) => void; // 残り秒と現在のフェーズを親へ通知
};

/**
 * MP3：二段階カウントダウン後に音声あり自動再生を試みる。
 * - 最初のカウントダウン終了後、再度カウントダウンを行い、その後自動再生を開始。
 * - ブロックされた場合は、ページの任意クリックで開始。
 */
export default function AutoPlayAudioDoubleCountdown({
  src,
  width = 300,
  height = 54,
  controls = true,
  firstDelaySec = 5,
  secondDelaySec = 3,
  onTick,
}: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [phase, setPhase] = useState(1); // フェーズ1: 最初のカウントダウン、フェーズ2: 2回目のカウントダウン
  const [countdown, setCountdown] = useState(firstDelaySec);
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

  // 最初の遅延カウントダウン
  useEffect(() => {
    let rest = firstDelaySec;
    setCountdown(rest);
    onTick?.(rest, 1);
    
    const timer = window.setInterval(() => {
      rest -= 1;
      setCountdown(rest);
      onTick?.(rest, 1);
      
      if (rest <= 0) {
        window.clearInterval(timer);
        setPhase(2); // 次のフェーズへ
      }
    }, 1000);
    
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstDelaySec]);

  // 2回目の遅延カウントダウン → 音声あり自動再生を試行
  useEffect(() => {
    if (phase !== 2) return;
    
    let rest = secondDelaySec;
    setCountdown(rest);
    onTick?.(rest, 2);
    
    const timer = window.setInterval(() => {
      rest -= 1;
      setCountdown(rest);
      onTick?.(rest, 2);
      
      if (rest <= 0) {
        window.clearInterval(timer);
        setCountdownActive(false);
        void startWithSound();
      }
    }, 1000);
    
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondDelaySec]);

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
          ? `カウントダウン中 (${phase === 1 ? '第1段階' : '第2段階'}): ${countdown}秒` 
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
