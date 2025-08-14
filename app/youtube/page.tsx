"use client";

import { YouTubeEmbed } from "../components/YouTubeEmbed"; // 静音オート（参考）
import YouTubeEmbedUnmuted from "../components/YouTubeEmbedUnmuted"; // 有声オート試行
import YouTubeEmbedPrimeStart from "../components/YouTubeEmbedPrimeStart"; // 全画面初回クリック→0秒有声開始（API）

export default function PageYouTube() {
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
  const half: React.CSSProperties = {
    width: "50%",
    minWidth: 320,
    maxWidth: 720,
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>YouTube：挙動比較</h1>

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
            <strong>直接リロード</strong>：ユーザー操作が無いため、
            <em>静音オート</em>は開始、<em>有声オート試行</em>
            は多くの環境でブロック、<em>「全画面初回クリック→0秒有声開始」</em>
            は最初のクリックを待機します。
          </li>
          <li>
            <strong>他ページから遷移</strong>
            ：遷移クリックが手勢扱いとなり、IFrame Player API
            の初期化が完了していれば、
            <em>「全画面初回クリック→0秒有声開始」</em>
            が0秒から音ありで開始します。
          </li>
          <li>
            <strong>ページ内クリック</strong>：API
            の準備完了後であれば、そのクリックで音あり再生が始まります。準備前のクリックだった場合は、もう一度クリックしてください。
          </li>
          <li>
            YouTube は自動再生規制が特に強く、
            <em>「初回クリックで有声開始」</em>のUI設計が最も安定します。
          </li>
        </ul>
      </section>

      <section style={grid}>
        <div style={box}>
          <h2>1) 静音オート（参考）</h2>
          <div style={half}>
            <YouTubeEmbed id="dQw4w9WgXcQ" />
          </div>
        </div>

        <div style={box}>
          <h2>2) 有声オート試行（多くの環境でブロック）</h2>
          <div style={half}>
            <YouTubeEmbedUnmuted id="dQw4w9WgXcQ" />
          </div>
        </div>

        <div style={box}>
          <h2>3) 全画面初回クリック → 0秒から音あり開始</h2>
          <div style={half}>
            <YouTubeEmbedPrimeStart id="dQw4w9WgXcQ" />
          </div>
        </div>
      </section>
    </main>
  );
}
