import type { ServiceSlug } from "@/data/shared/services";
import type { ItemDetails, ServiceText } from "@/types/content";

/**
 * Services — English text, keyed by slug (structure in data/shared/services.ts).
 *
 * PLACEHOLDER CONTENT — general orthopedic service areas pending the
 * doctor's confirmed list. `details` is general patient-education text shown
 * in the /services detail dialog. Treatment options are phrased as
 * possibilities, not promises — have the doctor review and confirm each list
 * before launch.
 */
interface DetailInput {
  lead: string;
  overview: string[];
  indications: string[];
  options: string[];
  recovery: string[];
  recoverySteps: string[];
}

/** Every service dialog follows the same four-part structure. */
const details = ({ lead, overview, indications, options, recovery, recoverySteps }: DetailInput): ItemDetails => ({
  lead,
  sections: [
    { title: "Overview", icon: "info", paragraphs: overview },
    { title: "When you may need this service", icon: "listChecks", items: indications },
    { title: "Possible treatment options", icon: "stethoscope", items: options },
    { title: "Recovery and follow-up", icon: "repeat", paragraphs: recovery, items: recoverySteps },
  ],
});

export const servicesText: Record<ServiceSlug, ServiceText> = {
  "knee-joint-pain": {
    title: "Knee and Joint Pain Treatment",
    description:
      "Assessing the causes of knee and joint pain and building a treatment plan that suits the condition and your lifestyle.",
    imageAlt: "A specialist examining the knee of a patient lying on an examination couch",
    details: details({
      lead: "Knee pain is one of the most common orthopedic complaints, and it has many possible causes — from overuse and injury to joint wear and tendon inflammation. The first step is always to pinpoint the cause before choosing a treatment.",
      overview: [
        "The assessment starts with your story: when the pain began, what makes it better or worse, and whether it comes with swelling, clicking or a sense of instability.",
        "After the clinical examination, plain X-rays or an MRI may be requested when needed, and a treatment plan is then shaped around the nature of your condition and your daily activity.",
      ],
      indications: [
        "Knee pain that lasts more than two weeks or keeps returning with movement",
        "Swelling or warmth around the joint",
        "Difficulty climbing stairs or getting up from a chair",
        "A feeling that the knee gives way or locks as you move",
        "Pain after a sudden injury or twist",
      ],
      options: [
        "Activity changes and a therapeutic exercise program to strengthen the muscles around the joint",
        "Medication to ease pain and inflammation, as assessed by the doctor",
        "Physiotherapy and rehabilitation sessions",
        "Joint injections in selected cases",
        "Discussing surgical options when conservative care isn't enough or the injury calls for it",
      ],
      recovery: [
        "Recovery time depends on the cause and the treatment chosen. Many overuse problems improve within weeks with consistent exercise, while injuries and surgical procedures need a longer rehabilitation program.",
      ],
      recoverySteps: [
        "Follow-up visits to review progress and adjust the plan",
        "A gradual return to activity and sport",
        "Advice on keeping a healthy weight and protecting the joint",
      ],
    }),
  },
  "spine-back-pain": {
    title: "Back and Neck Pain",
    description:
      "Examining problems of the spine, back and neck, and telling their causes apart to choose the most suitable treatment.",
    imageAlt: "A spine model showing the lumbar vertebrae and discs",
    details: details({
      lead: "Back and neck pain can come from muscle strain or poor posture, and is sometimes linked to problems with the discs or vertebrae. Telling these causes apart is the key to the right treatment.",
      overview: [
        "The assessment checks spinal movement, muscle strength, sensation and reflexes to find out whether the pain is muscular or related to pressure on a nerve.",
        "Most back pain improves with conservative treatment; advanced imaging is reserved for signs that call for it.",
      ],
      indications: [
        "Back or neck pain lasting more than a few weeks",
        "Pain that spreads into the arm or leg",
        "Numbness or weakness in the arms or legs",
        "Pain that wakes you at night or gets worse at night",
        "Pain after a fall or injury",
      ],
      options: [
        "Therapeutic exercises to strengthen the back and core and improve flexibility",
        "Correcting sitting and working postures",
        "Medication to relieve pain and muscle spasm",
        "Physiotherapy sessions",
        "Discussing surgery for nerve compression that doesn't respond to treatment",
      ],
      recovery: [
        "Many patients improve gradually over a few weeks when they follow their treatment plan, and keeping up the exercises helps reduce the chance of the pain coming back.",
      ],
      recoverySteps: ["Regular follow-up of pain and movement", "A home exercise program", "Advice on a healthy work setup"],
    }),
  },
  "sports-injuries": {
    title: "Sports Injuries",
    description: "Caring for sports injuries from diagnosis through a gradual, safe return to activity.",
    imageAlt: "An athlete wearing a knee brace next to a basketball",
    details: details({
      lead: "Sports injuries include sprains, muscle and ligament tears and cartilage injuries. Handling them correctly from the start supports a safe return to activity.",
      overview: [
        "The assessment focuses on how the injury happened, how stable the joint is and how strong the muscles are, with suitable imaging when needed to identify the type and grade of injury.",
        "The plan is built around your sporting goal: getting back to play safely while reducing the risk of re-injury.",
      ],
      indications: [
        "Sudden pain during training or a match",
        "Rapid swelling or bruising after the injury",
        "Difficulty putting weight on the injured limb",
        "A feeling that the joint is unstable or slipping",
        "Pain that keeps returning when you go back to training",
      ],
      options: [
        "First aid and relative rest in the early phase",
        "Temporary support with a brace when needed",
        "A gradual rehabilitation program to restore strength and flexibility",
        "Balance and movement-control exercises",
        "Discussing surgery for certain ligament or cartilage injuries",
      ],
      recovery: [
        "The return to sport is divided into clear stages, and you only move on to the next stage once specific strength and movement targets are met.",
      ],
      recoverySteps: [
        "Functional tests before returning to competition",
        "Injury-prevention warm-up and strengthening exercises",
        "Follow-up to adjust training loads",
      ],
    }),
  },
  fractures: {
    title: "Fracture Diagnosis and Treatment",
    description: "Managing fractures and bone injuries, and following each stage of healing step by step.",
    imageAlt: "A leg supported by a cast while walking",
    details: details({
      lead: "Fractures vary in type, location and severity. Treatment depends on how stable the fracture is and on the patient's age and general health, with the aim of healing the bone in the right position and restoring function.",
      overview: [
        "Fracture care begins with an examination that checks the circulation and nerves around the injury, followed by X-rays to identify the type of fracture and how far the bone has shifted.",
        "Some fractures only need a cast, while others need to be realigned and fixed surgically, as assessed by the doctor.",
      ],
      indications: [
        "Severe pain after a fall or accident",
        "An obvious deformity or rapid swelling of the limb",
        "Difficulty moving the limb or putting weight on it",
        "Persistent pain in a bone after repetitive strain (stress fractures)",
      ],
      options: [
        "Immobilizing the fracture with a cast or brace",
        "Realigning the fracture (reduction) when needed",
        "Surgical fixation for unstable fractures",
        "Pain relief and follow-up X-rays to monitor healing",
      ],
      recovery: [
        "Bones usually take several weeks to heal, depending on the type and location of the fracture and the patient's age. A rehabilitation program then helps restore movement and strength.",
      ],
      recoverySteps: [
        "Follow-up X-rays to confirm healing",
        "Exercises to restore range of motion once the cast comes off",
        "Nutrition advice to support bone health",
      ],
    }),
  },
  "shoulder-pain": {
    title: "Shoulder Pain",
    description: "Assessing stiffness and pain in the shoulder and setting out the treatment options.",
    imageAlt: "A hands-on examination of the shoulder joint",
    details: details({
      lead: "The shoulder is one of the most mobile joints in the body, which makes it prone to problems such as tendinitis, rotator cuff injuries and frozen shoulder. An accurate diagnosis determines the right treatment.",
      overview: [
        "The examination assesses range of motion and strength in different directions, along with specific tests for the tendons and ligaments.",
        "An ultrasound or MRI may be requested when needed to assess the tendons and soft tissues.",
      ],
      indications: [
        "Pain when you raise your arm or lie on your shoulder",
        "A gradual loss of shoulder movement",
        "Weakness when lifting objects",
        "Pain after a previous injury or dislocation",
      ],
      options: [
        "Therapeutic exercises to restore movement and strengthen the muscles",
        "Medication to ease pain and inflammation",
        "Joint injections in selected cases",
        "Discussing surgery for certain tendon injuries or instability",
      ],
      recovery: [
        "The shoulder usually needs a regular rehabilitation program, and full improvement can take longer than in some other joints — so sticking with the exercises is essential.",
      ],
      recoverySteps: [
        "Daily home exercises",
        "Follow-up to measure gains in range of motion",
        "A gradual return to overhead activities",
      ],
    }),
  },
  osteoarthritis: {
    title: "Osteoarthritis",
    description: "A complete plan for managing osteoarthritis and reducing its impact on everyday movement.",
    imageAlt: "Hands feeling the finger joints",
    details: details({
      lead: "Osteoarthritis is a long-term condition in which joint cartilage gradually wears down. With early diagnosis and the right plan, pain can be eased, movement improved and quality of life maintained.",
      overview: [
        "It most often affects the knees, hips, hands and spine, and becomes more common with age, excess weight or previous injuries.",
        "Diagnosis is based on your symptoms, the clinical examination and X-rays, and treatment depends on how advanced the condition is and how it affects your daily life.",
      ],
      indications: [
        "Joint pain that worsens with activity and eases with rest",
        "Stiffness in the morning or after sitting for a while",
        "Grinding or crackling when the joint moves",
        "A gradual decline in your ability to walk or climb stairs",
      ],
      options: [
        "Strengthening and flexibility exercises",
        "Weight management to reduce the load on the joints",
        "Pain-relief medication",
        "Joint injections in selected cases",
        "Discussing surgical options at advanced stages",
      ],
      recovery: [
        "Osteoarthritis needs long-term follow-up. The aim is to control symptoms and preserve movement, adjusting the plan as your needs change.",
      ],
      recoverySteps: [
        "Regular follow-up of your symptoms",
        "A suitable physical activity program",
        "Walking aids when needed to reduce the load",
      ],
    }),
  },
  "hand-wrist": {
    title: "Hand and Wrist",
    description: "Diagnosing pain in the hand, wrist and fingers, and following the recovery of their function.",
    imageAlt: "An X-ray of the bones of the wrist and hand",
    details: details({
      lead: "Hand and wrist problems directly affect everyday tasks. They include carpal tunnel syndrome, tendinitis, fractures and ligament injuries.",
      overview: [
        "The assessment checks sensation, grip strength and the movement of the fingers and wrist, with nerve conduction studies or imaging requested when needed.",
        "The plan is designed to restore the function of your hand at work and in daily life.",
      ],
      indications: [
        "Numbness or tingling in the fingers, especially at night",
        "A weak grip or dropping objects",
        "Wrist pain or swelling after a fall",
        "Pain when moving the thumb or fingers",
        "A finger that locks or is hard to straighten",
      ],
      options: [
        "A splint or night brace",
        "Changing the activities that strain the hand",
        "Hand therapy exercises",
        "Local injections in selected cases",
        "Discussing surgery when needed",
      ],
      recovery: [
        "Many hand and wrist problems improve with conservative treatment, while surgical cases need rehabilitation to restore movement and strength.",
      ],
      recoverySteps: ["Daily hand exercises", "Follow-up of sensation and strength", "Advice on a hand-friendly work setup"],
    }),
  },
  "foot-ankle": {
    title: "Foot and Ankle",
    description: "Treating foot and ankle pain and recurrent sprains, and improving stability as you move.",
    imageAlt: "Fitting a foot and ankle brace",
    details: details({
      lead: "Your feet and ankles carry your body weight with every step, so problems such as recurrent sprains, heel pain and tendinitis have a big impact on daily movement.",
      overview: [
        "The examination looks at how you walk, the shape of your foot, the stability of your ankle and where the pain is, with imaging when needed.",
        "The plan aims to ease pain, improve stability and reduce the chance of the injury coming back.",
      ],
      indications: [
        "Heel pain, especially with your first steps in the morning",
        "Repeated ankle sprains",
        "Swelling that persists after an injury",
        "Pain that worsens with walking or long periods of standing",
        "A change in the shape of the foot or toes",
      ],
      options: [
        "Stretching and strengthening exercises",
        "Choosing suitable footwear and foot supports",
        "Temporary support with an ankle brace",
        "Pain-relief medication",
        "Discussing surgery for chronic instability or severe injuries",
      ],
      recovery: [
        "Most patients improve gradually with regular exercise and suitable footwear, and ligament injuries need balance training to reduce repeat sprains.",
      ],
      recoverySteps: ["Balance and stability exercises", "A gradual return to walking and sport", "Follow-up to review progress"],
    }),
  },
};
