"use client";

import { useState } from "react";
import { YouTubeEmbed } from "../components/YouTubeEmbed"; // 静音オート
import YouTubeEmbedUnmuted from "../components/YouTubeEmbedUnmuted"; // 有声オート試行
import YouTubeEmbedPrimeStart from "../components/YouTubeEmbedPrimeStart"; // 初回クリック→0秒有声
import YouTubeEmbedDelayedStart from "../components/YouTubeEmbedDelayedStart"; // 遅延有声

export default function PageYouTube() {
  const box: React.CSSProperties = {
    padding: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
  };
  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    alignItems: "start",
  };
  const half: React.CSSProperties = {
    width: "50%",
    minWidth: 320,
    maxWidth: 720,
  };

  const [count4, setCount4] = useState(5);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>
        YouTube：挙動比較（4パターン）
      </h1>

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
            <strong>直接リロード</strong>：<em>静音オート</em>は開始、
            <em>有声オート試行</em>はブロック、<em>初回クリック→0秒有声</em>
            はクリック待ち、<em>遅延有声</em>
            はカウント終了で開始を試みます（API準備後）。
          </li>
          <li>
            <strong>他ページから遷移</strong>
            ：遷移クリックが手勢扱い。API初期化が完了していれば、
            <em>有声オート試行</em>は即時開始。<em>遅延有声</em>
            はカウント後に開始を試みます。
          </li>
          <li>
            <strong>ページ内クリック</strong>
            ：ブロックされている場合は、そのクリックで開始（0秒から音あり）。
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
          <h2>3) 初回クリック → 0秒から音あり開始</h2>
          <div style={half}>
            <YouTubeEmbedPrimeStart id="dQw4w9WgXcQ" />
          </div>
        </div>

        <div style={box}>
          <h2>4) 遅延有声オート（{count4}秒）</h2>
          <div style={half}>
            <YouTubeEmbedDelayedStart
              id="dQw4w9WgXcQ"
              delaySec={5}
              onTick={setCount4}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
