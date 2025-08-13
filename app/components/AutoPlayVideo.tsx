// 日本語コメントで統一
type Props = {
    src: string;
    poster?: string;
    width?: number;
    height?: number;
    controls?: boolean;
  };
  
  export function AutoPlayVideo({
    src,
    poster,
    width = 480,
    height = 270,
    controls = true,
  }: Props) {
    return (
      <video
        src={src}
        poster={poster}
        width={width}
        height={height}
        autoPlay          // ← 自動再生（muted 前提）
        muted             // ← 有音の自動再生は不可。静音なら可能
        playsInline       // ← iOSでインライン再生 & 自動再生に必要
        loop
        preload="metadata"
        controls={controls}
        style={{ maxWidth: "100%", background: "black", borderRadius: 8 }}
      />
    );
  }
  