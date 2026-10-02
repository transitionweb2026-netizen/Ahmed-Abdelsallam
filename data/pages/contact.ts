import { routes } from "@/config/routes";
import { siteCta } from "@/data/cta";
import { heroImage } from "@/data/pages/hero-image";
import type { ContactPageContent } from "@/types/content";

/**
 * /contact copy. Address, hours and map pin live in data/contact.ts; phone
 * and WhatsApp come from environment variables (config/site.ts).
 *
 * PLACEHOLDER CONTENT — draft wording.
 */
export const contactPage: ContactPageContent = {
  seo: {
    title: "تواصل معنا",
    description:
      "تواصل مع عيادة د. أحمد عبد السلام لحجز موعد أو إرسال استفسار عبر النموذج أو واتساب أو الهاتف.",
  },

  hero: {
    eyebrow: "تواصل معنا",
    title: [
      { text: "نحن هنا", breakAfter: true },
      { text: "للإجابة عن أسئلتك", accent: true },
    ],
    description:
      "احجز موعدك أو أرسل استفسارك، وسنتواصل معك لتحديد الوقت المناسب والإجابة عن كل ما تحتاج معرفته قبل الزيارة.",
    primaryCta: { label: "أرسل رسالتك", href: "#contact-form" },
    secondaryCta: { label: "موقع العيادة", href: "#clinic-location" },
    image: heroImage("contact", "غرفة فحص مجهزة بسرير فحص ونافذة واسعة", {
      desktop: "30% center",
      mobile: "center top",
    }),
  },

  form: {
    heading: {
      eyebrow: "راسلنا",
      title: [{ text: "أرسل" }, { text: "استفسارك", accent: true }],
      description: "املأ النموذج وسنتواصل معك في أقرب وقت. الحقول المعلَّمة بعلامة * مطلوبة.",
    },
    copy: {
      labels: {
        name: "الاسم",
        phone: "رقم الهاتف",
        email: "البريد الإلكتروني",
        subject: "الموضوع",
        message: "رسالتك",
      },
      placeholders: {
        name: "الاسم بالكامل",
        // Left-to-right only: the phone input is dir="ltr".
        phone: "01XXXXXXXXX",
        email: "name@example.com",
        subject: "اختر موضوع الرسالة",
        message: "اكتب استفسارك أو الموعد المناسب لك…",
      },
      subjects: ["حجز موعد", "استفسار عن حالة", "متابعة بعد الزيارة", "استفسار عام"],
      optional: "اختياري",
      submit: "إرسال الرسالة",
      sending: "جارٍ الإرسال…",
      errorSummary: "يرجى تصحيح الحقول المشار إليها ثم إعادة الإرسال.",
      success: {
        title: "تم استلام رسالتك",
        text: "شكرًا لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.",
      },
      notConfigured: {
        title: "الإرسال عبر النموذج غير مفعّل بعد",
        text: "يمكنك إرسال الرسالة نفسها عبر واتساب بضغطة واحدة، أو الاتصال بنا مباشرة.",
        whatsappLabel: "أرسل الرسالة عبر واتساب",
      },
      failure: {
        title: "تعذّر إرسال الرسالة",
        text: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو التواصل معنا عبر واتساب أو الهاتف.",
      },
    },
    whatsappLabel: "احجز عبر واتساب",
    whatsappMessage: "مرحبًا، أرغب في حجز موعد استشارة مع د. أحمد عبد السلام.",
    callLabel: "اتصل بنا",
  },

  location: {
    heading: {
      eyebrow: "موقع العيادة",
      title: [{ text: "زُرنا في" }, { text: "العيادة", accent: true }],
      description: "العنوان ومواعيد العمل وطرق الوصول.",
    },
    labels: {
      address: "العنوان",
      hours: "مواعيد العمل",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      directions: "احصل على الاتجاهات",
      placeholderNote: "الموقع المعروض على الخريطة مؤقت، وسيُحدَّد موقع العيادة الفعلي لاحقًا.",
    },
  },

  // The contact options are already on this page, so the closing band
  // points onward instead of repeating them.
  cta: {
    ...siteCta,
    eyebrow: "اكتشف المزيد",
    title: [{ text: "تعرّف أكثر على" }, { text: "رعايتك قبل الزيارة", accent: true }],
    description:
      "تصفّح الخدمات والحالات الشائعة، أو شاهد فيديوهات توعوية قصيرة تساعدك على فهم حالتك قبل موعدك.",
    primaryAction: { kind: "link", label: "استكشف الخدمات", href: routes.services },
    secondaryAction: { kind: "link", label: "شاهد الفيديوهات", href: routes.videos },
  },
};
