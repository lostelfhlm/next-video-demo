"use client";

import { useState } from "react";
import { AutoPlayVideo } from "../components/AutoPlayVideo"; // 静音オート
import AutoPlayVideoWithSound from "../components/AutoPlayVideoWithSound"; // 有声オート試行
import AutoPlayVideoPrimeStart from "../components/AutoPlayVideoPrimeStart"; // 初回クリック→0秒有声
import AutoPlayVideoDelayedStart from "../components/AutoPlayVideoDelayedStart"; // 遅延有声
import AutoPlayVideoDoubleCountdown from "../components/AutoPlayVideoDoubleCountdown"; // 二段階カウントダウン

export default function PageMp4() {
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
        MP4：挙動比較（6パターン）
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
            <strong>直接リロード</strong>：ユーザー操作が無いため、
            <em>静音オート</em>は開始、<em>有声オート試行</em>
            は多くの環境でブロック、<em>初回クリック→0秒有声</em>
            は最初のクリック待ち、<em>遅延有声</em>
            はカウント終了で試行（ブロック時はクリックで開始）。
          </li>
          <li>
            <strong>他ページから遷移</strong>
            ：遷移クリックが手勢扱いとなり、読み込みが整えば
            <em>有声オート試行</em>は即時開始。<em>遅延有声</em>
            はカウント後に開始を試行。
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
          <h2>3) 初回クリック → 0秒から音あり開始</h2>
          <div style={half}>
            <AutoPlayVideoPrimeStart src="/video/sample.mp4" />
          </div>
        </div>

        <div style={box}>
          <h2>4) 遅延有声オート（{count4}秒）</h2>
          <div style={half}>
            <AutoPlayVideoDelayedStart
              src="/video/sample.mp4"
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
            <AutoPlayVideoDoubleCountdown
              src="/video/sample.mp4"
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
