"use client";

import { useState, useRef, useEffect } from "react";
import Hls from "hls.js";

type Props = {
  src: string;
  poster?: string;
};

// webkitPlaysInline 付き型
interface HTMLVideoElementWithWebkit extends HTMLVideoElement {
  webkitPlaysInline?: boolean;
}

/**
 * HLS：ボタンクリック後に"音あり自動再生"を試みる。
 * - ボタンをクリックするとビデオが生成され、準備完了後に自動再生を開始。
 */
export default function HlsPlayerButtonStart({ src, poster }: Props) {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElementWithWebkit>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [ready, setReady] = useState(false);

  // ビデオを表示
  const handleButtonClick = () => {
    setShowVideo(true);
  };

  // ビデオが表示された後にHLSの初期化
  useEffect(() => {
    if (!showVideo) return;

    const v = videoRef.current;
    if (!v) return;

    v.playsInline = true;
    v.webkitPlaysInline = true;
    v.preload = "auto";
    v.controls = true;
    v.loop = true;
    v.muted = false; // 音ありで再生

    // iOS Safari は HLS をネイティブ再生できる
    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = src;
      const onLoaded = () => {
        setReady(true);
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
      };
      v.addEventListener("loadedmetadata", onLoaded);
      return () => v.removeEventListener("loadedmetadata", onLoaded);
    }

    // その他ブラウザは hls.js を利用
    if (Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: true });
      hlsRef.current = hls;
      hls.attachMedia(v);
      hls.loadSource(src);
      
      const onManifest = () => {
        setReady(true);
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
      };
      
      hls.on(Hls.Events.MANIFEST_PARSED, onManifest);
      
      return () => {
        hls.off(Hls.Events.MANIFEST_PARSED, onManifest);
        hls.destroy();
        hlsRef.current = null;
      };
    }

    setReady(false);
  }, [showVideo, src]);

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
          poster={poster}
          style={{ 
            width: "100%", 
            background: "black",
            // iPadのSafariで問題が発生するため、borderRadiusとoverflow:hiddenの組み合わせを避ける
            // borderRadius: 8 
          }}
        />
      )}
    </div>
  );
}
