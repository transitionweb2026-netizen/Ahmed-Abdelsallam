import type { ReviewId } from "@/data/shared/reviews";
import type { ReviewText } from "@/types/content";

/**
 * Reviews — English text, keyed by id (ratings in data/shared/reviews.ts).
 *
 * PLACEHOLDER CONTENT — these are NOT real patients or real reviews.
 * Names and texts exist only to lay out the design. Replace with genuine,
 * consented patient reviews (or remove) before the site goes live; publish
 * a review in another language only with the reviewer's consent.
 */
export const reviewsText: Record<ReviewId, ReviewText> = {
  "review-1": {
    name: "Reviewer name 1",
    text: "A clear explanation of my condition from the very first visit, and real attention to every detail of my complaint. I left understanding my treatment plan and each of its steps.",
    context: "Knee pain consultation",
  },
  "review-2": {
    name: "Reviewer name 2",
    text: "Well-organized appointments and a courteous team. The doctor listened carefully and answered all my questions patiently and clearly.",
    context: "Back pain follow-up",
  },
  "review-3": {
    name: "Reviewer name 3",
    text: "After my training injury I was worried about getting back to sport, and the follow-up was reassuring and organized step by step.",
    context: "Sports injury",
  },
  "review-4": {
    name: "Reviewer name 4",
    text: "A comfortable experience and a clear plan, and I liked that the follow-up didn't stop after the first visit.",
    context: "Shoulder pain consultation",
  },
  "review-5": {
    name: "Reviewer name 5",
    text: "The doctor went through my scan results in detail and in plain language, and made clear what I actually needed and what I didn't.",
    context: "Osteoarthritis follow-up",
  },
  "review-6": {
    name: "Reviewer name 6",
    text: "After my fracture I was worried about a long recovery, but every stage was clear and explained in advance, which reassured me a lot.",
    context: "Wrist fracture follow-up",
  },
  "review-7": {
    name: "Reviewer name 7",
    text: "Easy booking on WhatsApp and quick replies to my questions. The wait at the clinic was short and everything was well organized.",
    context: "Back pain consultation",
  },
  "review-8": {
    name: "Reviewer name 8",
    text: "What I liked most was that the doctor involved me in choosing my treatment plan and explained the options and the benefits of each.",
    context: "Knee pain consultation",
  },
};
