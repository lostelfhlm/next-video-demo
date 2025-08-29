"use client";

import Link from "next/link";

export default function Home() {
  const listStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    fontSize: 18,
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>
        音声・動画自動再生テスト
      </h1>

      <section
        style={{
          marginBottom: 16,
          lineHeight: 1.7,
          fontSize: 14,
          opacity: 0.95,
        }}
      >
        <strong>プロジェクト概要：</strong>
        <p style={{ marginTop: 8, marginBottom: 12 }}>
          異なるブラウザ環境での音声・動画自動再生の挙動を検証するためのテストです。
          ブラウザの自動再生ポリシーは環境によって異なるため、各種パターンを用意して比較できるようにしています。
          MP3（標準とWebAudio
          API）、MP4、HLS、YouTubeの各種メディアタイプについて、6つの再生パターンをテストできます。
        </p>
      </section>

      {/* メディアタイプの説明 */}
      <section
        style={{
          marginBottom: 16,
          lineHeight: 1.7,
          fontSize: 14,
          opacity: 0.95,
        }}
      ></section>

      {/* テストパターンの説明 */}
      <section
        style={{
          marginBottom: 16,
          lineHeight: 1.7,
          fontSize: 14,
          opacity: 0.95,
        }}
      >
        <strong>テストパターン（6種類）：</strong>
        <ul style={{ marginTop: 8, marginBottom: 12 }}>
          <li>
            <strong>1. 静音オート：</strong>
            ページ読み込み時に自動的に再生を開始しますが、音声はミュートされています。
            ほとんどのブラウザで許可されています。
          </li>
          <li>
            <strong>2. 有声オート試行：</strong>
            ページ読み込み時に音声ありで自動再生を試みますが、多くのブラウザでブロックされます。
            ユーザー操作後のページ遷移では許可される場合があります。
          </li>
          <li>
            <strong>3. 初回クリック→0秒有声：</strong>
            ユーザーの最初のクリックで0秒から音声ありで再生を開始します。
            ユーザー操作があるため、ほとんどの環境で動作します。
          </li>
          <li>
            <strong>4. 遅延有声オート：</strong>
            カウントダウン後に音声ありで自動再生を試みます。
            ブロックされた場合は、次のクリックで開始します。
          </li>
          <li>
            <strong>5. 二段階カウントダウン：</strong>
            最初のカウントダウン終了後、再度カウントダウンを行い、その後自動再生を開始します。
            ブロックされた場合は、次のクリックで開始します。
          </li>
          <li>
            <strong>6. ボタンクリック後再生：</strong>
            専用のボタンをクリックするとビデオが表示され、音声ありで自動再生を開始します。
            ユーザー操作直後のため、ほとんどの環境で動作します。
          </li>
        </ul>
      </section>

      {/* テストの見方 */}
      <section
        style={{
          marginBottom: 16,
          lineHeight: 1.7,
          fontSize: 14,
          opacity: 0.95,
        }}
      >
        <strong>テストの見方と注意点：</strong>
        <ul style={{ marginTop: 8 }}>
          <li>
            このページからリンクをクリックして遷移すると、そのクリックがユーザー操作としてカウントされます。
            これにより、通常はブロックされる有声自動再生が許可される場合があります。
          </li>
          <li>
            ページを<strong>直接リロード</strong>
            した場合はユーザー操作が無いため、有声の自動再生は多くの環境でブロックされます。
          </li>
          <li>
            ページ内でどこかを<strong>1回タップ/クリック</strong>
            すると有声再生が開始されます（準備が整っていない場合は再度クリック）。
          </li>
          <li>
            <strong>環境による違い：</strong>
            モバイル端末（特にiOS）では、自動再生の制約が厳しい傾向があります。
            また、ブラウザの設定やバージョンによっても挙動が異なる場合があります。
          </li>
          <li>
            <strong>ネットワーク状況：</strong>
            特にHLSやYouTubeでは、ネットワーク状況によって初期化や再生開始までの時間が変わります。
          </li>
        </ul>
      </section>

      <nav style={listStyle}>
        <Link href="/mp3">🔊 MP3 再生テスト（ローカル音源）</Link>
        <Link href="/mp3-network">🔊 MP3 再生テスト（ネットワーク音源）</Link>
        <Link href="/webaudio">🎵 WebAudio API 再生テスト</Link>
        <Link href="/mp4">🎥 MP4 再生テスト</Link>
        <Link href="/hls">📡 HLS 再生テスト</Link>
        <Link href="/youtube">▶️ YouTube 再生テスト</Link>
      </nav>
    </main>
  );
}
