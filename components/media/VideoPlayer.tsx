"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/content";
import styles from "./VideoPlayer.module.css";

/** Fired on window when any player starts, so the others can pause. */
const MEDIA_PLAY_EVENT = "site:media-play";

interface VideoPlayerProps {
  video: Video;
  /** `sizes` for the poster image. */
  sizes: string;
  className?: string;
  /** Layer shown over the poster until playback starts (captions, chips). */
  overlay?: ReactNode;
  playSize?: "md" | "lg";
}

/**
 * Click-to-load player: renders only an optimised poster until the visitor
 * presses play, then swaps in a native <video> (self-hosted) or a
 * privacy-enhanced YouTube embed. No video bytes are downloaded before
 * interaction, and native controls keep playback keyboard-accessible.
 */
export function VideoPlayer({ video, sizes, className, overlay, playSize = "lg" }: VideoPlayerProps) {
  const [state, setState] = useState<"idle" | "playing" | "error">("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const id = useId();
  const sources = video.sources ?? [];
  const hasFile = sources.length > 0;
  const hasYoutube = Boolean(video.youtubeId);

  useEffect(() => {
    const onOtherPlay = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== id) videoRef.current?.pause();
    };
    window.addEventListener(MEDIA_PLAY_EVENT, onOtherPlay);
    return () => window.removeEventListener(MEDIA_PLAY_EVENT, onOtherPlay);
  }, [id]);

  // Move focus into the player so keyboard users land on its controls.
  useEffect(() => {
    if (state === "playing") (videoRef.current ?? frameRef.current)?.focus();
  }, [state]);

  const announcePlay = () => window.dispatchEvent(new CustomEvent(MEDIA_PLAY_EVENT, { detail: id }));

  const start = () => {
    if (!hasFile && !hasYoutube) {
      setState("error");
      return;
    }
    setState("playing");
    announcePlay();
  };

  if (state === "playing" && hasFile) {
    return (
      <div className={cn(styles.player, className)} data-state="playing">
        <video
          ref={videoRef}
          className={styles.media}
          controls
          autoPlay
          playsInline
          preload="auto"
          poster={video.poster.src}
          aria-label={video.title}
          onPlay={announcePlay}
        >
          {sources.map((source, index) => (
            <source
              key={source.src}
              src={source.src}
              type={source.type}
              onError={index === sources.length - 1 ? () => setState("error") : undefined}
            />
          ))}
          {video.captions?.map((track) => (
            <track key={track.src} kind="captions" src={track.src} srcLang={track.srcLang} label={track.label} />
          ))}
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      </div>
    );
  }

  if (state === "playing" && hasYoutube) {
    return (
      <div className={cn(styles.player, className)} data-state="playing">
        <iframe
          ref={frameRef}
          className={styles.media}
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`}
          title={video.title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={cn(styles.player, className)} data-state={state}>
      <Image src={video.poster.src} alt={video.poster.alt} fill sizes={sizes} className={styles.poster} />
      <span className={styles.shade} aria-hidden="true" />
      {overlay}
      {state === "error" ? (
        <p role="status" className={styles.error}>
          تعذّر تشغيل الفيديو حاليًا، يرجى المحاولة لاحقًا.
        </p>
      ) : null}
      <button type="button" className={styles.hit} onClick={start} aria-label={`تشغيل الفيديو: ${video.title}`}>
        <span className={cn(styles.play, playSize === "md" && styles.playMd)} aria-hidden="true">
          <span className={styles.playCore}>
            <Play size={playSize === "md" ? 20 : 24} fill="currentColor" strokeWidth={0} />
          </span>
        </span>
      </button>
    </div>
  );
}
