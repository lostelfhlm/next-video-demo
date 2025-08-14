// app/lib/youtubeApi.ts
export type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLDivElement | string,
        opts: {
          videoId: string;
          playerVars?: Record<string, number>;
          events?: Record<string, (e: unknown) => void>;
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ready = false;
let loading = false;
const waiters: Array<() => void> = [];

export function loadYouTubeIframeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  if (ready || (window.YT && window.YT.Player)) {
    ready = true;
    return Promise.resolve();
  }

  if (loading) {
    return new Promise<void>((resolve) => waiters.push(resolve));
  }

  loading = true;
  return new Promise<void>((resolve) => {
    waiters.push(resolve);

    const prev = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      ready = true;
      loading = false;

      try {
        prev && prev();
      } catch {}

      for (const w of waiters.splice(0)) {
        try {
          w();
        } catch {}
      }
    };

    const hasScript = Array.from(document.scripts).some((s) =>
      s.src.includes("https://www.youtube.com/iframe_api")
    );
    if (!hasScript) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  });
}
