"use client";

import { useEffect, useRef, useState } from "react";

// ローカルMP4を「有声オート再生」しようと試みるデモ
// 期待値：多くの環境でブロックされ、オーバーレイに「タップで再生」ボタンが出る
type Props = {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  controls?: boolean;
};

export default function AutoPlayVideoWithSound({
  src,
  poster,
  width = 480,
  height = 270,
  controls = true,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false); // ブロック検出

  useEffect(() => {
    const v = ref.current!;
    // 有声オート再生を明示（多くの環境で拒否される）
    v.muted = false;
    v.autoplay = true;
    v.playsInline = true;

    const tryPlay = async () => {
      try {
        await v.play(); // 再生試行（Promise）
        setBlocked(false); // 成功（環境によっては起きない）
      } catch {
        setBlocked(true); // ブロック
      }
    };

    // メタデータ読込後に試行すると安定
    const onLoaded = () => tryPlay();
    v.addEventListener("loadedmetadata", onLoaded);
    // 動画URLを設定（src属性でもOKだが念のため再設定）
    v.src = src;

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [src]);

  const onManualPlay = async () => {
    const v = ref.current!;
    try {
      await v.play();
      setBlocked(false);
    } catch {
      setBlocked(true);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <video
        ref={ref}
        poster={poster}
        width={width}
        height={height}
        loop
        controls={controls}
        preload="metadata"
        style={{ maxWidth: "100%", background: "black", borderRadius: 8 }}
      />
      {blocked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "#fff",
            borderRadius: 8,
          }}
        >
          <button
            onClick={onManualPlay}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            タップして有声再生
          </button>
          <span style={{ fontSize: 12, opacity: 0.9 }}>
            ※ ブラウザの自動再生ポリシーによりブロックされました
          </span>
        </div>
      )}
    </div>
  );
}
