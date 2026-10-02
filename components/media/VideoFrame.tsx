import { Clock } from "lucide-react";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/content";
import styles from "./VideoFrame.module.css";

interface VideoFrameProps {
  video: Video;
  /** `sizes` for the poster image. */
  sizes: string;
  /** "standard" 16:10 (homepage intro) or "wide" 16:9 (full-width features). */
  shape?: "standard" | "wide";
  className?: string;
}

/**
 * Landscape video in a liquid-glass frame with a glass caption plate
 * (title + duration) over the poster. Click-to-load via VideoPlayer.
 */
export function VideoFrame({ video, sizes, shape = "standard", className }: VideoFrameProps) {
  return (
    <div className={cn(styles.frame, shape === "wide" && styles.wide, className)}>
      <VideoPlayer
        video={video}
        sizes={sizes}
        className={styles.screen}
        overlay={
          <span className={styles.caption} aria-hidden="true">
            <span className={styles.captionTitle}>{video.title}</span>
            {video.duration ? (
              <span className={styles.captionMeta}>
                <Clock size={14} />
                <span dir="ltr">{video.duration}</span>
              </span>
            ) : null}
          </span>
        }
      />
    </div>
  );
}
