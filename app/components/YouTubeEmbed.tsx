"use client";

type Props = { id: string; title?: string };

/** 参考用：静音オート（埋め込みパラメータ） */
export function YouTubeEmbed({ id, title = "YouTube video" }: Props) {
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
        border: 0,
        borderRadius: 8,
      }}
    />
  );
}
