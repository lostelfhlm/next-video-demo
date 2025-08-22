"use client";

import { useState, useRef } from "react";

type Props = {
  src: string;
  width?: number;
  height?: number;
  controls?: boolean;
};

/**
 * MP3：ボタンクリック後に音声あり再生を開始する。
 * - ボタンをクリックするとオーディオプレーヤーが表示され、再生を開始。
 * - ユーザー操作直後のため、ほとんどの環境で動作する。
 */
export default function AutoPlayAudioButtonStart({
  src,
  width = 300,
  height = 54,
  controls = true,
}: Props) {
  const [showAudio, setShowAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // オーディオを表示して再生を開始
  const handleButtonClick = () => {
    setShowAudio(true);

    // オーディオ要素が表示された後に再生を開始するため、setTimeout を使用
    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.preload = "auto";

      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
        
        // 自動再生がブロックされた場合は、ユーザーのクリックを待つ
        const handler = () => {
          document.removeEventListener("pointerdown", handler);
          audio.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        };
        
        document.addEventListener("pointerdown", handler, {
          once: true,
          passive: true,
        });
      });
    }, 100);
  };

  // 再生状態の監視
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => setIsPlaying(false);

  return (
    <div>
      {!showAudio ? (
        <button
          onClick={handleButtonClick}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          オーディオを表示して再生
        </button>
      ) : (
        <div>
          <audio
            ref={audioRef}
            src={src}
            controls={controls}
            style={{ width: width, maxWidth: "100%" }}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
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
            {isPlaying ? "再生中" : "停止中"}
          </div>
        </div>
      )}
    </div>
  );
}
