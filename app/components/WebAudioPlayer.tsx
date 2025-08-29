"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// window.webkitAudioContextの型定義
interface WindowWithWebkitAudioContext extends Window {
  webkitAudioContext: typeof AudioContext;
}

type Props = {
  src: string;
  width?: number;
  height?: number;
};

/**
 * WebAudio API：音声あり自動再生を試みる
 * - 多くの環境でブロックされる
 * - AudioContextを使用した高度な音声処理
 * - 再生状態を視覚的に表示
 */
export function WebAudioPlayer({ src, width = 300, height = 54 }: Props) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progressTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 時間のフォーマット（mm:ss）
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // 音声あり開始（失敗時は次のクリックで開始）
  const startWithSound = useCallback(async () => {
    if (!audioContext || !audioBuffer) return;

    try {
      await audioContext.resume();

      const newSource = audioContext.createBufferSource();
      newSource.buffer = audioBuffer;
      newSource.connect(audioContext.destination);

      // 再生終了時の処理
      newSource.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (progressTimerRef.current) {
          cancelAnimationFrame(progressTimerRef.current);
          progressTimerRef.current = null;
        }
      };

      // 開始時間を記録
      startTimeRef.current = audioContext.currentTime;

      // 進捗更新用のアニメーションフレーム
      const updateProgress = () => {
        if (!audioContext || !isPlaying) return;

        const elapsed = audioContext.currentTime - startTimeRef.current;
        setCurrentTime(Math.min(elapsed, duration));

        if (elapsed < duration) {
          progressTimerRef.current = requestAnimationFrame(updateProgress);
        } else {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      };

      // 進捗更新を開始
      if (progressTimerRef.current) {
        cancelAnimationFrame(progressTimerRef.current);
      }
      progressTimerRef.current = requestAnimationFrame(updateProgress);

      newSource.start(0);
      setSource(newSource);
      setIsPlaying(true);
      setBlocked(false);
    } catch {
      setBlocked(true);

      const handler = () => {
        document.removeEventListener("pointerdown", handler);
        void startWithSound();
      };

      document.addEventListener("pointerdown", handler, {
        once: true,
        passive: true,
      });
    }
  }, [audioContext, audioBuffer, duration, isPlaying]);

  // AudioContextの初期化とオーディオデータの読み込み
  useEffect(() => {
    const ctx = new (window.AudioContext ||
      (window as unknown as WindowWithWebkitAudioContext).webkitAudioContext)();
    setAudioContext(ctx);

    // 音声ファイルの読み込み
    fetch(src)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((buffer) => {
        setAudioBuffer(buffer);
        setDuration(buffer.duration);

        // 自動再生を試みる - ブラウザの自動再生ポリシーにより失敗する可能性が高い
        // しかし、ユーザーがページ内で何かしらのインタラクションを行った後であれば成功する可能性がある
        ctx
          .resume()
          .then(() => {
            const newSource = ctx.createBufferSource();
            newSource.buffer = buffer;
            newSource.connect(ctx.destination);

            newSource.onended = () => {
              setIsPlaying(false);
              setCurrentTime(0);
              if (progressTimerRef.current) {
                cancelAnimationFrame(progressTimerRef.current);
                progressTimerRef.current = null;
              }
            };

            // 開始時間を記録
            startTimeRef.current = ctx.currentTime;

            // 進捗更新用のアニメーションフレーム
            const updateProgress = () => {
              if (!ctx || !isPlaying) return;

              const elapsed = ctx.currentTime - startTimeRef.current;
              setCurrentTime(Math.min(elapsed, buffer.duration));

              if (elapsed < buffer.duration) {
                progressTimerRef.current =
                  requestAnimationFrame(updateProgress);
              } else {
                setIsPlaying(false);
                setCurrentTime(0);
              }
            };

            // 進捗更新を開始
            if (progressTimerRef.current) {
              cancelAnimationFrame(progressTimerRef.current);
            }
            progressTimerRef.current = requestAnimationFrame(updateProgress);

            try {
              newSource.start(0);
              setSource(newSource);
              setIsPlaying(true);
              setBlocked(false);
            } catch {
              // 自動再生に失敗した場合
              setBlocked(true);
            }
          })
          .catch(() => {
            // 自動再生がブロックされた場合
            setBlocked(true);
          });
      });

    return () => {
      if (progressTimerRef.current) {
        cancelAnimationFrame(progressTimerRef.current);
      }
      if (source) {
        try {
          source.stop();
        } catch {}
      }
      if (ctx && ctx.state !== "closed") {
        try {
          ctx.close();
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // 手動再生（再生ボタンクリック時）
  const onManualPlay = async () => {
    if (isPlaying || !audioContext || !audioBuffer) return;
    await startWithSound();
  };

  // 進捗バーのクリックでシーク
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioContext || !audioBuffer || !containerRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;

    // 現在の再生を停止
    if (source) {
      source.stop();
    }

    // 新しい位置から再生開始
    const newSource = audioContext.createBufferSource();
    newSource.buffer = audioBuffer;
    newSource.connect(audioContext.destination);

    newSource.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (progressTimerRef.current) {
        cancelAnimationFrame(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };

    // 開始時間を更新
    startTimeRef.current = audioContext.currentTime - newTime;
    setCurrentTime(newTime);

    newSource.start(0, newTime);
    setSource(newSource);
    setIsPlaying(true);
  };

  // 再生/一時停止ボタン
  const togglePlayPause = async () => {
    if (!audioContext || !audioBuffer) return;

    if (isPlaying) {
      // 再生中なら停止
      if (source) {
        source.stop();
      }
      setIsPlaying(false);
      if (progressTimerRef.current) {
        cancelAnimationFrame(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    } else {
      // 停止中なら再生（現在位置から）
      try {
        await audioContext.resume();

        const newSource = audioContext.createBufferSource();
        newSource.buffer = audioBuffer;
        newSource.connect(audioContext.destination);

        newSource.onended = () => {
          setIsPlaying(false);
          setCurrentTime(0);
          if (progressTimerRef.current) {
            cancelAnimationFrame(progressTimerRef.current);
            progressTimerRef.current = null;
          }
        };

        // 現在位置から再生
        startTimeRef.current = audioContext.currentTime - currentTime;

        // 進捗更新用のアニメーションフレーム
        const updateProgress = () => {
          if (!audioContext || !isPlaying) return;

          const elapsed = audioContext.currentTime - startTimeRef.current;
          setCurrentTime(Math.min(elapsed, duration));

          if (elapsed < duration) {
            progressTimerRef.current = requestAnimationFrame(updateProgress);
          } else {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        };

        if (progressTimerRef.current) {
          cancelAnimationFrame(progressTimerRef.current);
        }
        progressTimerRef.current = requestAnimationFrame(updateProgress);

        newSource.start(0, currentTime);
        setSource(newSource);
        setIsPlaying(true);
      } catch {
        setBlocked(true);
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* カスタムオーディオプレーヤー */}
      <div
        ref={containerRef}
        style={{
          width: width,
          maxWidth: "100%",
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
          padding: 12,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* 再生/一時停止ボタン */}
        <button
          onClick={togglePlayPause}
          style={{
            backgroundColor: isPlaying ? "#f44336" : "#4caf50",
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "6px 12px",
            marginBottom: 8,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          {isPlaying ? "一時停止" : "再生"}
        </button>

        {/* 進捗バー */}
        <div
          onClick={handleProgressBarClick}
          style={{
            width: "100%",
            height: 8,
            backgroundColor: "#e0e0e0",
            borderRadius: 4,
            cursor: "pointer",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              height: "100%",
              backgroundColor: "#007bff",
              borderRadius: 4,
              transition: "width 0.1s linear",
            }}
          />
        </div>

        {/* 時間表示 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#666",
          }}
        >
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 再生状態の視覚的表示 */}
      <div
        style={{
          marginTop: 8,
          padding: "4px 8px",
          borderRadius: 4,
          backgroundColor: isPlaying ? "#4caf50" : "#f44336",
          color: "white",
          fontSize: 12,
          display: "inline-block",
        }}
      >
        {isPlaying ? "再生中" : "停止中"}
      </div>

      <div style={{ marginTop: 8, fontSize: 12 }}>
        <strong>使用API：</strong> WebAudio API
      </div>

      {blocked && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "#fff",
            borderRadius: 4,
            padding: 8,
            minHeight: 54,
          }}
        >
          <button
            onClick={onManualPlay}
            style={{
              padding: "8px 12px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
            }}
          >
            タップして再生
          </button>
          <span style={{ fontSize: 12, opacity: 0.9 }}>
            ※ 自動再生がブロックされました
          </span>
        </div>
      )}
    </div>
  );
}
