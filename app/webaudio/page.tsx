"use client";

import { useState } from "react";
import { WebAudioPlayer } from "../components/WebAudioPlayer";
import WebAudioPlayerPrimeStart from "../components/WebAudioPlayerPrimeStart";
import WebAudioPlayerDelayedStart from "../components/WebAudioPlayerDelayedStart";
import WebAudioPlayerDoubleCountdown from "../components/WebAudioPlayerDoubleCountdown";
import WebAudioPlayerButtonStart from "../components/WebAudioPlayerButtonStart";

/**
 * WebAudio APIを使用したMP3再生テストページ
 * - 5種類の再生パターンをテスト
 */
export default function WebAudioPage() {
  const [delayedStartRest, setDelayedStartRest] = useState(5);
  const [doubleCountdownRest, setDoubleCountdownRest] = useState(5);
  const [doubleCountdownPhase, setDoubleCountdownPhase] = useState(1);

  // サンプルMP3ファイルのパス
  const audioSrc = "/audio/sample.mp3";

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>
        WebAudio API 再生テスト
      </h1>

      <section
        style={{
          marginBottom: 24,
          lineHeight: 1.7,
          fontSize: 14,
          opacity: 0.95,
        }}
      >
        <p style={{ marginTop: 8, marginBottom: 12 }}>
          このページでは、WebAudio APIを使用した音声再生の挙動をテストします。
          標準のHTML5 audio要素と異なり、WebAudio
          APIはより低レベルで音声を制御し、
          波形の視覚化や高度な音声処理が可能です。
        </p>
        <p>
          <strong>注意：</strong> WebAudio APIも標準のaudio要素と同様に、
          ブラウザの自動再生ポリシーの影響を受けます。ただし、より細かい制御が可能です。
        </p>
      </section>

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {/* テスト1: 音声あり自動再生試行 */}
        <section>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>
            1. 音声あり自動再生試行
          </h2>
          <p style={{ fontSize: 14, marginBottom: 16, opacity: 0.8 }}>
            ページ読み込み時に音声ありで自動再生を試みます。多くのブラウザでブロックされます。
            波形の視覚化機能付きです。
          </p>
          <WebAudioPlayer src={audioSrc} />
        </section>

        {/* テスト2: 初回クリック→再生開始 */}
        <section>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>
            2. 初回クリック→再生開始
          </h2>
          <p style={{ fontSize: 14, marginBottom: 16, opacity: 0.8 }}>
            ユーザーの最初のクリックで0秒から音声ありで再生を開始します。
            ユーザー操作があるため、ほとんどの環境で動作します。
          </p>
          <WebAudioPlayerPrimeStart src={audioSrc} />
        </section>

        {/* テスト3: 遅延後に音声あり自動再生 */}
        <section>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>
            3. 遅延後に音声あり自動再生 ({delayedStartRest}秒後)
          </h2>
          <p style={{ fontSize: 14, marginBottom: 16, opacity: 0.8 }}>
            カウントダウン後に音声ありで自動再生を試みます。
            ブロックされた場合は、次のクリックで開始します。
          </p>
          <WebAudioPlayerDelayedStart
            src={audioSrc}
            onTick={(rest) => setDelayedStartRest(rest)}
          />
        </section>

        {/* テスト4: 二段階カウントダウン後に音声あり自動再生 */}
        <section>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>
            4. 二段階カウントダウン後に音声あり自動再生 (
            {doubleCountdownPhase === 1 ? "第1段階" : "第2段階"}:{" "}
            {doubleCountdownRest}秒後 )
          </h2>
          <p style={{ fontSize: 14, marginBottom: 16, opacity: 0.8 }}>
            最初のカウントダウン終了後、再度カウントダウンを行い、その後自動再生を開始します。
            ブロックされた場合は、次のクリックで開始します。
          </p>
          <WebAudioPlayerDoubleCountdown
            src={audioSrc}
            onTick={(rest, phase) => {
              setDoubleCountdownRest(rest);
              setDoubleCountdownPhase(phase);
            }}
          />
        </section>

        {/* テスト5: ボタンクリック後再生 */}
        <section>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>
            5. ボタンクリック後再生
          </h2>
          <p style={{ fontSize: 14, marginBottom: 16, opacity: 0.8 }}>
            専用のボタンをクリックするとオーディオプレーヤーが表示され、音声ありで自動再生を開始します。
            ユーザー操作直後のため、ほとんどの環境で動作します。
          </p>
          <WebAudioPlayerButtonStart src={audioSrc} />
        </section>
      </div>

      <footer style={{ marginTop: 40, fontSize: 12, opacity: 0.7 }}>
        <p>
          ※ このページは、WebAudio
          APIを使用した音声再生の挙動をテストするためのものです。
          各ブラウザの自動再生ポリシーによって挙動が異なる場合があります。
        </p>
      </footer>
    </main>
  );
}
