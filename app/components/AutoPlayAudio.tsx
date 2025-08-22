"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  width?: number;
  height?: number;
  controls?: boolean;
};

/**
 * MP3：音声あり自動再生を試みる
 * - 多くの環境でブロックされる
 * - 再生状態を視覚的に表示
 */
export function AutoPlayAudio({
  src,
  width = 300,
  height = 54,
  controls = true,
}: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const audio = ref.current!;
    audio.autoplay = true;

    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setBlocked(false);
      } catch {
        setBlocked(true);
        setIsPlaying(false);
      }
    };

    const onLoaded = () => tryPlay();
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("ended", () => setIsPlaying(false));
    
    audio.src = src;

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("play", () => setIsPlaying(true));
      audio.removeEventListener("pause", () => setIsPlaying(false));
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, [src]);

  const onManualPlay = async () => {
    const audio = ref.current!;
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
          backgroundColor: isPlaying ? "#4caf50" : "#f44336",
          color: "white",
          fontSize: 12,
          display: "inline-block",
        }}
      >
        {isPlaying ? "再生中" : "停止中"}
      </div>
      
      {blocked && (
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
