import { AutoPlayVideo } from "./components/AutoPlayVideo";
import { YouTubeEmbed } from "./components/YouTubeEmbed";
import HlsPlayer from "./components/HlsPlayer";

// 日本語コメント：デモ用トップページ
export default function Page() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Next.js 動画デモ（自動再生は静音前提）</h1>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>1) ローカル MP4</h2>
        <AutoPlayVideo src="/video/sample.mp4" poster="" />
        <p style={{ fontSize: 14, opacity: 0.8 }}>
          ※ iOS では <code>muted</code> + <code>playsInline</code> が必須。クリックで音量を上げるのが一般的。
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>2) YouTube iframe（静音自動再生）</h2>
        <YouTubeEmbed id="dQw4w9WgXcQ" />
        <p style={{ fontSize: 14, opacity: 0.8 }}>
          埋め込みURLは <code>?autoplay=1&mute=1&playsinline=1</code> を付与し、<code>allow</code> に{" "}
          <code>autoplay</code> を含める。
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>3) HLS（m3u8）</h2>
        <HlsPlayer src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
        <p style={{ fontSize: 14, opacity: 0.8 }}>
          iOS はネイティブ HLS、その他は hls.js。静音で自動再生、タップで音量アップが一般的。
        </p>
      </section>
    </main>
  );
}
