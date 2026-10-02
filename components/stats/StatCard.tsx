import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { Icon } from "@/components/ui/Icon";
import { cn, formatNumber } from "@/lib/utils";
import type { Stat } from "@/types/content";
import styles from "./StatCard.module.css";

export function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const fullValue = `${stat.prefix ?? ""}${formatNumber(stat.value)}${stat.suffix ?? ""}`;
  return (
    <div className={styles.card} data-counter-root="">
      <div className={styles.top}>
        <span className={cn("icon-chip", styles.icon)}>
          <Icon name={stat.icon} size={20} />
        </span>
        <span className={styles.index} aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className={styles.value}>
        <span dir="ltr" className={styles.number} aria-hidden="true">
          {stat.prefix ? <span className={styles.affix}>{stat.prefix}</span> : null}
          <AnimatedCounter value={stat.value} />
          {stat.suffix ? <span className={styles.affix}>{stat.suffix}</span> : null}
        </span>
        <span className="sr-only">{fullValue}</span>
      </p>
      <p className={styles.label}>{stat.label}</p>
      <span className={styles.bar} aria-hidden="true">
        <span className={styles.barFill} />
      </span>
    </div>
  );
}
