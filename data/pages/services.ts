import { routes } from "@/config/routes";
import { heroImage } from "@/data/pages/hero-image";
import type { ServicesPageContent } from "@/types/content";

/**
 * /services copy. The cards themselves come from data/services.ts and
 * data/conditions.ts.
 *
 * PLACEHOLDER CONTENT — draft wording pending the doctor's approval.
 */
export const servicesPage: ServicesPageContent = {
  seo: {
    title: "الخدمات والإجراءات العلاجية",
    description:
      "خدمات علاج العظام والمفاصل والعمود الفقري والإصابات الرياضية، والحالات التي تستدعي الفحص، وخطوات التشخيص من الاستشارة حتى خطة العلاج.",
  },

  hero: {
    eyebrow: "الخدمات",
    title: [
      { text: "رعاية متكاملة", breakAfter: true },
      { text: "لعظامك ومفاصلك", accent: true },
    ],
    description:
      "من التشخيص الدقيق إلى خطة العلاج والمتابعة. تعرّف على الخدمات والحالات الشائعة، واضغط على أي بطاقة لعرض تفاصيلها كاملة.",
    primaryCta: { label: "تصفّح الخدمات", href: "#procedures" },
    secondaryCta: { label: "احجز استشارتك", href: routes.contact },
    image: heroImage("services", "فريق جراحي يجري عملية داخل غرفة العمليات", {
      desktop: "35% center",
      mobile: "center top",
    }),
  },

  procedures: {
    heading: {
      eyebrow: "الخدمات والإجراءات",
      title: [{ text: "إجراءات" }, { text: "جراحية وعلاجية", accent: true }],
      description:
        "اضغط على أي خدمة لقراءة وصفها ودواعي اللجوء إليها وخيارات العلاج، وما يمكن توقعه أثناء التعافي.",
    },
  },

  conditions: {
    heading: {
      eyebrow: "الحالات",
      title: [{ text: "حالات" }, { text: "تستدعي العلاج", accent: true }],
      description: "تعرّف على أسباب كل حالة وعلاماتها، ومتى يُنصح بزيارة الطبيب، وطرق التشخيص والعلاج.",
    },
  },

  diagnosis: {
    heading: {
      eyebrow: "خطوات التشخيص",
      title: [{ text: "كيف نصل إلى" }, { text: "التشخيص الصحيح", accent: true }],
      description: "خطوات منظمة تبدأ بالاستماع إليك، وتنتهي بخطة علاج واضحة تعرف فيها خطوتك التالية.",
    },
    steps: [
      {
        id: "consultation",
        title: "الاستشارة",
        description: "نستمع إلى شكواك وتاريخك المرضي وأهدافك من العلاج.",
        icon: "messages",
      },
      {
        id: "examination",
        title: "الفحص السريري",
        description: "فحص دقيق للحركة والقوة ومواضع الألم والإحساس.",
        icon: "stethoscope",
      },
      {
        id: "imaging",
        title: "الأشعة والفحوصات",
        description: "طلب الأشعة أو التحاليل المناسبة عند الحاجة فقط.",
        icon: "scan",
      },
      {
        id: "diagnosis",
        title: "التشخيص",
        description: "تحديد سبب المشكلة وشرحه لك بلغة واضحة.",
        icon: "searchCheck",
      },
      {
        id: "treatment-plan",
        title: "خطة العلاج",
        description: "خطة بخطوات محددة ومواعيد واضحة للمتابعة.",
        icon: "clipboardCheck",
      },
    ],
  },

  dialog: {
    bookLabel: "احجز استشارة",
    whatsappLabel: "اسأل عبر واتساب",
    whatsappMessage: "مرحبًا، أرغب في الاستفسار عن: {title}",
    disclaimer: "المعلومات المعروضة للتوعية العامة، ولا تغني عن الفحص والاستشارة الطبية المباشرة.",
  },
};
