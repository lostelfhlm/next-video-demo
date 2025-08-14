"use client";

import HlsPlayer from "../components/HlsPlayer"; // 静音オート
import HlsPlayerWithSound from "../components/HlsPlayerWithSound"; // 有声オート試行
import HlsPlayerPrimeStart from "../components/HlsPlayerPrimeStart"; // 全画面初回クリック→0秒有声開始

export default function PageHls() {
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
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>HLS：挙動比較</h1>

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
            <strong>直接リロード</strong>：ユーザー操作が無いので、
            <em>静音オート</em>は再生、<em>有声オート試行</em>
            は多くの環境でブロック、<em>「全画面初回クリック→0秒有声開始」</em>
            は最初のクリックを待ちます。
          </li>
          <li>
            <strong>他ページから遷移</strong>
            ：遷移クリックが手勢として扱われ、HLSのマニフェストが解析済みであれば、
            <em>「全画面初回クリック→0秒有声開始」</em>
            が即時に0秒から音ありで開始します。
          </li>
          <li>
            <strong>ページ内クリック</strong>
            ：準備が整っていれば、そのクリックで音あり再生が始まります。準備前にクリックした場合は、準備完了後にもう一度クリックしてください。
          </li>
          <li>
            iOS Safari は特に厳格なため、
            <em>「初回クリックで解錠→0秒から音あり」</em>
            という設計を推奨します。
          </li>
        </ul>
      </section>

      <section style={grid}>
        <div style={box}>
          <h2>1) 静音オート（参考）</h2>
          <div style={half}>
            <HlsPlayer src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
          </div>
        </div>

        <div style={box}>
          <h2>2) 有声オート試行（多くの環境でブロック）</h2>
          <div style={half}>
            <HlsPlayerWithSound src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
          </div>
        </div>

        <div style={box}>
          <h2>3) 全画面初回クリック → 0秒から音あり開始</h2>
          <div style={half}>
            <HlsPlayerPrimeStart src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
          </div>
        </div>
      </section>
    </main>
  );
}
