"use client";

import { useState } from "react";
import { AutoPlayAudio } from "../components/AutoPlayAudio"; // 音声あり自動再生試行
import AutoPlayAudioPrimeStart from "../components/AutoPlayAudioPrimeStart"; // 初回クリック→再生開始
import AutoPlayAudioDelayedStart from "../components/AutoPlayAudioDelayedStart"; // 遅延有声
import AutoPlayAudioDoubleCountdown from "../components/AutoPlayAudioDoubleCountdown"; // 二段階カウントダウン
import AutoPlayAudioButtonStart from "../components/AutoPlayAudioButtonStart"; // ボタンクリック後再生

export default function PageMp3Network() {
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

  // ネットワーク音源を定義
  const networkAudioSrc = "https://srn-english-contents.srn-lab.dev/server_assets/phonics/mp3/P-word_01.mp3";

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>
        MP3（ネットワーク音源）：挙動比較（5パターン）
      </h1>

      <section
        style={{
          marginBottom: 16,
          lineHeight: 1.7,
          fontSize: 14,
          opacity: 0.95,
        }}
      >
        <strong>音源について：</strong>
        <p style={{ marginTop: 8, marginBottom: 8 }}>
          このテストでは、ネットワーク上の音源（外部URL）を使用しています。
          インターネット接続が必要です。
        </p>
        
        <strong>挙動の説明：</strong>
        <ul style={{ marginTop: 8 }}>
          <li>
            <strong>直接リロード</strong>：ユーザー操作が無いため、
            <em>音声あり自動再生試行</em>
            は多くの環境でブロック、<em>初回クリック→再生開始</em>
            は最初のクリック待ち、<em>遅延有声</em>
            はカウント終了で試行（ブロック時はクリックで開始）。
          </li>
          <li>
            <strong>他ページから遷移</strong>
            ：遷移クリックがユーザー操作扱いとなり、読み込みが整えば
            <em>音声あり自動再生試行</em>は即時開始。<em>遅延有声</em>
            はカウント後に開始を試行。
          </li>
          <li>
            <strong>ページ内クリック</strong>
            ：ブロックされている場合は、そのクリックで開始。
          </li>
          <li>
            <strong>ボタンクリック後再生</strong>
            ：専用のボタンをクリックするとオーディオプレーヤーが表示され、再生を開始します。
          </li>
        </ul>
      </section>

      <section style={grid}>
        <div style={box}>
          <h2>1) 音声あり自動再生試行（多くの環境でブロック）</h2>
          <div style={half}>
            <AutoPlayAudio src={networkAudioSrc} />
          </div>
        </div>

        <div style={box}>
          <h2>2) 初回クリック → 再生開始</h2>
          <div style={half}>
            <AutoPlayAudioPrimeStart src={networkAudioSrc} />
          </div>
        </div>

        <div style={box}>
          <h2>3) 遅延後に音声あり自動再生試行（{count4}秒）</h2>
          <div style={half}>
            <AutoPlayAudioDelayedStart
              src={networkAudioSrc}
              delaySec={5}
              onTick={setCount4}
            />
          </div>
        </div>

        <div style={box}>
          <h2>
            4) 二段階カウントダウン（{count5.phase === 1 ? "第1" : "第2"}：
            {count5.rest}秒）
          </h2>
          <div style={half}>
            <AutoPlayAudioDoubleCountdown
              src={networkAudioSrc}
              firstDelaySec={5}
              secondDelaySec={3}
              onTick={(rest, phase) => setCount5({ rest, phase })}
            />
          </div>
        </div>

        <div style={box}>
          <h2>5) ボタンクリック後再生</h2>
          <div style={half}>
            <AutoPlayAudioButtonStart src={networkAudioSrc} />
          </div>
        </div>
      </section>
    </main>
  );
}
