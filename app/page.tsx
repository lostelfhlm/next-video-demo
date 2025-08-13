import { AutoPlayVideo } from "./components/AutoPlayVideo";
import AutoPlayVideoWithSound from "./components/AutoPlayVideoWithSound";
import { YouTubeEmbed } from "./components/YouTubeEmbed";
import YouTubeEmbedUnmuted from "./components/YouTubeEmbedUnmuted";
import HlsPlayer from "./components/HlsPlayer";
import HlsPlayerWithSound from "./components/HlsPlayerWithSound";

// 左右で「静音オート再生」vs「有声オート再生」を比較表示
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
        Next.js 動画デモ：静音 vs 有声オート再生
      </h1>

      <section style={grid}>
        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            1) ローカル MP4（静音オート）
          </h2>
          <AutoPlayVideo src="/video/sample.mp4" />
          <p style={{ fontSize: 13, opacity: 0.8, marginTop: 8 }}>
            期待：自動再生が始まる（muted + playsInline）。
          </p>
        </div>

        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            1&apos) ローカル MP4（有声オート試行）
          </h2>
          <AutoPlayVideoWithSound src="/video/sample.mp4" />
          <p style={{ fontSize: 13, opacity: 0.8, marginTop: 8 }}>
            期待：多くの環境でブロック → オーバーレイのボタンで再生可能。
          </p>
        </div>

        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            2) YouTube（静音オート）
          </h2>
          <YouTubeEmbed id="dQw4w9WgXcQ" />
          <p style={{ fontSize: 13, opacity: 0.8, marginTop: 8 }}>
            期待：自動再生（無音）で開始。
          </p>
        </div>

        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            2&apos) YouTube（有声オート試行）
          </h2>
          <YouTubeEmbedUnmuted id="dQw4w9WgXcQ" />
          <p style={{ fontSize: 13, opacity: 0.8, marginTop: 8 }}>
            期待：多くの環境で開始しない／無音のまま。ユーザー操作で再生。
          </p>
        </div>

        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            3) HLS（静音オート）
          </h2>
          <HlsPlayer src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
          <p style={{ fontSize: 13, opacity: 0.8, marginTop: 8 }}>
            期待：自動再生（無音）で開始。
          </p>
        </div>

        <div style={box}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            3&apos) HLS（有声オート試行）
          </h2>
          <HlsPlayerWithSound src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
          <p style={{ fontSize: 13, opacity: 0.8, marginTop: 8 }}>
            期待：多くの環境でブロック → ボタンで再生可能。
          </p>
        </div>
      </section>
    </main>
  );
}
