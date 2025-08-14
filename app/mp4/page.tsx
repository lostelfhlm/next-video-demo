"use client";

import { AutoPlayVideo } from "../components/AutoPlayVideo"; // 静音オート
import AutoPlayVideoWithSound from "../components/AutoPlayVideoWithSound"; // 有声オート試行
import AutoPlayVideoPrimeStart from "../components/AutoPlayVideoPrimeStart"; // 全画面初回クリック→0秒有声開始

export default function PageMp4() {
  const box: React.CSSProperties = {
    padding: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
  };
  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 24,
  };
  // 半幅ラッパ（コンポーネント内部は100%なので見た目で半分に縮小）
  const half: React.CSSProperties = {
    width: "50%",
    minWidth: 320,
    maxWidth: 720,
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>MP4：挙動比較</h1>

      {/* 挙動説明（日本語） */}
      <section
        style={{
          marginBottom: 16,
          lineHeight: 1.7,
          fontSize: 14,
          opacity: 0.95,
        }}
      >
        <strong>挙動の説明：</strong>
        <ul style={{ marginTop: 8 }}>
          <li>
            このページを<strong>直接リロード</strong>
            した場合：ユーザー操作が無いため、<em>静音オート</em>は再生開始、
            <em>有声オート試行</em>は多くの環境でブロック、
            <em>「全画面初回クリック→0秒有声開始」</em>
            は最初のクリックを待ちます。
          </li>
          <li>
            <strong>他ページからリンクで遷移</strong>
            した場合：そのクリックがユーザー手勢として扱われ、読み込みが整えば
            <em>「全画面初回クリック→0秒有声開始」</em>
            が即時に0秒から音ありで開始します。
          </li>
          <li>
            <strong>ページ内のどこかをクリック</strong>
            すると：ブロックされていた再生が開始（または音声が有効化）されます。
          </li>
          <li>
            iOS Safari
            では有声の自動再生がより厳格です。準備（メタデータ読込等）前のクリックだった場合は、もう一度クリックが必要になることがあります。
          </li>
        </ul>
      </section>

      <section style={grid}>
        <div style={box}>
          <h2>1) 静音オート（参考）</h2>
          <div style={half}>
            <AutoPlayVideo src="/video/sample.mp4" />
          </div>
        </div>

        <div style={box}>
          <h2>2) 有声オート試行（多くの環境でブロック）</h2>
          <div style={half}>
            <AutoPlayVideoWithSound src="/video/sample.mp4" />
          </div>
        </div>

        <div style={box}>
          <h2>3) 全画面初回クリック → 0秒から音あり開始</h2>
          <div style={half}>
            <AutoPlayVideoPrimeStart src="/video/sample.mp4" />
          </div>
        </div>
      </section>
    </main>
  );
}
