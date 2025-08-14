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
      <nav style={listStyle}>
        <Link href="/mp4">🎥 MP4 再生テスト</Link>
        <Link href="/hls">📡 HLS 再生テスト</Link>
        <Link href="/youtube">▶️ YouTube 再生テスト</Link>
      </nav>
    </main>
  );
}
