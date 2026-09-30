import { MoveLeft } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { GlassRing, Orb } from "@/components/ui/Decor";
import { GlassButton } from "@/components/ui/GlassButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoCard } from "@/components/videos/VideoCard";
import type { CollectionSectionContent, Video } from "@/types/content";
import styles from "./ImportantVideos.module.css";

interface ImportantVideosProps {
  content: CollectionSectionContent;
  /** The featured subset of the shared 9-video dataset. */
  videos: Video[];
}

export function ImportantVideos({ content, videos }: ImportantVideosProps) {
  return (
    <section className="page-section" aria-labelledby="videos-title">
      <Orb className="top-1/3 start-[-14rem] h-[36rem] w-[36rem]" color="blue" />
      <Orb className="bottom-10 end-[-12rem] h-[30rem] w-[30rem]" color="lavender" />
      <GlassRing className="top-[46%] end-[5%] hidden h-28 w-28 xl:block" />

      <div className="site-container relative">
        <SectionHeading heading={content.heading} id="videos-title" />

        <RevealGroup as="ul" className={styles.list} stagger={0.12} aria-label="فيديوهات مختارة">
          {videos.map((video) => (
            <RevealItem as="li" key={video.slug} variant="up" className={styles.item}>
              <VideoCard video={video} />
            </RevealItem>
          ))}
        </RevealGroup>

        <p className={styles.swipeHint} aria-hidden="true">
          <MoveLeft size={16} />
          اسحب لمشاهدة المزيد
        </p>

        <Reveal variant="fade" className="mt-10 flex justify-center md:mt-14">
          <GlassButton href={content.cta.href} size="lg">
            {content.cta.label}
          </GlassButton>
        </Reveal>
      </div>
    </section>
  );
}
