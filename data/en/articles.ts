import type { ArticleSlug } from "@/data/shared/articles";
import type { ArticleText } from "@/types/content";

/**
 * Articles — English text, keyed by slug (dates and covers in
 * data/shared/articles.ts). Bodies are typed blocks — see `ArticleBlock` in
 * types/content.ts — so a CMS can store them as JSON.
 *
 * PLACEHOLDER CONTENT — general awareness drafts written for layout. Have the
 * doctor review and approve every article (or replace them) before
 * publishing.
 */
export const articlesText: Record<ArticleSlug, ArticleText> = {
  "knee-osteoarthritis": {
    title: "Knee Osteoarthritis: Early Symptoms and How to Manage Them",
    excerpt:
      "A simple guide to knee osteoarthritis: how it starts, the early signs you shouldn't ignore, and what you can do every day to ease the pain and stay mobile.",
    category: "Joint health",
    imageAlt: "A woman holding her knee while seated",
    body: [
      {
        type: "paragraph",
        text: "Knee osteoarthritis is one of the most common joint problems, especially after the age of forty. It happens when the cartilage that covers the ends of the bones inside the joint gradually wears away, so the joint loses some of its smoothness and its ability to absorb shock.",
      },
      { type: "heading", text: "How does knee osteoarthritis start?" },
      {
        type: "paragraph",
        text: "Osteoarthritis develops slowly over years. At first you may notice only mild pain after exertion or climbing stairs; clearer symptoms appear as the condition progresses.",
      },
      { type: "heading", text: "Early signs" },
      {
        type: "list",
        items: [
          "Knee pain that gets worse with long walks or stairs and eases with rest",
          "Stiffness in the morning or after sitting for a while that improves within minutes of moving",
          "A clicking or grinding sound when you bend the knee",
          "Mild swelling around the joint that keeps coming back",
        ],
      },
      { type: "heading", text: "What raises the risk?" },
      {
        type: "list",
        items: [
          "Getting older",
          "Excess weight, since every step multiplies the load on the knee",
          "Previous knee injuries, such as a meniscus or ligament tear",
          "Weak muscles around the knee",
          "Genetic factors",
        ],
      },
      { type: "heading", text: "What can you do every day?" },
      {
        type: "list",
        ordered: true,
        items: [
          "Stay active: moderate walking, swimming and stationary cycling suit most people",
          "Strengthen your thigh muscles with simple exercises — they take load off the joint",
          "Keep to a healthy weight; even losing a few kilograms can ease the pain",
          "Wear comfortable, supportive shoes",
          "Spread your activity through the day and avoid very long spells of standing or sitting",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Tip",
        text: "Don't stop moving altogether because of pain — inactivity weakens the muscles and makes stiffness worse. Choose a suitable activity and build up gradually.",
      },
      { type: "heading", text: "When should you see a doctor?" },
      {
        type: "paragraph",
        text: "It's worth getting assessed if the pain lasts more than a few weeks, keeps coming back with swelling, or affects your sleep or your ability to walk. A clinical examination and X-rays show how advanced the osteoarthritis is and help set a suitable treatment plan, which may include therapeutic exercise and medication, with other options in advanced cases.",
      },
    ],
  },
  "lower-back-pain": {
    title: "Lower Back Pain: Common Causes and When to Worry",
    excerpt:
      "Most lower back pain is minor and improves within weeks, but some signs call for a medical assessment. Learn the common causes and the right steps to take.",
    category: "Spine",
    imageAlt: "A specialist examining the lower back of a patient lying down",
    body: [
      {
        type: "paragraph",
        text: "Most people have lower back pain at some point in their lives. The good news is that most cases are linked to strained muscles or ligaments, and they improve gradually with the right kind of movement and simple care.",
      },
      { type: "heading", text: "Common causes" },
      {
        type: "list",
        items: [
          "A muscle strain after lifting something heavy or a sudden movement",
          "Sitting for long periods in a poor posture",
          "Weak abdominal and back muscles",
          "A herniated disc",
          "Age-related changes in the vertebrae and discs",
        ],
      },
      { type: "heading", text: "What to do in the first few days" },
      {
        type: "list",
        ordered: true,
        items: [
          "Avoid complete bed rest — gentle movement helps you recover faster",
          "Use warm compresses to relax tight muscles",
          "Modify painful activities for a while instead of stopping everything",
          "Check with your doctor before taking painkillers, especially if you have a long-term condition",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Signs that need urgent assessment",
        text: "See a doctor immediately if back pain comes with increasing weakness in your legs, numbness around the pelvis, difficulty controlling your bladder or bowels, an unexplained fever, or if the pain started after a fall or accident.",
      },
      { type: "heading", text: "Prevention is better than cure" },
      {
        type: "paragraph",
        text: "Strengthening your core muscles, keeping to a healthy weight, taking short movement breaks during desk work, and lifting with your knees bent rather than bending your back all help reduce the chance of the pain coming back.",
      },
      { type: "heading", text: "When should you see an orthopedic doctor?" },
      {
        type: "paragraph",
        text: "If the pain lasts more than four to six weeks despite care at home, spreads down your leg, or keeps returning in a way that affects your work and daily life, a medical assessment helps find the cause and set a suitable treatment plan.",
      },
    ],
  },
  "sports-first-aid": {
    title: "First Aid for Sports Injuries: What to Do in the First Few Minutes",
    excerpt:
      "The first minutes after a sports injury make a real difference to recovery. Practical steps for sprains and bruises, and when to stop and get checked.",
    category: "Sports injuries",
    imageAlt: "An injured footballer lying on the pitch while a teammate checks on him",
    body: [
      {
        type: "paragraph",
        text: "Sports injuries happen at every level of play, from friendly matches to competitions. Handling them correctly in the first few minutes reduces swelling and pain and supports a better recovery.",
      },
      { type: "heading", text: "Stop playing straight away" },
      {
        type: "paragraph",
        text: "Playing on after an injury can turn a minor problem into a more serious one. If you feel sudden pain, hear a pop or no longer trust a joint to hold, stop and get it assessed.",
      },
      { type: "heading", text: "First aid for sprains and bruises" },
      {
        type: "list",
        ordered: true,
        items: [
          "Rest: stop putting weight on the injured limb",
          "Ice: apply a cold pack wrapped in a cloth for 15 to 20 minutes, and repeat every few hours on the first day",
          "Compression: use a compression bandage firmly, but not too tightly",
          "Elevation: raise the injured limb above the level of your heart to reduce swelling",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Never put ice directly on the skin",
        text: "Always wrap ice in a cloth to avoid a cold injury to the skin, and don't go beyond the recommended time for each application.",
      },
      { type: "heading", text: "Signs that you need to see a doctor" },
      {
        type: "list",
        items: [
          "Difficulty walking or putting weight on the limb after the injury",
          "An obvious deformity of the joint or bone",
          "Severe, rapid swelling",
          "Numbness or coldness in the injured limb",
          "Pain that doesn't improve within a few days",
        ],
      },
      { type: "heading", text: "Getting back to play" },
      {
        type: "paragraph",
        text: "Don't rely on the pain going away as your only sign that you're ready. Your muscles and ligaments first need to regain their strength, flexibility and balance, and a gradual rehabilitation program helps you return safely and lowers the risk of re-injury.",
      },
    ],
  },
  "bone-health": {
    title: "Osteoporosis: How to Protect Your Bones at Every Age",
    excerpt:
      "Osteoporosis often shows no symptoms until the first fracture. Learn about the risk factors, the role of diet and exercise, and when a bone density scan is recommended.",
    category: "Bone health",
    imageAlt: "The clasped hands of an older person",
    body: [
      {
        type: "paragraph",
        text: "Bone mass is built up during childhood and early adulthood, and then slowly declines with age. When that decline speeds up, bones become weaker and more likely to break — the condition known as osteoporosis.",
      },
      { type: "heading", text: "Why is it called a “silent disease”?" },
      {
        type: "paragraph",
        text: "Because it often causes no pain or obvious symptoms until a bone breaks — often in the wrist, hip or spine, sometimes after only a minor fall.",
      },
      { type: "heading", text: "What raises the risk of osteoporosis?" },
      {
        type: "list",
        items: [
          "Getting older, especially for women after menopause",
          "A family history of osteoporosis or hip fractures",
          "Too little calcium and vitamin D",
          "Physical inactivity",
          "Smoking",
          "Long-term use of some medicines, such as steroids",
        ],
      },
      { type: "heading", text: "Steps to protect your bones" },
      {
        type: "list",
        ordered: true,
        items: [
          "Include calcium-rich foods in your diet, such as dairy products and leafy greens",
          "Get moderate sun exposure, and ask your doctor whether you need vitamin D supplements",
          "Do weight-bearing exercise such as walking and light resistance training",
          "Avoid smoking and cut down on high-caffeine drinks",
          "Make your home safer from falls, with good lighting and non-slip floors",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Bone density scans",
        text: "A bone density scan helps detect osteoporosis early, before any fractures happen. Ask your doctor when it's right for you based on your age and risk factors.",
      },
      { type: "heading", text: "Treatment is possible" },
      {
        type: "paragraph",
        text: "If osteoporosis is confirmed, treatment plans combine diet, exercise and suitable medication, as assessed by the doctor, to lower the risk of fractures and maintain quality of life.",
      },
    ],
  },
  "sitting-posture": {
    title: "Sitting Well at Your Desk: A Practical Guide to Protecting Your Back and Neck",
    excerpt:
      "Long hours at a screen are a major cause of back and neck pain. Simple changes to your workspace and daily habits can make a big difference.",
    category: "Lifestyle",
    imageAlt: "A woman working on a laptop while sitting in an ergonomic office chair",
    body: [
      {
        type: "paragraph",
        text: "Many of us spend long hours every day at a computer or on our phones, and over time a poor posture can turn into lasting pain in the neck, shoulders and lower back.",
      },
      { type: "heading", text: "Set up your workspace" },
      {
        type: "list",
        items: [
          "Place the top of the screen at or slightly below eye level, about an arm's length away",
          "Choose a chair that supports your lower back, or put a small cushion behind you",
          "Keep your feet flat on the floor and your knees at roughly a right angle",
          "Keep the keyboard and mouse close, so your elbows stay by your sides",
          "If you use a laptop for long periods, add a stand and a separate keyboard",
        ],
      },
      { type: "heading", text: "Keep moving regularly" },
      {
        type: "paragraph",
        text: "The best posture is your next one — the body doesn't like staying still for long, even in a good position. Change position often and take a short movement break every 30 to 45 minutes.",
      },
      { type: "heading", text: "Simple exercises at work" },
      {
        type: "list",
        ordered: true,
        items: [
          "Gently draw your chin back to lengthen your neck, and repeat ten times",
          "Lift your shoulders toward your ears, then slowly let them drop",
          "Squeeze your shoulder blades together for a few seconds",
          "Stand up and walk for two minutes, or climb a few stairs",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Watch your phone posture",
        text: "Looking down at your phone with your head bent forward increases the load on your neck. Raise the phone to eye level whenever you can.",
      },
      { type: "heading", text: "When should you see a doctor?" },
      {
        type: "paragraph",
        text: "If the pain continues after you've improved your work posture, or comes with numbness in your arms or frequent headaches, a medical assessment helps find the cause and the right treatment.",
      },
    ],
  },
  "physiotherapy-recovery": {
    title: "Physiotherapy After an Injury: Why Rest Alone Isn't Enough",
    excerpt:
      "Rest is part of recovery, but it isn't everything. Learn how physiotherapy helps restore movement and strength, and how to get the most from your sessions.",
    category: "Rehabilitation and physiotherapy",
    imageAlt: "A physiotherapist helping a patient through a stretching exercise",
    body: [
      {
        type: "paragraph",
        text: "After an injury, a fracture or surgery, many people assume that rest alone will be enough to recover. But long periods of inactivity can weaken muscles and stiffen joints — and that is where physiotherapy comes in.",
      },
      { type: "heading", text: "What does physiotherapy offer?" },
      {
        type: "list",
        items: [
          "Gradually restoring the joint's range of motion",
          "Strengthening muscles weakened by the injury or by inactivity",
          "Improving balance and movement control to reduce the risk of re-injury",
          "Relieving pain with techniques chosen by your therapist",
          "Teaching you home exercises that build on your sessions",
        ],
      },
      { type: "heading", text: "The stages of rehabilitation" },
      {
        type: "list",
        ordered: true,
        items: [
          "Protecting the injured area and easing pain and swelling",
          "Restoring movement and flexibility",
          "Gradual strengthening",
          "Returning to daily or sporting activities",
        ],
      },
      {
        type: "paragraph",
        text: "How long each stage takes depends on the type and severity of the injury, and your doctor and therapist will decide when you're ready to move on to the next one.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Home exercises are essential",
        text: "Sessions alone aren't enough — keeping up your home exercises between sessions is one of the most important factors in a successful recovery.",
      },
      { type: "heading", text: "How to get the most from your sessions" },
      {
        type: "list",
        items: [
          "Keep to your session schedule and your home exercises",
          "Tell your therapist about any unusual pain during exercise",
          "Don't rush back to full activity before the agreed time",
          "Note your progress and any difficulties to discuss at follow-up",
        ],
      },
    ],
  },
  "mri-guide": {
    title: "When Do You Need an MRI? A Simple Guide for Patients",
    excerpt:
      "Not every bone or joint pain needs an MRI. Learn how the types of imaging differ, when your doctor may request an MRI, and how to prepare for one.",
    category: "Tests and imaging",
    imageAlt: "An MRI scanner in a radiology room",
    body: [
      {
        type: "paragraph",
        text: "With modern scans so widely available, many patients ask about an MRI at their very first visit. But the most suitable test depends on your complaint and on what the clinical examination finds — not every pain needs an MRI.",
      },
      { type: "heading", text: "How the types of imaging differ" },
      {
        type: "list",
        items: [
          "Plain X-rays: best for assessing bones, fractures and osteoarthritis",
          "Ultrasound: useful for assessing some tendons and tissues close to the skin",
          "MRI: shows soft tissues in detail, such as cartilage, ligaments, spinal discs and nerves",
          "CT scans: give detailed images of bone in certain cases",
        ],
      },
      { type: "heading", text: "When might your doctor request an MRI?" },
      {
        type: "list",
        items: [
          "A suspected ligament or cartilage injury inside a joint",
          "Back or neck pain with nerve-related signs such as numbness or weakness",
          "No improvement despite an adequate period of treatment",
          "The need for precise planning before a treatment procedure",
        ],
      },
      { type: "heading", text: "How to prepare for an MRI" },
      {
        type: "list",
        ordered: true,
        items: [
          "Tell your doctor if you have a pacemaker, any implanted device or metal fragments in your body",
          "Remove jewelry, watches and other metal items before the scan",
          "Let the team know if you are pregnant or uneasy in enclosed spaces",
          "Keep still during the scan so the images are clear",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Results are read alongside the examination",
        text: "An MRI can show normal age-related changes that don't cause any pain, so results are always interpreted in light of your symptoms and the clinical examination — never on their own.",
      },
      {
        type: "paragraph",
        text: "If you have previous scans, bring them to your visit; they may spare you a repeat test or help compare changes over time.",
      },
    ],
  },
};
