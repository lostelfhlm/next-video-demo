"use client";

import { useRef } from "react";

// 既存の比較用コンポーネント（あなたのコードをそのまま利用）
import { AutoPlayVideo } from "./components/AutoPlayVideo";
import AutoPlayVideoWithSound from "./components/AutoPlayVideoWithSound";
import { YouTubeEmbed } from "./components/YouTubeEmbed";
import YouTubeEmbedUnmuted from "./components/YouTubeEmbedUnmuted";
import HlsPlayer from "./components/HlsPlayer";
import HlsPlayerWithSound from "./components/HlsPlayerWithSound";

// 新規：全画面初回クリックで 0 秒有声開始（MP4 / HLS / YouTube）
import AutoPlayVideoPrimeStart from "./components/AutoPlayVideoPrimeStart";
import HlsPlayerPrimeStart from "./components/HlsPlayerPrimeStart";
import YouTubeEmbedPrimeStart from "./components/YouTubeEmbedPrimeStart";

export default function Page() {
  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    alignItems: "start",
  };
  const box: React.CSSProperties = {
    padding: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>
        動画ソース比較：静音オート / 有声オート試行 / 全画面初回クリックで
        0秒有声開始
      </h1>

      <section style={grid}>
        {/* 1) ローカル MP4：静音オート（参考） */}
        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            1) ローカル MP4（静音オート）
          </h2>
          <AutoPlayVideo src="/video/sample.mp4" />
        </div>

        {/* 1') ローカル MP4：有声オート“試行”（あなたの比較用） */}
        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            1&apos;) ローカル MP4（有声オート試行）
          </h2>
          <AutoPlayVideoWithSound src="/video/sample.mp4" />
        </div>

        {/* 1'') ローカル MP4：全画面初回クリック → 0秒から音あり */}
        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            1&apos;&apos;) ローカル MP4（全画面初回クリックで 0秒有声開始）
          </h2>
          <AutoPlayVideoPrimeStart src="/video/sample.mp4" />
        </div>

        {/* 2) YouTube：静音オート（参考） */}
        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            2) YouTube（静音オート）
          </h2>
          <YouTubeEmbed id="dQw4w9WgXcQ" />
        </div>

        {/* 2') YouTube：有声オート“試行”（比較用） */}
        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            2&apos;) YouTube（有声オート試行）
          </h2>
          <YouTubeEmbedUnmuted id="dQw4w9WgXcQ" />
        </div>

        {/* 2'') YouTube：全画面初回クリック → 0秒から音あり */}
        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            2&apos;&apos;) YouTube（全画面初回クリックで 0秒有声開始）
          </h2>
          <YouTubeEmbedPrimeStart id="dQw4w9WgXcQ" />
        </div>

        {/* 3) HLS：静音オート（参考） */}
        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            3) HLS（静音オート）
          </h2>
          <HlsPlayer src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
        </div>

        {/* 3') HLS：有声オート“試行”（比較用） */}
        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            3&apos;) HLS（有声オート試行）
          </h2>
          <HlsPlayerWithSound src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
        </div>

        {/* 3'') HLS：全画面初回クリック → 0秒から音あり */}
        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            3&apos;&apos;) HLS（全画面初回クリックで 0秒有声開始）
          </h2>
          <HlsPlayerPrimeStart src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
        </div>
      </section>

      <p style={{ fontSize: 12, opacity: 0.75, marginTop: 12 }}>
        ※ iOS Safari では「音声付き自動再生」は仕様上ブロックされるため、
        本ページは“全画面の初回クリック”に合わせて
        0秒から音ありで開始する方式を採用しています。
      </p>
    </main>
  );
}
