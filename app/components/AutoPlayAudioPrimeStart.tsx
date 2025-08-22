"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  width?: number;
  height?: number;
  controls?: boolean;
};

/**
 * MP3：初回クリック→再生開始
 * - ユーザーの最初のクリックで再生を開始
 * - ユーザー操作があるため、ほとんどの環境で動作する
 */
export default function AutoPlayAudioPrimeStart({
  src,
  width = 300,
  height = 54,
  controls = true,
}: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitingForClick, setWaitingForClick] = useState(true);

  // 初期化
  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    
    audio.preload = "auto";
    audio.src = src;

    // 再生状態の監視
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  // 最初のクリックで再生開始するためのイベントリスナー
  useEffect(() => {
    if (!waitingForClick) return;
    
    const startOnFirstClick = () => {
      const audio = ref.current;
      if (!audio || !waitingForClick) return;
      
      const playAudio = async () => {
        try {
          await audio.play();
          setWaitingForClick(false);
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      };
      
      playAudio();
    };

    document.addEventListener("pointerdown", startOnFirstClick, {
      once: true,
      passive: true,
    });

    return () => {
      document.removeEventListener("pointerdown", startOnFirstClick);
    };
  }, [waitingForClick]);

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
          backgroundColor: isPlaying ? "#4caf50" : "#f44336",
          color: "white",
          fontSize: 12,
          display: "inline-block",
        }}
      >
        {isPlaying ? "再生中" : waitingForClick ? "クリック待ち" : "停止中"}
      </div>
      
      {waitingForClick && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          ※ 画面のどこかをクリックすると再生が開始されます
        </div>
      )}
      
    </div>
  );
}
