"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  controls?: boolean;
};

// HTMLVideoElement に webkitPlaysInline を追加した型
interface HTMLVideoElementWithWebkit extends HTMLVideoElement {
  webkitPlaysInline?: boolean;
}

/**
 * iOS対策：全画面の“初回クリック”で 0秒から音あり開始
 * - オーバーレイや専用ボタンは表示しない
 */
export default function AutoPlayVideoPrimeStart({
  src,
  poster,
  width = 480,
  height = 270,
  controls = true,
}: Props) {
  const ref = useRef<HTMLVideoElementWithWebkit>(null);

  // 動画タグ初期化
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playsInline = true;
    v.webkitPlaysInline = true; // 旧iOS向け
    v.preload = "auto";
    v.loop = true;
    v.src = src;
  }, [src]);

  // 手勢内で「解錠→0秒から音あり開始」
  const startFromZeroWithSound = async () => {
    const v = ref.current;
    if (!v) return;
    try {
      v.muted = true;
      await v.play();      // 解錠
      v.pause();
      v.currentTime = 0;   // 視覚的な進行なしで 0 秒へ
      v.muted = false;
      await v.play();      // 本番：音あり開始
    } catch {
      // 無視（ユーザーがもう一度クリックすればOK）
    }
  };

  // 全局初回クリックで開始
  useEffect(() => {
    const handler = () => {
      document.removeEventListener("pointerdown", handler);
      void startFromZeroWithSound();
    };
    document.addEventListener("pointerdown", handler, { once: true, passive: true });
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

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
