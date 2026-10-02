import { VideoFrame } from "@/components/media/VideoFrame";
import { Reveal } from "@/components/motion/Reveal";
import { DotGrid, GlassRing, Orb, PlusMark } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { AboutPageContent } from "@/types/content";
import styles from "./AboutVideo.module.css";

/** Wide introduction video in the liquid-glass frame (same player as home). */
export function AboutVideo({ content }: { content: AboutPageContent["video"] }) {
  return (
    <section id="about-video" className="page-section" aria-labelledby="about-video-title">
      <Orb className="top-1/4 start-[-14rem] h-[36rem] w-[36rem]" color="lavender" />
      <Orb className="bottom-0 end-[-12rem] h-[30rem] w-[30rem]" color="blue" />
      <DotGrid className="top-16 end-[6%] hidden h-56 w-56 opacity-60 md:block" />

      <div className="site-container relative">
        <SectionHeading heading={content.heading} id="about-video-title" />
        <Reveal variant="scale" amount={0.2} className={styles.stage}>
          <GlassRing className={styles.ring} />
          <PlusMark id="about-video-plus" className={styles.plus} />
          <VideoFrame video={content.video} shape="wide" sizes="(min-width: 1320px) 1120px, 94vw" />
        </Reveal>
      </div>
    </section>
  );
}
