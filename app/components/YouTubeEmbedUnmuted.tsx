// YouTubeを「有声オート再生」パラメータで埋め込む（多くの環境でブロックされる）
type Props = { id: string; title?: string };

export default function YouTubeEmbedUnmuted({
  id,
  title = "YouTube video",
}: Props) {
  // 有声オート再生（mute=0）。多くの環境で自動再生は開始しない想定
  const src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&playsinline=1&rel=0`;

  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      width="560"
      height="315"
      style={{
        maxWidth: "100%",
        aspectRatio: "16 / 9",
        border: 0,
        borderRadius: 8,
      }}
    />
  );
}
