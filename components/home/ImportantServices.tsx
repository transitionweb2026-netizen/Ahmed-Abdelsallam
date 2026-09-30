import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { CurveLines, Orb } from "@/components/ui/Decor";
import { GlassButton } from "@/components/ui/GlassButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CollectionSectionContent, Service } from "@/types/content";

interface ImportantServicesProps {
  content: CollectionSectionContent;
  services: Service[];
}

export function ImportantServices({ content, services }: ImportantServicesProps) {
  return (
    <section className="page-section" aria-labelledby="services-title">
      <Orb className="top-0 left-1/2 h-[40rem] w-[min(60rem,140vw)] -translate-x-1/2 opacity-80" color="blue" />
      <CurveLines className="bottom-8 start-0 h-44 w-full opacity-60" />

      <div className="site-container relative">
        <SectionHeading heading={content.heading} id="services-title" />

        <RevealGroup
          as="ul"
          className="mt-14 grid gap-7 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6"
          stagger={0.12}
        >
          {services.map((service, index) => (
            <RevealItem as="li" key={service.slug} variant="up">
              <ServiceCard service={service} index={index} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal variant="fade" className="mt-14 flex justify-center">
          <GlassButton href={content.cta.href} size="lg">
            {content.cta.label}
          </GlassButton>
        </Reveal>
      </div>
    </section>
  );
}
