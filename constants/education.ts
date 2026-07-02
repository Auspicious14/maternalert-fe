// ═══════════════════════════════════════════════════════════════════════════
// FILE: constants/education.ts
// All education content hardcoded — works fully offline, no API needed
// Validated against WHO, ACOG, Preeclampsia Foundation guidelines
// Your co-founder (nurse) should review all clinical content before launch
// ═══════════════════════════════════════════════════════════════════════════
 
export interface EducationArticle {
  id: string;
  title: string;
  category: "HYPERTENSION" | "NUTRITION" | "WARNING_SIGNS" | "POSTPARTUM" | "ANTENATAL";
  categoryLabel: string;
  summary: string;
  content: string;
  readTimeMinutes: number;
  source: string;
  sourceUrl?: string;
  urgent?: boolean; // true = show at top, red accent
}
 
export const EDUCATION_CONTENT: EducationArticle[] = [
  // ── WARNING SIGNS (urgent — show first) ──────────────────────────────────
  {
    id: "danger-signs",
    title: "Danger Signs to Act On Immediately",
    category: "WARNING_SIGNS",
    categoryLabel: "Warning Signs",
    urgent: true,
    summary:
      "These symptoms mean you should go to a health facility right away — do not wait.",
    content: `If you experience any of the following, go to a health facility immediately. Do not wait to see if it gets better on its own.
 
SEVERE HEADACHE
A headache that is very strong, does not go away, or keeps coming back is a warning sign. This is different from an ordinary headache. It may feel like pressure at the front or back of your head.
 
CHANGES IN YOUR VISION
If your vision becomes blurred, you see flashing lights, dark spots, or you feel like something is wrong with your eyes, this needs urgent attention.
 
SWELLING OF THE FACE OR HANDS
Some swelling of the feet is normal in pregnancy. But if your face or hands suddenly swell, especially around the eyes or fingers, go to a facility.
 
PAIN IN THE UPPER ABDOMEN
Pain or tenderness under your right ribs or in the upper part of your belly can be a sign that your liver is under stress.
 
DIFFICULTY BREATHING
If you find it hard to breathe, feel short of breath while resting, or feel tightness in your chest, seek care immediately.
 
CONVULSIONS OR FITS
If you have a seizure, this is a medical emergency. Someone near you must get you to a hospital as quickly as possible.
 
REDUCED FETAL MOVEMENT
If you notice your baby is moving much less than usual after 28 weeks, contact your health worker or go to a facility.
 
HEAVY VAGINAL BLEEDING
Any heavy bleeding during pregnancy requires immediate attention.
 
FEVER
A high temperature during pregnancy can harm you and your baby. If you feel very hot or are shivering, seek care.
 
Remember: it is always better to go and be told everything is fine than to stay home and wait. No question is too small to ask your health worker.`,
    readTimeMinutes: 5,
    source: "Preeclampsia Foundation and WHO guidelines on warning signs in pregnancy",
  },
 
  // ── HYPERTENSION ─────────────────────────────────────────────────────────
  {
    id: "preeclampsia-eclampsia",
    title: "Preeclampsia and Eclampsia: What Every Mother Should Know",
    category: "HYPERTENSION",
    categoryLabel: "Blood Pressure",
    summary:
      "Understanding preeclampsia — one of the leading causes of maternal death that can be prevented with early care.",
    content: `Preeclampsia is a condition that develops during pregnancy, usually after 20 weeks. It causes high blood pressure and can damage organs such as the kidneys and liver. If it is not treated, it can progress to eclampsia, which involves dangerous seizures.
 
The good news is that when preeclampsia is caught early and properly managed, most women and babies do well.
 
WHAT CAUSES IT?
The exact cause is not fully understood, but it is related to how the placenta develops. Some women are at higher risk than others.
 
WHO IS AT HIGHER RISK?
- First-time mothers
- Women carrying twins or more
- Women with a history of high blood pressure, diabetes, or kidney disease
- Women whose mother or sister had preeclampsia
- Women who are overweight
 
HOW IS IT DIAGNOSED?
Your health worker will check your blood pressure and may test your urine for protein. Blood pressure at or above 140/90 mmHg measured on more than one occasion, together with other signs, leads to a diagnosis of preeclampsia.
 
WHAT ARE THE WARNING SIGNS?
- Severe or persistent headache
- Blurred vision or seeing spots
- Pain under the right side of your ribs
- Sudden swelling of the face, hands, or around the eyes
- Nausea or vomiting after the first three months of pregnancy
- Difficulty breathing
 
WHAT HAPPENS IF IT IS NOT TREATED?
Untreated preeclampsia can lead to:
- Eclampsia (seizures)
- HELLP syndrome, which affects the liver and blood
- Kidney or liver failure
- Stroke
- Early birth or low birth weight for the baby
 
HOW IS IT TREATED?
Treatment depends on how far along you are in your pregnancy and how serious the condition is. Your health worker may:
- Monitor your blood pressure and urine closely
- Give you medication to lower your blood pressure
- Give you magnesium sulfate to prevent seizures
- Decide to deliver your baby early if the risk becomes too high
 
AFTER BIRTH
Preeclampsia can still develop in the first six weeks after delivery. Continue to watch for warning symptoms and attend your postpartum visits.
 
LONG-TERM HEALTH
Women who have had preeclampsia have a higher chance of developing high blood pressure or heart disease later in life. Regular health check-ups after pregnancy are important.
 
The most important thing you can do is attend all your antenatal appointments and report any warning symptoms to your health worker promptly.`,
    readTimeMinutes: 8,
    source: "World Health Organization (WHO) and Preeclampsia Foundation",
  },
 
  {
    id: "understanding-bp",
    title: "Understanding Blood Pressure in Pregnancy",
    category: "HYPERTENSION",
    categoryLabel: "Blood Pressure",
    summary:
      "What blood pressure numbers mean and why your health worker tracks them at every visit.",
    content: `At every antenatal visit, your health worker will take your blood pressure. Understanding what these numbers mean helps you take part in your own care.
 
WHAT IS BLOOD PRESSURE?
Blood pressure is the force of your blood pushing against the walls of your blood vessels as your heart pumps. It is written as two numbers:
 
Systolic (the top number): The pressure when your heart beats and pushes blood out.
Diastolic (the bottom number): The pressure when your heart rests between beats.
 
For example, a reading of 120/80 mmHg means a systolic of 120 and a diastolic of 80.
 
WHAT IS NORMAL IN PREGNANCY?
A normal blood pressure reading is generally below 120/80 mmHg. In early pregnancy, blood pressure often drops slightly and then gradually rises again in the third trimester.
 
WHAT IS TOO HIGH?
A reading of 140/90 mmHg or above is considered high blood pressure (hypertension) in pregnancy. Your health worker will want to monitor you closely and may start treatment.
 
A reading of 160/110 mmHg or above is severe and needs immediate attention.
 
WHY DOES IT MATTER?
High blood pressure during pregnancy can affect blood flow to the placenta, which supplies oxygen and nutrients to your baby. It can also be a sign of preeclampsia, a serious condition that affects your kidneys, liver, and other organs.
 
This is why your health worker takes your blood pressure at every visit — not just once. A single normal reading is reassuring, but what matters most is the trend over time. A slow rise in your numbers over several visits is a warning sign even if no single reading is very high.
 
WHAT CAN YOU DO?
- Attend all antenatal visits so your blood pressure can be tracked over time
- Tell your health worker if you have any headaches, vision changes, or swelling
- Follow any advice your health worker gives about rest, diet, or medication
- Do not stop taking any prescribed medication without talking to your health worker first`,
    readTimeMinutes: 4,
    source: "World Health Organization (WHO) patient information on hypertension in pregnancy",
  },
 
  // ── WARNING SIGNS (supporting) ────────────────────────────────────────────
  {
    id: "when-to-seek-care",
    title: "When to Go to a Health Facility",
    category: "WARNING_SIGNS",
    categoryLabel: "Warning Signs",
    summary:
      "A simple guide to help you decide when to stay home and when to go immediately.",
    content: `Knowing when to seek care can save your life. This guide will help you decide what to do.
 
GO IMMEDIATELY — DO NOT WAIT
Go to a health facility right away if you have any of these:
- Convulsions or fits
- Heavy vaginal bleeding
- Severe difficulty breathing
- Severe headache that does not respond to paracetamol
- Blurred vision or seeing flashing lights
- Your baby has stopped moving and does not respond when you push your belly
- You feel something is very wrong
 
GO TODAY — SAME DAY
Contact your health worker or go to a facility today if you have:
- A headache that has lasted more than two hours
- Swelling of your face or hands that appeared suddenly
- Pain under your right ribs
- Fever with chills
- Burning or pain when you urinate
- Any bleeding, even if light
 
MENTION AT YOUR NEXT VISIT
Tell your health worker at your next visit if you have:
- Swelling of your feet or ankles that is getting worse
- Heartburn that is not getting better
- Difficulty sleeping or unusual tiredness
- Reduced fetal movement compared to before (if before 28 weeks)
 
IF YOU ARE UNSURE
If you are not sure which category your symptoms fall into, always choose to go. A health worker can always reassure you that everything is fine. They cannot help you if you stay home.
 
Never feel embarrassed to seek care. Your health and your baby's health come first.`,
    readTimeMinutes: 4,
    source: "WHO guidelines on essential antenatal care",
  },
 
  // ── ANTENATAL CARE ────────────────────────────────────────────────────────
  {
    id: "importance-of-anc",
    title: "Why Antenatal Visits Save Lives",
    category: "ANTENATAL",
    categoryLabel: "Antenatal Care",
    summary:
      "What happens at antenatal visits and why attending every appointment matters.",
    content: `Antenatal care (ANC) is the care you receive from a health worker during your pregnancy. It is one of the most important things you can do for yourself and your baby.
 
WHY IS ANTENATAL CARE IMPORTANT?
Antenatal visits allow your health worker to:
- Monitor your blood pressure, weight, and urine over time
- Check that your baby is growing well
- Identify problems early, before they become serious
- Give you vaccines to protect you and your baby
- Provide iron and folic acid supplements
- Prepare you for labour and delivery
- Answer your questions and address your concerns
 
Many of the conditions that cause maternal deaths — including preeclampsia, anaemia, and infection — can be caught and managed during antenatal visits. The earlier a problem is found, the more options exist for treatment.
 
HOW MANY VISITS DO YOU NEED?
WHO recommends at least eight antenatal visits during pregnancy. Many women attend fewer than this, especially in rural areas. Even if you cannot attend all recommended visits, attending as many as possible makes a real difference.
 
WHAT HAPPENS AT A VISIT?
At each visit, your health worker will typically:
- Take your blood pressure
- Check your weight
- Test your urine for protein and sugar
- Listen to your baby's heartbeat
- Measure the size of your belly
- Ask how you are feeling and whether you have any concerns
 
At certain visits, you may also receive iron tablets, malaria prevention treatment, or tetanus vaccines.
 
WHAT TO BRING TO YOUR VISIT
- Your antenatal card or health record book
- Any medications you are taking
- A list of any symptoms or questions you have
 
WHAT IF YOU MISS A VISIT?
Do not feel ashamed if you miss a visit. Return as soon as you can. One missed visit does not mean your pregnancy care has failed. What matters is that you return.`,
    readTimeMinutes: 5,
    source: "World Health Organization — Recommendations on Antenatal Care for a Positive Pregnancy Experience (2016)",
  },
 
  // ── NUTRITION ─────────────────────────────────────────────────────────────
  {
    id: "nutrition-pregnancy",
    title: "Eating Well During Pregnancy",
    category: "NUTRITION",
    categoryLabel: "Nutrition",
    summary:
      "Practical nutrition advice for Nigerian pregnant women — using affordable local foods.",
    content: `Good nutrition during pregnancy supports your baby's development and helps your body cope with the demands of pregnancy. You do not need to eat expensive or imported foods to eat well.
 
WHAT YOUR BODY NEEDS MORE OF IN PREGNANCY
 
Iron
Iron helps make blood for you and your baby. Without enough iron, you may become anaemic, which makes you feel very tired and weak and increases risks during delivery.
Good sources: Beans, lentils, dark green vegetables (like ugwu and waterleaf), liver, red meat, and fish. Eating foods rich in vitamin C (like tomatoes and oranges) alongside iron-rich foods helps your body absorb more iron.
 
Folic Acid
Folic acid helps prevent serious birth defects of the brain and spine. You should start taking folic acid supplements before pregnancy if possible, and continue through the first three months.
Good sources: Dark green leafy vegetables, beans, groundnuts.
 
Calcium
Calcium helps build your baby's bones and teeth. If you do not get enough, your body will take calcium from your own bones.
Good sources: Milk, yoghurt, small fish eaten with their bones (like sardines), dark leafy vegetables, and sesame seeds.
 
Protein
Protein is needed for your baby to grow and for your body to repair itself.
Good sources: Eggs, fish, chicken, beans, lentils, groundnuts, and meats.
 
PRACTICAL TIPS FOR NIGERIAN MOTHERS
 
- Eat three meals a day and include a variety of foods — grains, proteins, vegetables, and fruits.
- Pots of beans, ewa, or lentils are affordable, filling, and rich in iron and protein.
- Ugwu (fluted pumpkin leaves) is one of the most nutritious vegetables available and is widely affordable.
- Oily fish like mackerel and sardines provide protein, healthy fats, and calcium.
- Drink enough water throughout the day — at least 6 to 8 glasses.
 
FOODS TO AVOID OR LIMIT
- Raw or undercooked meat, fish, or eggs
- Unpasteurised milk or soft cheeses
- Excess salt and highly processed foods
- Alcohol — there is no safe amount during pregnancy
 
IRON SUPPLEMENTS
Your health worker may prescribe iron tablets. Take them as directed even if they cause nausea. Taking them with a small meal or at night can help reduce nausea.
 
If you are struggling to afford food or are losing weight during pregnancy, please tell your health worker. There may be programmes in your area that can help.`,
    readTimeMinutes: 6,
    source: "WHO recommendations on nutrition during pregnancy and ACOG nutrition guidelines",
  },
 
  // ── POSTPARTUM ─────────────────────────────────────────────────────────────
  {
    id: "postpartum-care",
    title: "Your Health After Delivery",
    category: "POSTPARTUM",
    categoryLabel: "After Birth",
    summary:
      "Why the weeks after birth are still a critical time for your health — and what to watch for.",
    content: `Many women focus entirely on staying well during pregnancy and forget that the weeks after birth — called the postpartum period — are also a critical time for health. Most maternal deaths in Nigeria occur around the time of delivery or in the days and weeks that follow.
 
THE FIRST 24 HOURS
The first 24 hours after delivery are the highest-risk period. Your health worker will monitor you closely during this time for bleeding, high blood pressure, and infection. Stay at the health facility for as long as your health worker recommends.
 
DANGER SIGNS AFTER BIRTH
Go to a health facility immediately if you experience any of these after delivery:
- Heavy vaginal bleeding (soaking more than one pad per hour)
- Severe headache or vision changes — this could be postpartum preeclampsia
- Fever or chills
- Difficulty breathing
- Severe pain in the abdomen
- Foul-smelling discharge
- Signs of infection in a wound (if you had a caesarean or tears)
- Feeling very confused or unlike yourself
 
POSTPARTUM PREECLAMPSIA
Preeclampsia can develop for the first time after birth, usually within the first six weeks. The symptoms are the same: severe headache, vision changes, and swelling. Do not assume you are safe from high blood pressure because you delivered safely.
 
YOUR POSTPARTUM VISITS
Attend your scheduled postpartum visits. At these visits your health worker will:
- Check your blood pressure and temperature
- Check that your uterus is returning to normal size
- Examine any wounds or stitches
- Discuss family planning options if you wish
- Support you with breastfeeding
- Screen for signs of postpartum depression
 
EMOTIONAL HEALTH AFTER BIRTH
It is normal to feel emotional, overwhelmed, or tearful in the first few days after birth. This is sometimes called the "baby blues" and usually improves within two weeks. If you feel persistently sad, hopeless, or are having trouble caring for yourself or your baby, talk to your health worker. Postpartum depression is a real condition and it can be treated.
 
RETURNING TO HEALTH FACILITY
Return to the health facility or contact your health worker at any time if something does not feel right. Do not wait for a scheduled appointment if you are worried.
 
Your recovery matters. A healthy mother is the foundation of a healthy family.`,
    readTimeMinutes: 6,
    source: "WHO recommendations on postnatal care for mothers and newborns (2013)",
  },
 
  {
    id: "breastfeeding",
    title: "Breastfeeding: Getting Started",
    category: "POSTPARTUM",
    categoryLabel: "After Birth",
    summary:
      "Practical guidance on starting breastfeeding and why it matters for you and your baby.",
    content: `Breast milk is the best food for your newborn. It contains everything your baby needs in the right amounts and helps protect against infections that are common causes of infant illness and death.
 
START WITHIN THE FIRST HOUR
Try to breastfeed within the first hour of birth. The first milk, called colostrum, is thick and yellowish. Some mothers worry it is not enough or not good, but it is extremely valuable. It is full of antibodies that protect your baby from infection. Do not discard or delay giving it.
 
HOW TO KNOW YOUR BABY IS FEEDING WELL
- Your baby feeds 8 to 12 times per day in the first weeks
- You can hear your baby swallowing
- Your baby is gaining weight
- Your baby has 6 or more wet nappies per day after the first week
 
COMMON CHALLENGES AND WHAT TO DO
 
Sore nipples
Some discomfort in the first few days is normal as you and your baby learn. Make sure your baby takes a good mouthful of the breast, not just the nipple. Ask your health worker to check your positioning and latch. Pain should improve within a week.
 
Feeling like you don't have enough milk
Breast milk works on supply and demand. The more your baby feeds, the more milk your body makes. Feeding frequently and on demand is the best way to build your supply. Supplementing with water or formula can reduce your supply.
 
Engorgement
When your full milk comes in (usually day 2 to 4), your breasts may feel very full and hard. Feed your baby frequently. A warm cloth applied before feeding can help.
 
EXCLUSIVE BREASTFEEDING FOR SIX MONTHS
WHO and UNICEF recommend exclusive breastfeeding (no water, no formula, no other foods) for the first six months of life. After six months, continue breastfeeding alongside other foods.
 
IF YOU CANNOT BREASTFEED
Some women cannot breastfeed due to medical reasons or circumstances beyond their control. If this is your situation, speak to your health worker about the safest alternatives for your baby. You are not a failure.
 
Ask your health worker or a midwife for support with breastfeeding. It is a skill that most mothers and babies learn together, and help is available.`,
    readTimeMinutes: 5,
    source: "WHO and UNICEF guidelines on breastfeeding (2023)",
  },
];
 
// Helper: get articles by category
export function getArticlesByCategory(
  category: EducationArticle["category"],
): EducationArticle[] {
  return EDUCATION_CONTENT.filter((a) => a.category === category);
}
 
// Helper: get urgent articles first
export function getSortedArticles(): EducationArticle[] {
  return [...EDUCATION_CONTENT].sort((a, b) => {
    if (a.urgent && !b.urgent) return -1;
    if (!a.urgent && b.urgent) return 1;
    return 0;
  });
}
 
// Helper: get article by id
export function getArticleById(id: string): EducationArticle | undefined {
  return EDUCATION_CONTENT.find((a) => a.id === id);
}