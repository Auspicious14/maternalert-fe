// ═══════════════════════════════════════════════════════════════════════════
// FILE: constants/fetal-development.ts
// Hardcoded weekly fetal development content — works fully offline
// Covers weeks 4–42. Your co-founder should review clinical content.
// ═══════════════════════════════════════════════════════════════════════════

export interface FetalWeekData {
  week: number;
  size: string;          // fruit/object comparison
  sizeEmoji: string;
  weight: string;
  length: string;
  headline: string;      // one sentence — what's most exciting this week
  babyDevelopment: string[];   // 3-4 bullet points about baby
  motherChanges: string[];     // 2-3 bullet points about mother's body
  tip: string;           // one actionable tip for the week
  trimester: 1 | 2 | 3;
}

export const FETAL_DEVELOPMENT: Record<number, FetalWeekData> = {
  4: {
    week: 4,
    size: "poppy seed",
    sizeEmoji: "🌱",
    weight: "less than 1g",
    length: "0.2cm",
    headline: "Your baby has just implanted in your uterus and is the size of a poppy seed.",
    babyDevelopment: [
      "The fertilised egg has divided many times and is now a tiny ball of cells called a blastocyst",
      "It has just burrowed into the lining of your uterus — this is called implantation",
      "The placenta and amniotic sac are beginning to form",
      "The cells that will become your baby's brain, spinal cord, heart, and other organs are already organising themselves",
    ],
    motherChanges: [
      "You may have missed your period this week — this is often the first sign of pregnancy",
      "Some women feel slightly bloated or notice light spotting from implantation",
      "Breast tenderness and mild fatigue may begin",
    ],
    tip: "Start taking folic acid (400 micrograms daily) if you have not already — it greatly reduces the risk of spinal cord defects.",
    trimester: 1,
  },
  5: {
    week: 5,
    size: "sesame seed",
    sizeEmoji: "🌾",
    weight: "less than 1g",
    length: "0.5cm",
    headline: "Your baby's heart is beginning to form and will soon start beating.",
    babyDevelopment: [
      "The neural tube — which becomes the brain and spinal cord — is forming and closing",
      "The tiny heart is developing and will begin beating around this week",
      "Three layers of cells are forming that will become all the organs and tissues",
      "Tiny arm and leg buds are starting to appear",
    ],
    motherChanges: [
      "Morning sickness may begin — nausea can occur at any time of day",
      "You may feel more tired than usual as your body works hard to support early pregnancy",
      "Frequent urination may start as hormones increase blood flow to your kidneys",
    ],
    tip: "Eat small, frequent meals to manage nausea. Plain foods like crackers, rice, or bread can help settle your stomach.",
    trimester: 1,
  },
  6: {
    week: 6,
    size: "lentil",
    sizeEmoji: "🫘",
    weight: "less than 1g",
    length: "0.6cm",
    headline: "Your baby's heart is beating about 110 times per minute this week.",
    babyDevelopment: [
      "The heart is now beating and can sometimes be seen on an early ultrasound",
      "Facial features are beginning to take shape — dark spots where the eyes and nostrils will be",
      "The brain is growing rapidly — it is producing about 100 new cells every minute",
      "Small buds that will become arms and legs are developing",
    ],
    motherChanges: [
      "Nausea and vomiting may be strongest around this time",
      "Your uterus has doubled in size, though you won't look pregnant yet",
      "Heightened sense of smell is common and can worsen nausea",
    ],
    tip: "Stay hydrated even if nausea makes drinking difficult. Try sipping small amounts of water, ginger tea, or clear fluids throughout the day.",
    trimester: 1,
  },
  7: {
    week: 7,
    size: "blueberry",
    sizeEmoji: "🫐",
    weight: "less than 1g",
    length: "1.3cm",
    headline: "Your baby's brain is growing so fast it is producing 100 new cells every minute.",
    babyDevelopment: [
      "The brain and head are growing very rapidly",
      "Tiny hands and feet are developing from the arm and leg buds, though they look like paddles",
      "The digestive tract and lungs are beginning to form",
      "Your baby already has a face — with nostrils, a mouth, and the beginnings of eyes",
    ],
    motherChanges: [
      "Fatigue is often very strong in the first trimester — rest when you can",
      "Food aversions are common — foods you usually enjoy may suddenly smell or taste wrong",
      "Saliva production may increase, which some women find uncomfortable",
    ],
    tip: "This is a good time to book your first antenatal visit if you have not done so already.",
    trimester: 1,
  },
  8: {
    week: 8,
    size: "kidney bean",
    sizeEmoji: "🫘",
    weight: "1g",
    length: "1.6cm",
    headline: "All of your baby's major organs have begun to form this week.",
    babyDevelopment: [
      "All major organs — heart, brain, lungs, kidneys, liver — are now developing",
      "Fingers and toes are beginning to form",
      "Your baby is starting to move, though you cannot feel it yet",
      "The tail that embryos have in early development has now disappeared",
    ],
    motherChanges: [
      "Your breasts may feel larger and more tender",
      "You may notice your waistline is slightly thicker",
      "Mood swings are common due to hormone changes",
    ],
    tip: "Avoid alcohol, tobacco, and unprescribed medications — these can harm your baby's development at this critical stage.",
    trimester: 1,
  },
  9: {
    week: 9,
    size: "cherry",
    sizeEmoji: "🍒",
    weight: "2g",
    length: "2.3cm",
    headline: "Your baby's essential body parts are all present, though still developing.",
    babyDevelopment: [
      "Tiny muscles are forming and your baby can make small movements",
      "The face now has distinct features — eyelids, a nose, and a mouth",
      "Fingers and toes are more defined",
      "The heart has divided into four chambers and beats about 170 times per minute",
    ],
    motherChanges: [
      "You may need to urinate more frequently",
      "Bloating and gas are common as the digestive system slows down",
      "Some women experience constipation — eating fibre-rich foods and drinking water helps",
    ],
    tip: "Eat foods rich in iron such as beans, dark green vegetables, and liver to help prevent anaemia.",
    trimester: 1,
  },
  10: {
    week: 10,
    size: "strawberry",
    sizeEmoji: "🍓",
    weight: "4g",
    length: "3.1cm",
    headline: "Your baby is now officially called a fetus and has all its essential organs.",
    babyDevelopment: [
      "Your baby has graduated from embryo to fetus — all essential organs are present",
      "Tiny fingernails are beginning to grow",
      "The spine is visible and the spinal cord nerves are growing",
      "Your baby can swallow and make small movements with its limbs",
    ],
    motherChanges: [
      "Morning sickness may start to ease for some women",
      "Visible veins on your breasts and abdomen are normal — increased blood supply",
      "Some women notice a faint dark line appearing on their abdomen (linea nigra)",
    ],
    tip: "Ask your clinic about your booking blood tests (blood level, blood group, HIV, syphilis, hepatitis B) and an ultrasound scan before 24 weeks to confirm your dates.",
    trimester: 1,
  },
  11: {
    week: 11,
    size: "large grape",
    sizeEmoji: "🍇",
    weight: "7g",
    length: "4.1cm",
    headline: "Your baby is now swallowing amniotic fluid and practising breathing movements.",
    babyDevelopment: [
      "Your baby's head is still very large compared to its body but is rounding out",
      "Tooth buds are forming underneath the gums",
      "Your baby is now swallowing amniotic fluid",
      "Hands and feet can open and close",
    ],
    motherChanges: [
      "Your uterus can now be felt just above your pubic bone",
      "Nausea often begins to improve around this time",
      "You may begin to notice a small bump",
    ],
    tip: "Continue taking your folic acid and iron supplements as directed by your health worker.",
    trimester: 1,
  },
  12: {
    week: 12,
    size: "lime",
    sizeEmoji: "🍋",
    weight: "14g",
    length: "5.4cm",
    headline: "Your baby's reflexes are developing — fingers will curl if something touches them.",
    babyDevelopment: [
      "Most of your baby's critical development is complete — the rest of pregnancy is about growth",
      "Your baby can kick, stretch, and open its mouth",
      "The kidneys are producing urine which is released into the amniotic fluid",
      "Reflexes are developing — fingers will curl when touched",
    ],
    motherChanges: [
      "The risk of miscarriage drops significantly after 12 weeks",
      "Energy levels often improve as the first trimester ends",
      "You may be showing more noticeably now",
    ],
    tip: "This is a good time to share the news of your pregnancy if you have been waiting. You are entering the second trimester soon.",
    trimester: 1,
  },
  13: {
    week: 13,
    size: "peach",
    sizeEmoji: "🍑",
    weight: "23g",
    length: "7.4cm",
    headline: "Welcome to the second trimester — many women start to feel much better now.",
    babyDevelopment: [
      "Your baby's intestines have moved from the umbilical cord into the abdomen",
      "The vocal cords are beginning to form",
      "Your baby can make facial expressions",
      "Unique fingerprints are forming on the fingertips",
    ],
    motherChanges: [
      "Energy usually returns as the second trimester begins",
      "Nausea typically reduces significantly",
      "Your bump may become more noticeable",
    ],
    tip: "This is a good time to tell your workplace about your pregnancy if you need adjustments to your work or plan to take maternity leave.",
    trimester: 2,
  },
  14: {
    week: 14,
    size: "lemon",
    sizeEmoji: "🍋",
    weight: "43g",
    length: "8.7cm",
    headline: "Your baby's facial muscles are developed enough to make expressions like squinting.",
    babyDevelopment: [
      "Your baby's face can now squint and frown",
      "Fine hair called lanugo is beginning to cover the body to keep your baby warm",
      "The liver is producing bile and the spleen is helping produce red blood cells",
      "Your baby's sex organs are now developed enough to be visible on ultrasound",
    ],
    motherChanges: [
      "Increased energy and reduced nausea make this a more comfortable time for many women",
      "Your appetite may increase as morning sickness eases",
      "Round ligament pain — sharp pains on the sides of your abdomen — is common as your uterus grows",
    ],
    tip: "Eat a varied diet with plenty of protein, iron-rich foods, and fruits and vegetables to support your baby's rapid growth.",
    trimester: 2,
  },
  16: {
    week: 16,
    size: "avocado",
    sizeEmoji: "🥑",
    weight: "100g",
    length: "11.6cm",
    headline: "Your baby can now hear sounds — talk, sing, or play music.",
    babyDevelopment: [
      "Your baby's ears are developed enough to hear sounds from outside the womb",
      "Eyes can make small movements though the eyelids are still fused shut",
      "The backbone and tiny muscles are strong enough to hold the head erect",
      "Your baby is practising breathing movements with amniotic fluid",
    ],
    motherChanges: [
      "You may start to feel your baby's first movements — like a gentle fluttering called quickening",
      "Your bump is now clearly visible",
      "Skin changes such as darkening around the nipples and the linea nigra are common",
    ],
    tip: "Talk or sing to your baby — they can hear you. This is also a bonding experience for partners.",
    trimester: 2,
  },
  20: {
    week: 20,
    size: "banana",
    sizeEmoji: "🍌",
    weight: "300g",
    length: "25.6cm",
    headline: "Halfway there — your baby is now measured from head to toe.",
    babyDevelopment: [
      "Your baby is now measured from crown to heel rather than crown to bottom",
      "The skin is covered with a white protective coating called vernix caseosa",
      "Eyebrows and eyelashes are growing",
      "Your baby sleeps and wakes in regular cycles",
    ],
    motherChanges: [
      "Your uterus has reached the level of your navel",
      "You should be feeling regular fetal movements by now",
      "Back pain and leg cramps become more common as your bump grows",
    ],
    tip: "Your anomaly scan (mid-pregnancy ultrasound) is usually done around 18–22 weeks. This checks your baby's anatomy in detail.",
    trimester: 2,
  },
  24: {
    week: 24,
    size: "ear of corn",
    sizeEmoji: "🌽",
    weight: "600g",
    length: "30cm",
    headline: "Your baby now has a chance of survival if born early with specialist hospital care.",
    babyDevelopment: [
      "Your baby's lungs are producing surfactant — the substance needed to breathe air after birth",
      "The brain is developing rapidly",
      "Your baby's face is fully formed with eyelashes and eyebrows",
      "Taste buds have formed and your baby can taste the amniotic fluid",
    ],
    motherChanges: [
      "You may notice Braxton Hicks contractions — irregular tightening of the uterus that is not labour",
      "Swelling of the feet and ankles is common in the second half of pregnancy",
      "Stretch marks may begin to appear",
    ],
    tip: "Get to know your baby's usual pattern of movements. There is no set number to count. If your baby moves less than usual, or the pattern changes, contact your clinic the same day.",
    trimester: 2,
  },
  28: {
    week: 28,
    size: "aubergine",
    sizeEmoji: "🍆",
    weight: "1kg",
    length: "37.6cm",
    headline: "Welcome to the third trimester — your baby is gaining weight rapidly now.",
    babyDevelopment: [
      "Your baby can now open and close its eyes",
      "The brain is developing folds and grooves, giving it more surface area",
      "Your baby can dream — REM sleep has begun",
      "Fat is building up under the skin, making your baby look less wrinkled",
    ],
    motherChanges: [
      "Backache, pelvic pain, and pressure in the pelvis become more noticeable",
      "Shortness of breath may occur as the uterus pushes against the diaphragm",
      "From now on, go to sleep on your side (left or right) rather than flat on your back",
    ],
    tip: "From now on, go to sleep on your side (left or right), not flat on your back. This keeps blood flowing well to your baby. If you wake on your back, just turn onto your side.",
    trimester: 3,
  },
  32: {
    week: 32,
    size: "coconut",
    sizeEmoji: "🥥",
    weight: "1.7kg",
    length: "42.4cm",
    headline: "Your baby is practising all the skills needed for life outside the womb.",
    babyDevelopment: [
      "Your baby is practising breathing, sucking, and swallowing",
      "Toenails and fingernails have grown to the tips of the digits",
      "Your baby's skin is becoming smoother as more fat builds up",
      "Most babies have settled into a head-down position by now",
    ],
    motherChanges: [
      "Braxton Hicks contractions may become stronger and more frequent",
      "Heartburn and indigestion are very common as the uterus compresses the stomach",
      "You may feel the baby's movements as kicks, jabs, and rolls rather than gentle flutters",
    ],
    tip: "Start thinking about your birth plan — where you will deliver, who will be with you, and what you need to prepare. Discuss this with your health worker.",
    trimester: 3,
  },
  36: {
    week: 36,
    size: "honeydew melon",
    sizeEmoji: "🍈",
    weight: "2.6kg",
    length: "47.4cm",
    headline: "Your baby is considered early term — the lungs and brain are nearly mature.",
    babyDevelopment: [
      "The lungs are nearly fully mature",
      "Most of the lanugo (fine body hair) has fallen off",
      "Your baby is gaining about 28g of weight per day",
      "The head may have moved down into your pelvis — this is called engagement",
    ],
    motherChanges: [
      "You may notice it is easier to breathe as your baby drops lower into the pelvis",
      "Pelvic pressure and discomfort increase as the baby engages",
      "Frequent urination returns as the baby's head presses on the bladder",
    ],
    tip: "Pack your hospital bag now — include what you need for labour, delivery, and the first days after birth for both you and your baby.",
    trimester: 3,
  },
  38: {
    week: 38,
    size: "small watermelon",
    sizeEmoji: "🍉",
    weight: "3kg",
    length: "49.8cm",
    headline: "Your baby is full term — ready to be born at any time.",
    babyDevelopment: [
      "Your baby is considered full term",
      "The brain and lungs continue to mature right up until birth",
      "Your baby has a firm grasp reflex",
      "Most babies are in the head-down position ready for birth",
    ],
    motherChanges: [
      "You may notice the mucus plug being released — a sign that labour may begin soon",
      "Pelvic pain and pressure are common",
      "Watch for signs of labour: regular contractions, waters breaking, or a show of blood-tinged mucus",
    ],
    tip: "Know the signs of labour and have a plan for getting to your health facility quickly. Make sure someone can take you at any time of day or night.",
    trimester: 3,
  },
  40: {
    week: 40,
    size: "watermelon",
    sizeEmoji: "🍉",
    weight: "3.4kg",
    length: "51.2cm",
    headline: "Your estimated due date has arrived — your baby could come any day now.",
    babyDevelopment: [
      "Your baby is fully developed and ready for life outside the womb",
      "The skull bones are not yet fused — this allows the head to compress slightly for delivery",
      "Your baby has well-developed senses of smell, taste, hearing, and touch",
      "Vernix (the protective coating) has mostly absorbed into the skin",
    ],
    motherChanges: [
      "Only 5% of babies are born on their due date — yours may come a little before or after",
      "Contractions that get longer, stronger, and closer together are a sign of true labour",
      "Your waters may break before or during labour",
    ],
    tip: "Go to your health facility immediately if your waters break, if contractions are 5 minutes apart and lasting 60 seconds, or if you notice any bleeding or reduced fetal movement.",
    trimester: 3,
  },
};

/**
 * Get data for a specific week.
 * If the exact week is not in the dataset, returns the nearest lower week.
 */
export function getWeekData(week: number): FetalWeekData | null {
  if (week < 4) return null;
  if (week > 42) week = 42;

  // Try exact week first
  if (FETAL_DEVELOPMENT[week]) return FETAL_DEVELOPMENT[week];

  // Find nearest lower week
  const availableWeeks = Object.keys(FETAL_DEVELOPMENT)
    .map(Number)
    .sort((a, b) => b - a);

  const nearest = availableWeeks.find((w) => w <= week);
  return nearest ? FETAL_DEVELOPMENT[nearest] : null;
}

export function getTrimesterLabel(week: number): string {
  if (week <= 12) return "First Trimester";
  if (week <= 27) return "Second Trimester";
  return "Third Trimester";
}

export function getWeeksRemaining(week: number): number {
  return Math.max(0, 40 - week);
}