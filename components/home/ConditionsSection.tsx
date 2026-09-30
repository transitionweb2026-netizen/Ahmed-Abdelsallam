import { ConditionCard } from "@/components/conditions/ConditionCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { DotGrid, Orb, PlusMark } from "@/components/ui/Decor";
import { GlassButton } from "@/components/ui/GlassButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CollectionSectionContent, Condition } from "@/types/content";

interface ConditionsSectionProps {
  content: CollectionSectionContent;
  conditions: Condition[];
}

export function ConditionsSection({ content, conditions }: ConditionsSectionProps) {
  return (
    <section id="conditions" className="page-section" aria-labelledby="conditions-title">
      <Orb className="top-1/4 end-[-12rem] h-[32rem] w-[32rem]" color="lavender" />
      <Orb className="bottom-0 start-[-10rem] h-[26rem] w-[26rem]" color="navy" />
      <DotGrid className="bottom-16 end-[6%] h-56 w-56 opacity-60" />
      <PlusMark id="conditions-plus" className="top-28 start-[8%] hidden h-10 w-10 opacity-80 lg:block" />

      <div className="site-container relative">
        <SectionHeading heading={content.heading} id="conditions-title" />

        <RevealGroup as="ul" className="mt-14 grid gap-5 md:grid-cols-2 lg:gap-6" stagger={0.1}>
          {conditions.map((condition) => (
            <RevealItem as="li" key={condition.slug} variant="up">
              <ConditionCard condition={condition} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal variant="fade" className="mt-14 flex justify-center">
          <GlassButton href={content.cta.href} size="lg" variant="secondary">
            {content.cta.label}
          </GlassButton>
        </Reveal>
      </div>
    </section>
  );
}
