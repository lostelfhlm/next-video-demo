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
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Autoplay 動作テスト</h1>

      {/* シンプルな案内（日本語） */}
      <section
        style={{
          marginBottom: 16,
          lineHeight: 1.7,
          fontSize: 14,
          opacity: 0.95,
        }}
      >
        <strong>テストの見方：</strong>
        <ul style={{ marginTop: 8 }}>
          <li>
            各ページで「静音オート」「有声オート試行」「全画面の初回クリックで有声開始」を比較します。
          </li>
          <li>
            このページからリンクをクリックして遷移すると、そのクリックがユーザー操作としてカウントされます。
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
            <strong>二段階カウントダウン</strong>では、最初のカウントダウン終了後に再度カウントダウンを行い、その後自動再生を開始します。
          </li>
        </ul>
      </section>

      <nav style={listStyle}>
        <Link href="/mp4">🎥 MP4 再生テスト</Link>
        <Link href="/hls">📡 HLS 再生テスト</Link>
        <Link href="/youtube">▶️ YouTube 再生テスト</Link>
      </nav>
    </main>
  );
}
