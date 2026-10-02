import {
  Activity,
  Award,
  Bone,
  BoneFracture,
  BookOpen,
  CalendarCheck,
  CircleAlert,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Dumbbell,
  Footprints,
  GraduationCap,
  Hand,
  HandHeart,
  HeartPulse,
  Info,
  Lightbulb,
  ListChecks,
  Mail,
  MapPin,
  MessagesSquare,
  Microscope,
  Phone,
  Pill,
  Play,
  PersonStanding,
  Repeat,
  Route,
  ScanLine,
  SearchCheck,
  ShieldPlus,
  Sparkles,
  Stethoscope,
  Syringe,
  Target,
  Timer,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { SVGProps } from "react";
import type { IconName } from "@/types/content";

/** Spine and shoulder have no Lucide equivalent; drawn in the same stroke style. */
function SpineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="8.5" y="2.5" width="7" height="3.5" rx="1.5" />
      <rect x="8" y="8.25" width="8" height="3.5" rx="1.5" />
      <rect x="8.5" y="14" width="7" height="3.5" rx="1.5" />
      <path d="M12 19.5v2M5 10h3M16 10h3M6 4.25h2.5M15.5 4.25H18M6 15.75h2.5M15.5 15.75H18" />
    </svg>
  );
}

function ShoulderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M4 21v-5.5A5.5 5.5 0 0 1 9.5 10h5a5.5 5.5 0 0 1 5.5 5.5V21" />
      <circle cx="17.25" cy="12.75" r="2" />
    </svg>
  );
}

const ICONS: Record<IconName, LucideIcon | typeof SpineIcon> = {
  bone: Bone,
  boneFracture: BoneFracture,
  spine: SpineIcon,
  activity: Activity,
  footprints: Footprints,
  hand: Hand,
  shoulder: ShoulderIcon,
  personStanding: PersonStanding,
  stethoscope: Stethoscope,
  scan: ScanLine,
  calendar: CalendarCheck,
  clipboard: ClipboardList,
  clipboardCheck: ClipboardCheck,
  route: Route,
  searchCheck: SearchCheck,
  repeat: Repeat,
  heartHandshake: HandHeart,
  shieldPlus: ShieldPlus,
  sparkles: Sparkles,
  play: Play,
  users: Users,
  messages: MessagesSquare,
  clock: Clock,
  phone: Phone,
  mapPin: MapPin,
  dumbbell: Dumbbell,
  graduationCap: GraduationCap,
  award: Award,
  bookOpen: BookOpen,
  heartPulse: HeartPulse,
  mail: Mail,
  target: Target,
  microscope: Microscope,
  pill: Pill,
  syringe: Syringe,
  listChecks: ListChecks,
  info: Info,
  lightbulb: Lightbulb,
  alertCircle: CircleAlert,
  timer: Timer,
};

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/** Resolves a CMS-friendly icon key to an icon component. Always decorative. */
export function Icon({ name, size = 22, strokeWidth = 1.8, className }: IconProps) {
  const Component = ICONS[name];
  return <Component width={size} height={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" focusable="false" />;
}
