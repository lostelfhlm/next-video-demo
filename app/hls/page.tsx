"use client";

import { useState } from "react";
import HlsPlayer from "../components/HlsPlayer"; // 静音オート
import HlsPlayerWithSound from "../components/HlsPlayerWithSound"; // 有声オート試行
import HlsPlayerPrimeStart from "../components/HlsPlayerPrimeStart"; // 初回クリック→0秒有声
import HlsPlayerDelayedStart from "../components/HlsPlayerDelayedStart"; // 遅延有声
import HlsPlayerDoubleCountdown from "../components/HlsPlayerDoubleCountdown"; // 二段階カウントダウン

export default function PageHls() {
  const box: React.CSSProperties = {
    padding: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
  };
  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 16,
    alignItems: "start",
  };
  // 半幅（HLSは特に大きいので揃えて半分に）
  const half: React.CSSProperties = {
    width: "100%",
    minWidth: 200,
    maxWidth: 400,
  };

  const [count4, setCount4] = useState(5);
  const [count5, setCount5] = useState<{ rest: number; phase: number }>({
    rest: 5,
    phase: 1,
  });

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>
        HLS：挙動比較（6パターン）
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
            <strong>直接リロード</strong>：ユーザー操作なし →{" "}
            <em>静音オート</em>は開始、<em>有声オート試行</em>はブロック、
            <em>初回クリック→0秒有声</em>はクリック待ち、<em>遅延有声</em>
            はカウント終了で試行。
          </li>
          <li>
            <strong>他ページから遷移</strong>
            ：遷移クリックが手勢扱い。準備完了後、<em>有声オート試行</em>
            は即時開始。<em>遅延有声</em>はカウント後に開始を試行。
          </li>
          <li>
            <strong>ページ内クリック</strong>
            ：ブロック時はそのクリックで開始（0秒から音あり）。準備前にクリックした場合は、準備完了後にもう一度クリックが必要。
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
          <h2>3) 初回クリック → 0秒から音あり開始</h2>
          <div style={half}>
            <HlsPlayerPrimeStart src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
          </div>
        </div>

        <div style={box}>
          <h2>4) 遅延有声オート（{count4}秒）</h2>
          <div style={half}>
            <HlsPlayerDelayedStart
              src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
              delaySec={5}
              onTick={setCount4}
            />
          </div>
        </div>

        <div style={box}>
          <h2>
            5) 二段階カウントダウン（{count5.phase === 1 ? "第1" : "第2"}：
            {count5.rest}秒）
          </h2>
          <div style={half}>
            <HlsPlayerDoubleCountdown
              src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
              firstDelaySec={5}
              secondDelaySec={3}
              onTick={(rest, phase) => setCount5({ rest, phase })}
            />
          </div>
        </div>

        <div style={box}>
          <h2>6) 予備枠</h2>
          <div style={half}></div>
        </div>
      </section>
    </main>
  );
}
