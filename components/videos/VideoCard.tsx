import { Clock } from "lucide-react";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/content";
import styles from "./VideoCard.module.css";

interface VideoCardProps {
  video: Video;
  sizes?: string;
  className?: string;
}

/** Vertical (9:16) video inside a liquid-glass frame. Shared with /videos. */
export function VideoCard({ video, sizes = "(min-width: 1280px) 330px, (min-width: 768px) 30vw, 76vw", className }: VideoCardProps) {
  return (
    <article className={cn(styles.card, className)}>
      <div className={styles.frame}>
        <VideoPlayer
          video={video}
          sizes={sizes}
          playSize="md"
          className={styles.screen}
          overlay={
            video.duration ? (
              <span className={styles.duration} aria-hidden="true">
                <Clock size={13} strokeWidth={2.2} />
                <span dir="ltr">{video.duration}</span>
              </span>
            ) : null
          }
        />
      </div>
      <div className={styles.meta}>
        <h3 className={styles.title}>{video.title}</h3>
      </div>
    </article>
  );
}
