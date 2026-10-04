import type { ConditionSlug } from "@/data/shared/conditions";
import type { ConditionText, ItemDetails } from "@/types/content";

/**
 * Conditions — English text, keyed by slug (structure in
 * data/shared/conditions.ts).
 *
 * PLACEHOLDER CONTENT — common orthopedic complaints, written as general
 * awareness text (not diagnoses or treatment promises). Have the doctor
 * review the list and the dialog text before launch.
 */
interface DetailInput {
  lead: string;
  overview: string[];
  causes: string[];
  whenToSee: string[];
  treatment: string[];
}

/** Every condition dialog follows the same four-part structure. */
const details = ({ lead, overview, causes, whenToSee, treatment }: DetailInput): ItemDetails => ({
  lead,
  sections: [
    { title: "Overview", icon: "info", paragraphs: overview },
    { title: "Possible causes", icon: "searchCheck", items: causes },
    { title: "When to see a doctor", icon: "alertCircle", items: whenToSee },
    { title: "Diagnosis and treatment", icon: "clipboardCheck", paragraphs: treatment },
  ],
});

export const conditionsText: Record<ConditionSlug, ConditionText> = {
  "joint-pain": {
    title: "Joint Pain",
    excerpt:
      "Ongoing or recurring pain in one or more joints that affects movement or sleep and needs an assessment to find its cause.",
    imageAlt: "A person sitting on the floor holding their ankle in pain",
    symptoms: ["Pain with movement", "Swelling or redness", "Troublesome clicking"],
    details: details({
      lead: "Joint pain is a common symptom that can come from overuse, injury, inflammation or wear — and finding the cause is the most important step in choosing the right treatment.",
      overview: [
        "The pain may affect one joint or several. It can be short-lived after exertion, or persistent enough to affect movement and sleep.",
        "Describing what the pain feels like, when it happens and what comes with it helps guide the examination and the diagnosis.",
      ],
      causes: [
        "Overuse or repetitive strain on the joint",
        "Injuries and sprains",
        "Osteoarthritis",
        "Inflammation of the tendons or bursae",
        "Inflammatory conditions that need specialist assessment",
      ],
      whenToSee: [
        "Pain lasting more than two weeks",
        "Swelling, redness or warmth in the joint",
        "Pain that stops you moving or sleeping",
        "Pain together with fever or general fatigue",
      ],
      treatment: [
        "Treatment depends on the cause. It may include relative rest, therapeutic exercise and suitable medication, with regular follow-up to make sure you are improving.",
      ],
    }),
  },
  "back-pain": {
    title: "Back Pain",
    excerpt:
      "Pain in the lower or upper back that lasts for days or spreads down the leg — especially with numbness or weakness.",
    imageAlt: "A woman with her hand on her lower back in pain",
    symptoms: ["Pain spreading down the leg", "Numbness", "Difficulty bending"],
    details: details({
      lead: "Back pain is one of the most common reasons to see an orthopedic doctor. Most cases are minor and improve, but some warning signs call for a prompt assessment.",
      overview: [
        "The pain may be in the lower or upper back, and it can spread to the legs when it is linked to an irritated nerve.",
        "How you sit and work, and how active you are, play a big part in how back pain starts and whether it returns.",
      ],
      causes: [
        "Muscle strain or overuse",
        "Sitting in a poor posture for long periods",
        "A herniated disc",
        "Wear and tear in the spine",
        "Lifting heavy objects incorrectly",
      ],
      whenToSee: [
        "Pain spreading to the leg with numbness or weakness",
        "Pain after a fall or accident",
        "Pain that gets worse at night or at rest",
        "Difficulty controlling your bladder or bowels — go to the emergency department immediately",
      ],
      treatment: [
        "Treatment usually starts with conservative measures — exercise, adjusting your activities and suitable medication — with further imaging if there are nerve-related signs or no improvement.",
      ],
    }),
  },
  "sports-injuries": {
    title: "Sports Injuries",
    excerpt:
      "Sprains, tears or sudden injuries during physical activity that should be examined before you return to training.",
    imageAlt: "A player helping a teammate with a knee injury during a match",
    symptoms: ["Sudden pain", "Joint instability", "Bruising and swelling"],
    details: details({
      lead: "Sports injuries are caused by sudden movements, contact or repetitive strain. An early assessment shows how serious the injury is and helps stop it from getting worse.",
      overview: [
        "Common injuries include ankle sprains, knee ligament injuries, muscle tears and tendinitis.",
        "Going back to training before you have fully recovered is one of the main reasons injuries come back.",
      ],
      causes: [
        "A sudden twist or turn of the joint",
        "A collision or fall during play",
        "Too little warm-up or overtraining",
        "Increasing the training load too quickly",
      ],
      whenToSee: [
        "Difficulty putting weight on the limb",
        "Rapid swelling after the injury",
        "A popping sound at the moment of injury",
        "A feeling that the joint is unstable",
      ],
      treatment: [
        "Care starts with first aid and an assessment to identify the type of injury, followed by a gradual rehabilitation program for a safe return to activity.",
      ],
    }),
  },
  "stiffness-osteoarthritis": {
    title: "Joint Stiffness and Osteoarthritis",
    excerpt: "Morning stiffness or a gradual loss of movement can be early signs of osteoarthritis.",
    imageAlt: "An anatomical drawing of the knee joint",
    symptoms: ["Morning stiffness", "Limited movement", "Pain with exertion"],
    details: details({
      lead: "Joint stiffness, especially in the morning, can be an early sign of osteoarthritis — and early care helps keep you moving.",
      overview: [
        "Osteoarthritis develops slowly. It often begins with stiffness and pain after exertion, and may gradually limit movement.",
        "An active lifestyle and the right exercises can ease the symptoms noticeably.",
      ],
      causes: ["Cartilage wear with age", "Excess weight", "Previous joint injuries", "Genetic factors"],
      whenToSee: [
        "Morning stiffness that returns every day",
        "Less movement in the joint than before",
        "Pain that affects walking or work",
        "Swelling in the joint that keeps coming back",
      ],
      treatment: [
        "Treatment focuses on easing pain and improving movement through exercise, weight management and suitable medication, with other options considered at advanced stages.",
      ],
    }),
  },
  "herniated-disc": {
    title: "Herniated Disc",
    excerpt:
      "Part of a spinal disc bulges between the vertebrae and can press on a nerve, causing pain that spreads to the arm or leg.",
    imageAlt: "A woman holding her lower back with both hands",
    symptoms: ["Pain spreading to the limbs", "Numbness and tingling", "Muscle weakness"],
    details: details({
      lead: "A herniated disc happens when part of the disc between two vertebrae bulges out and may press on a nerve root, causing radiating pain and numbness.",
      overview: [
        "It most often occurs in the lower back or neck, and many cases improve with conservative treatment within weeks to months.",
        "A neurological examination — with an MRI when needed — shows where the disc has herniated and how much it affects the nerves.",
      ],
      causes: [
        "Age-related changes in the discs",
        "Lifting heavy objects incorrectly",
        "Sitting for long periods",
        "Excess weight and weak core muscles",
      ],
      whenToSee: [
        "Pain spreading to the leg or arm that doesn't improve",
        "Numbness or weakness in a limb that is getting worse",
        "Difficulty walking or standing",
        "Loss of bladder or bowel control — go to the emergency department immediately",
      ],
      treatment: [
        "Treatment usually starts with medication, therapeutic exercise and activity changes. Surgery is discussed if nerve compression persists or weakness increases.",
      ],
    }),
  },
  "frozen-shoulder": {
    title: "Frozen Shoulder",
    excerpt:
      "Pain followed by gradual stiffness that limits shoulder movement in every direction, and usually improves with time and regular treatment.",
    imageAlt: "A specialist pressing on a patient's shoulder during a manual therapy session",
    symptoms: ["Night pain", "Difficulty raising the arm", "Limited movement"],
    details: details({
      lead: "Frozen shoulder (adhesive capsulitis) is a condition in which the lining of the shoulder joint becomes inflamed and gradually stiffens, reducing movement and causing pain.",
      overview: [
        "It usually passes through stages: increasing pain, then stiffness, then a gradual return of movement.",
        "It is more common in people with diabetes and after long periods of limited shoulder movement.",
      ],
      causes: [
        "Inflammation of the shoulder joint capsule",
        "Little shoulder movement after an injury or surgery",
        "Diabetes and thyroid disorders",
        "No clear cause in some cases",
      ],
      whenToSee: [
        "Shoulder pain that keeps you from sleeping",
        "Difficulty brushing your hair or getting dressed",
        "Shoulder movement that keeps decreasing",
      ],
      treatment: [
        "Treatment aims to ease the pain and restore movement gradually with stretching exercises and physiotherapy; local injections may be used in selected cases.",
      ],
    }),
  },
  "carpal-tunnel": {
    title: "Carpal Tunnel Syndrome",
    excerpt:
      "Pressure on the median nerve at the wrist that causes numbness in the fingers and a weaker grip, often worse at night.",
    imageAlt: "A woman holding her wrist and palm in pain",
    symptoms: ["Numb fingers at night", "Weak grip", "Wrist pain"],
    details: details({
      lead: "Carpal tunnel syndrome is caused by pressure on the median nerve as it passes through a narrow tunnel at the wrist, leading to numbness and pain in the hand.",
      overview: [
        "People often feel numbness in the thumb, index and middle fingers, and may wake at night because of it.",
        "A clinical examination — with nerve conduction studies when needed — confirms the diagnosis and shows how severe the compression is.",
      ],
      causes: [
        "Repetitive hand and wrist movements",
        "Pregnancy and hormonal changes",
        "Diabetes and an underactive thyroid",
        "Previous wrist injuries or fractures",
      ],
      whenToSee: [
        "Numbness that keeps returning or wakes you up",
        "Weakness when gripping objects",
        "Shrinking of the muscles at the base of the thumb",
      ],
      treatment: [
        "The plan usually starts with a night splint, activity changes and exercises. Local injections may be used, and surgery is discussed if symptoms persist or are severe.",
      ],
    }),
  },
  osteoporosis: {
    title: "Osteoporosis",
    excerpt:
      "A gradual loss of bone density that makes bones more likely to break, often with no symptoms until a fracture happens.",
    imageAlt: "An X-ray of the pelvis and lower spine",
    symptoms: ["Fractures from minor falls", "A stooped back", "Loss of height"],
    details: details({
      lead: "Osteoporosis is a condition in which bone density falls and bone structure weakens, so bones break more easily — even after a minor fall.",
      overview: [
        "It is sometimes called a “silent disease” because it may cause no symptoms until the first fracture, often in the wrist, hip or spine.",
        "A bone density scan helps diagnose it early and estimate the risk of fractures.",
      ],
      causes: [
        "Older age and menopause",
        "Too little calcium and vitamin D",
        "Physical inactivity",
        "Smoking and some medicines, such as long-term steroids",
      ],
      whenToSee: [
        "A fracture after a minor fall",
        "Sudden back pain or a noticeable loss of height",
        "Risk factors such as a family history",
      ],
      treatment: [
        "The plan includes a diet rich in calcium and vitamin D, suitable exercise, fall prevention and medication as assessed by the doctor.",
      ],
    }),
  },
};
