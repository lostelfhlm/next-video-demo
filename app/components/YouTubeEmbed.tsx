type Props = { id: string; title?: string };

export function YouTubeEmbed({ id, title = "YouTube video" }: Props) {
  // 自動再生させるには URL パラメータと allow 設定が必要（静音前提）
  const src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`;

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
        border: "0",
        borderRadius: 8,
      }}
    />
  );
}
