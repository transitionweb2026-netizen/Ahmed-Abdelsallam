"use client";

import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { useDictionary } from "@/components/i18n/LocaleProvider";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Modal } from "@/components/modal/Modal";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { GlassButton } from "@/components/ui/GlassButton";
import { VideoCard } from "@/components/videos/VideoCard";
import { routes } from "@/config/routes";
import { useHashDialog } from "@/hooks/useHashDialog";
import { interpolate } from "@/i18n/format";
import type { Video } from "@/types/content";
import styles from "./VideosGallery.module.css";

const anchor = (video: Video) => `video-${video.slug}`;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The full vertical-video library. Each card opens a viewer dialog that
 * plays the video large, with previous / next navigation through the set.
 * `/videos#video-<slug>` deep-links into the viewer.
 */
export function VideosGallery({ videos }: { videos: Video[] }) {
  const t = useDictionary();
  const ids = useMemo(() => videos.map(anchor), [videos]);
  const { activeId, open, select, close } = useHashDialog(ids);
  const activeIndex = videos.findIndex((video) => anchor(video) === activeId);
  const active = activeIndex >= 0 ? videos[activeIndex] : undefined;

  // Keep the last video rendered while the dialog animates out.
  const [shown, setShown] = useState(active);
  if (active && active !== shown) setShown(active);
  const shownIndex = shown ? videos.indexOf(shown) : -1;

  const go = (step: number) => {
    const next = videos[(shownIndex + step + videos.length) % videos.length];
    select(anchor(next));
  };

  return (
    <>
      <RevealGroup as="ul" className={styles.grid} stagger={0.08} aria-label={t.video.allList}>
        {videos.map((video) => (
          <RevealItem as="li" key={video.slug} id={anchor(video)} variant="up">
            <VideoCard
              video={video}
              sizes="(min-width: 1320px) 400px, (min-width: 768px) 31vw, (min-width: 360px) 46vw, 92vw"
              onOpen={() => open(anchor(video))}
            />
          </RevealItem>
        ))}
      </RevealGroup>

      <Modal
        open={Boolean(active)}
        onClose={close}
        labelledBy="video-dialog-title"
        describedBy={shown?.description ? "video-dialog-description" : undefined}
        size="xl"
        contentKey={shown?.slug}
        returnFocus={() => (shown ? document.getElementById(anchor(shown))?.querySelector("button") : null)}
      >
        {shown ? (
          <div className={styles.viewer}>
            <div className={styles.stage}>
              <div className={styles.screenWrap}>
                <VideoPlayer
                  key={shown.slug}
                  video={shown}
                  sizes="(min-width: 768px) 420px, 80vw"
                  className={styles.screen}
                  autoStart
                  focusOnPlay={false}
                />
              </div>
            </div>

            <div className={styles.info}>
              <p className={styles.counter} aria-live="polite">
                <span className="sr-only">
                  {interpolate(t.video.position, { current: shownIndex + 1, total: videos.length })}
                </span>
                <span aria-hidden="true">
                  <strong>{pad(shownIndex + 1)}</strong> / {pad(videos.length)}
                </span>
              </p>
              <h2 id="video-dialog-title" className={styles.title}>
                {shown.title}
              </h2>
              {shown.duration ? (
                <p className={styles.duration}>
                  <Clock size={15} aria-hidden="true" />
                  <span className="sr-only">{t.video.duration}</span>
                  <span dir="ltr">{shown.duration}</span>
                </p>
              ) : null}
              {shown.description ? (
                <p id="video-dialog-description" className={styles.description}>
                  {shown.description}
                </p>
              ) : null}

              <div className={styles.nav}>
                <button type="button" className={styles.navButton} onClick={() => go(-1)}>
                  <ChevronRight className={styles.navIconPrev} size={18} aria-hidden="true" />
                  {t.video.previous}
                </button>
                <button type="button" className={styles.navButton} onClick={() => go(1)}>
                  {t.video.next}
                  <ChevronLeft className={styles.navIconNext} size={18} aria-hidden="true" />
                </button>
              </div>

              <div className={styles.cta}>
                <GlassButton href={routes.contact} size="sm">
                  {t.video.book}
                </GlassButton>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
