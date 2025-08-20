"use client";

import { useState, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  controls?: boolean;
};

// webkitPlaysInline 付き型
interface HTMLVideoElementWithWebkit extends HTMLVideoElement {
  webkitPlaysInline?: boolean;
}

/**
 * MP4：ボタンクリック後に"音あり自動再生"を試みる。
 * - ボタンをクリックするとビデオが生成され、自動再生を開始。
 */
export default function AutoPlayVideoButtonStart({
  src,
  poster,
  width = 480,
  height = 270,
  controls = true,
}: Props) {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElementWithWebkit>(null);

  // ビデオを表示して再生を開始
  const handleButtonClick = () => {
    setShowVideo(true);

    // ビデオ要素が表示された後に再生を開始するため、setTimeout を使用
    setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;

      v.playsInline = true;
      v.webkitPlaysInline = true;
      v.preload = "auto";
      v.loop = true;
      v.muted = false; // 音ありで再生

      v.play().catch(() => {
        // 自動再生がブロックされた場合は、ユーザーのクリックを待つ
        const handler = () => {
          document.removeEventListener("pointerdown", handler);
          v.play().catch(() => {});
        };
        document.addEventListener("pointerdown", handler, {
          once: true,
          passive: true,
        });
      });
    }, 100);
  };

  return (
    <div>
      {!showVideo ? (
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
          ビデオを表示して再生
        </button>
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          width={width}
          height={height}
          controls={controls}
          style={{
            maxWidth: "100%",
            background: "black",
            // iPadのSafariで問題が発生するため、borderRadiusとoverflow:hiddenの組み合わせを避ける
            // borderRadius: 8
          }}
        />
      )}
    </div>
  );
}
