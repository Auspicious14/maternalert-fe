// ═══════════════════════════════════════════════════════════════════════════
// MaternAlert education content: ONE file, copied byte-for-byte to
//   maternalert-web/src/constants/education.ts
//   maternalert-fe/constants/education.ts
//   maternalert-be/src/education/data/education.content.ts (via shared import)
// Edit it in one place and copy it to the others.
//
// Content is bundled with the app so it works offline.
//
// Written October 2026 from: WHO antenatal care (2016), WHO aspirin for
// pre-eclampsia (2021), WHO postnatal care (2022), WHO/FIGO/ICM postpartum
// haemorrhage (Oct 2025), WHO malaria guidelines, WHO/UNICEF breastfeeding,
// and the AWHONN POST-BIRTH warning signs. Numbers in "bp-numbers" match the
// app's own alert levels (services/escalation.ts).
//
// CLINICAL SIGN-OFF REQUIRED before launch: a registered midwife or doctor
// should read every article and set `reviewedBy`.
// ═══════════════════════════════════════════════════════════════════════════

export type EducationCategory =
  | "DANGER_SIGNS"
  | "BLOOD_PRESSURE"
  | "PREGNANCY_CARE"
  | "FOOD_MEDICINE"
  | "BIRTH"
  | "AFTER_BIRTH"
  | "BABY";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "alert"; tone: "red" | "amber" | "green"; text: string };

export interface EducationArticle {
  id: string;
  title: string;
  category: EducationCategory;
  summary: string;
  readTimeMinutes: number;
  /** Shown first, with a red accent. */
  urgent?: boolean;
  /** Pregnancy weeks this matters most for (used to order the list). */
  weeks?: [number, number];
  body: Block[];
  sources: { title: string; url: string }[];
  updated: string; // YYYY-MM
  reviewedBy?: string;
  /** Nigerian Pidgin version, shown when the app language is Pidgin. */
  pcm?: { title: string; summary: string; body: Block[] };
  /** Yorùbá version, shown when the app language is Yorùbá. */
  yo?: { title: string; summary: string; body: Block[] };
}

export const CATEGORY_LABELS: Record<EducationCategory, string> = {
  DANGER_SIGNS: "Danger signs",
  BLOOD_PRESSURE: "Blood pressure",
  PREGNANCY_CARE: "Pregnancy care",
  FOOD_MEDICINE: "Food and medicines",
  BIRTH: "Labour and birth",
  AFTER_BIRTH: "After birth",
  BABY: "Your baby",
};

const WHO_ANC = {
  title: "WHO recommendations on antenatal care for a positive pregnancy experience (2016)",
  url: "https://www.who.int/publications/i/item/9789241549912",
};
const WHO_PNC = {
  title: "WHO: Quality care for women and newborns in the first weeks after childbirth (2022)",
  url: "https://www.who.int/news/item/30-03-2022-who-urges-quality-care-for-women-and-newborns-in-critical-first-weeks-after-childbirth",
};
const WHO_PPH = {
  title: "WHO, FIGO and ICM: New recommendations on postpartum haemorrhage (October 2025)",
  url: "https://www.who.int/news/item/05-10-2025-global-health-agencies-issue-new-recommendations-to-help-end-deaths-from-postpartum-haemorrhage",
};
const WHO_ASPIRIN = {
  title: "WHO recommendation on antiplatelet agents for the prevention of pre-eclampsia (2021)",
  url: "https://www.who.int/publications/i/item/9789240037540",
};
const PE_FOUNDATION = {
  title: "Preeclampsia Foundation: Signs and symptoms",
  url: "https://www.preeclampsia.org/health-information/signs-and-symptoms",
};
const POST_BIRTH = {
  title: "Lamaze / AWHONN: POST-BIRTH warning signs",
  url: "https://lamaze.org/Giving-Birth-with-Confidence/GBWC-Post/do-you-know-these-deadly-post-birth-warning-signs",
};

export const EDUCATION_CONTENT: EducationArticle[] = [
  // ── DANGER SIGNS ───────────────────────────────────────────────────────────
  {
    id: "danger-signs",
    title: "Danger signs in pregnancy: go now",
    category: "DANGER_SIGNS",
    urgent: true,
    summary: "If you have any of these, go to a health facility straight away. Don't wait to see if it passes.",
    readTimeMinutes: 3,
    body: [
      {
        type: "alert",
        tone: "red",
        text: "Go to a hospital now, or call 112, if you have any sign below. Ask someone to take you. Don't go alone if you can avoid it.",
      },
      { type: "h", text: "Go now for" },
      {
        type: "list",
        items: [
          "Bleeding from the vagina, any amount",
          "Fits (convulsions), or fainting",
          "A very bad headache that doesn't go away, especially with blurred vision or seeing spots or flashing lights",
          "Pain high in your belly, under the ribs on the right, or very bad belly pain anywhere",
          "Hard to breathe, or chest pain",
          "Fever and feeling too weak to get out of bed",
          "Your waters break (fluid leaks from the vagina) before labour starts",
          "Your baby is moving less than usual, or has stopped moving",
          "Sudden swelling of your face or hands",
        ],
      },
      { type: "h", text: "See your clinic today for" },
      {
        type: "list",
        items: [
          "Fever, even if you feel strong enough to walk",
          "Pain or burning when you pass urine",
          "Vomiting so much that you can't keep food or water down",
          "Vaginal discharge that smells bad, itches, or looks green or grey",
          "Feeling very sad or hopeless most days",
        ],
      },
      {
        type: "p",
        text: "Swollen feet at the end of the day and passing urine often are common in pregnancy and usually normal. Swelling that comes on suddenly, or swelling of the face and hands, is not.",
      },
      {
        type: "p",
        text: "If you are not sure, go and get checked. Health workers would much rather see you for nothing than see you too late.",
      },
    ],
    sources: [WHO_ANC, PE_FOUNDATION],
    updated: "2026-10",
    pcm: {
      title: "Danger signs for pregnancy: go now now",
      summary: "If you get any of these, go hospital sharp sharp. No wait to see if e go pass.",
      body: [
        {
          type: "alert",
          tone: "red",
          text: "Go hospital now now, or call 112, if you get any sign wey dey below. Make person carry you go. No go alone if you fit.",
        },
        { type: "h", text: "Go now now if" },
        {
          type: "list",
          items: [
            "Blood dey comot from your private part, even small",
            "You dey jerk (fits), or you faint",
            "Strong headache wey no gree go, mostly if your eye dey blur or you dey see spots or light dey flash",
            "Pain for upper belle, under your ribs for right side, or strong belle pain anywhere",
            "You no fit breathe well, or your chest dey pain you",
            "Fever, and your body weak reach say you no fit commot from bed",
            "Your water break (water dey leak from your private part) before labour start",
            "Your baby no dey move like before, or e don stop to move",
            "Your face or hand swell sudden",
          ],
        },
        { type: "h", text: "Go your clinic today if" },
        {
          type: "list",
          items: [
            "You get fever, even if you still fit waka",
            "Pain or burning when you dey urinate",
            "You dey vomit tire, anything you chop or drink e dey comot",
            "Discharge from your private part wey dey smell bad, dey scratch, or e be green or grey",
            "You dey sad well well or you no get hope most days",
          ],
        },
        {
          type: "p",
          text: "Leg wey swell for evening and to dey urinate plenty times dey common for pregnancy, and e normal. But swelling wey come sudden, or swelling for your face and hand, no be normal.",
        },
        {
          type: "p",
          text: "If you no sure, go make dem check you. Health workers prefer to see you for nothing pass to see you when e don late.",
        },
      ],
    },
    yo: {
      title: "Àwọn àmì ewu nínú oyún: lọ ní báyìí",
      summary: "Tí o bá ní èyíkéyìí nínú ìwọ̀nyí, lọ sí ilé ìwòsàn lẹ́sẹ̀kẹsẹ̀. Má ṣe dúró láti wò bóyá yóò kọjá.",
      body: [
        {
          type: "alert",
          tone: "red",
          text: "Lọ sí ilé ìwòsàn ní báyìí, tàbí pe 112, tí o bá ní àmì èyíkéyìí nísàlẹ̀ yìí. Jẹ́ kí ẹnìkan mú ọ lọ. Má ṣe lọ nìkan tí o bá lè yẹra fún un.",
        },
        { type: "h", text: "Lọ ní báyìí tí" },
        {
          type: "list",
          items: [
            "Ẹ̀jẹ̀ ń jáde láti ojú ara, bó ti wù kí ó kéré tó",
            "Gìrì (ara ń gbọ̀n), tàbí o dákú",
            "Ẹ̀fọ́rí tó le gan-an tí kò lọ, pàápàá tí ojú rẹ bá ń ṣú tàbí o ń rí àmì tàbí ìmọ́lẹ̀ tó ń tàn",
            "Ìrora ní òkè ikùn, lábẹ́ egungun ìhà ní ẹ̀gbẹ́ ọ̀tún, tàbí inú rírun tó le níbikíbi",
            "Ìṣòro mímí, tàbí ìrora àyà",
            "Ara gbígbóná, tí ara rẹ kò sì lókun láti dìde lórí ibùsùn",
            "Omi ìbí rẹ ya (omi ń jò láti ojú ara) kí ìrọbí tó bẹ̀rẹ̀",
            "Ọmọ inú rẹ kò mì bí ti tẹ́lẹ̀, tàbí ó ti dákẹ́ mímì",
            "Ojú tàbí ọwọ́ rẹ wú lójijì",
          ],
        },
        { type: "h", text: "Lọ sí kílíníìkì rẹ lónìí tí" },
        {
          type: "list",
          items: [
            "Ara rẹ gbóná, kódà tí o bá ṣì lè rìn",
            "Ìrora tàbí jíjó nígbà tí o bá ń tọ̀",
            "O ń bì tó bẹ́ẹ̀ tí o kò lè mú oúnjẹ tàbí omi dúró",
            "Omi ojú ara tó ń rùn, tó ń yún ọ, tàbí tó jẹ́ àwọ̀ ewé tàbí eérú",
            "Ìbànújẹ́ tàbí àìnírètí ń bá ọ fínra ní ọ̀pọ̀ ọjọ́",
          ],
        },
        {
          type: "p",
          text: "Ẹsẹ̀ wíwú ní ìrọ̀lẹ́ àti ìtọ̀ léraléra wọ́pọ̀ nínú oyún, wọ́n sì máa ń jẹ́ ohun tó dára. Ṣùgbọ́n wíwú tó dé lójijì, tàbí wíwú ojú àti ọwọ́, kò dára.",
        },
        {
          type: "p",
          text: "Tí o kò bá dá ọ lójú, lọ kí wọ́n yẹ̀ ọ́ wò. Ó sàn kí àwọn òṣìṣẹ́ ìlera rí ọ láìsí ìṣòro ju kí wọ́n rí ọ nígbà tí ó ti pẹ́ jù.",
        },
      ],
    },
  },
  {
    id: "bleeding-after-birth",
    title: "Heavy bleeding after birth",
    category: "DANGER_SIGNS",
    urgent: true,
    weeks: [34, 42],
    summary: "Bleeding after birth is the leading cause of maternal death. Know the signs so you and your family act fast.",
    readTimeMinutes: 3,
    body: [
      {
        type: "p",
        text: "Some bleeding after birth is normal. It is heavy at first, then gets lighter and changes from red to brown to yellow-white over a few weeks.",
      },
      {
        type: "p",
        text: "Too much bleeding (postpartum haemorrhage) can become dangerous within minutes. It is the most common cause of mothers dying in childbirth in Nigeria and worldwide, and most of these deaths can be prevented with quick care.",
      },
      { type: "h", text: "Get help immediately if" },
      {
        type: "list",
        items: [
          "Blood soaks through a pad in an hour or less",
          "You pass clots the size of an egg or bigger",
          "Bleeding suddenly gets heavier after it had become lighter",
          "You feel dizzy, faint, very weak, or your heart is racing",
          "You feel cold and clammy, or look very pale",
        ],
      },
      {
        type: "alert",
        tone: "red",
        text: "If this happens at home, go to the nearest hospital now. Lie down with your legs raised on the way. Don't wait for the bleeding to stop by itself.",
      },
      { type: "h", text: "How to lower your risk" },
      {
        type: "list",
        items: [
          "Give birth in a health facility with a skilled midwife or doctor",
          "Take your iron and folic acid tablets every day in pregnancy. Low blood (anaemia) makes bleeding more dangerous",
          "After the baby is born, you will be given an injection to help your womb tighten. This is normal and protects you",
          "Stay in the facility for at least 24 hours after birth",
          "Plan ahead for a blood donor in case you need blood",
        ],
      },
      {
        type: "p",
        text: "In October 2025, WHO and international midwife and obstetrician groups asked health workers to act earlier, when blood loss reaches 300 ml with warning signs, instead of waiting for 500 ml. Telling a health worker early really matters.",
      },
    ],
    sources: [WHO_PPH, POST_BIRTH],
    updated: "2026-10",
  },

  // ── BLOOD PRESSURE ─────────────────────────────────────────────────────────
  {
    id: "bp-numbers",
    title: "What your blood pressure numbers mean",
    category: "BLOOD_PRESSURE",
    summary: "The two numbers, what is normal in pregnancy, and what to do at each level.",
    readTimeMinutes: 3,
    body: [
      {
        type: "p",
        text: "A blood pressure reading has two numbers, for example 118/76. The top number (systolic) is the pressure when your heart beats. The bottom number (diastolic) is the pressure when your heart rests between beats.",
      },
      {
        type: "p",
        text: "High blood pressure in pregnancy often causes no symptoms at all. That is why checking it regularly matters, even when you feel well.",
      },
      { type: "h", text: "What the app tells you to do" },
      {
        type: "list",
        items: [
          "Below 130/80: normal. Keep checking as your clinic advises.",
          "130 to 139, or bottom number 80 to 89: a little high. Rest, drink some water, and check again in about 4 hours.",
          "140 to 149, or bottom number 90 to 99: high. Contact your clinic today. Don't wait for your next appointment.",
          "150 or more, or bottom number 100 or more: very high. Go to a health facility now.",
        ],
      },
      {
        type: "p",
        text: "Either number counts. 128/92 is high because the bottom number is 90 or more.",
      },
      {
        type: "alert",
        tone: "red",
        text: "Any reading with a bad headache, blurred vision, pain under the ribs, or breathing trouble: go now, whatever the numbers say.",
      },
      {
        type: "p",
        text: "Doctors diagnose high blood pressure in pregnancy at 140/90 or more, and call 160/110 or more severe. The app asks you to act a little earlier, to be on the safe side.",
      },
    ],
    sources: [WHO_ANC, PE_FOUNDATION],
    updated: "2026-10",
  },
  {
    id: "measure-bp",
    title: "How to check your blood pressure correctly",
    category: "BLOOD_PRESSURE",
    summary: "Small mistakes can make a reading wrong. Follow these steps every time.",
    readTimeMinutes: 2,
    body: [
      { type: "h", text: "Before you measure" },
      {
        type: "list",
        items: [
          "Use an upper-arm machine (cuff on the arm, not the wrist) if you can",
          "Don't eat a big meal, drink tea or coffee, or exercise in the 30 minutes before",
          "Empty your bladder",
          "Sit quietly for 5 minutes with your back supported and feet flat on the floor. Don't cross your legs",
        ],
      },
      { type: "h", text: "While you measure" },
      {
        type: "list",
        items: [
          "Put the cuff on bare skin, about two fingers above the elbow crease",
          "Rest your arm on a table so the cuff is level with your heart",
          "Don't talk or move",
          "Take two readings one minute apart. If they are different, enter the second one",
        ],
      },
      {
        type: "p",
        text: "Check at about the same times each day. If the machine shows an error or a number that seems very different from usual, rest and measure again.",
      },
      {
        type: "alert",
        tone: "amber",
        text: "No machine? Many clinics, PHCs and pharmacies will check it for you. Never guess the numbers. A wrong reading can hide a real problem.",
      },
    ],
    sources: [WHO_ANC],
    updated: "2026-10",
  },
  {
    id: "pre-eclampsia",
    title: "Pre-eclampsia and eclampsia",
    category: "BLOOD_PRESSURE",
    weeks: [20, 42],
    summary: "A serious blood pressure problem of pregnancy and the weeks after birth. Early care keeps mother and baby safe.",
    readTimeMinutes: 5,
    body: [
      {
        type: "p",
        text: "Pre-eclampsia is high blood pressure that starts after 20 weeks of pregnancy, together with signs that the kidneys, liver, brain or blood are under strain (often protein in the urine). It can also start up to 6 weeks after birth.",
      },
      {
        type: "p",
        text: "Eclampsia is when pre-eclampsia causes fits. Together they are one of the biggest causes of maternal death in Nigeria. With early checks and treatment, most women and babies do well.",
      },
      { type: "h", text: "Who is more at risk" },
      {
        type: "list",
        items: [
          "Pre-eclampsia in a past pregnancy",
          "High blood pressure, diabetes, kidney disease, or lupus before pregnancy",
          "Twins or more",
          "First pregnancy, or more than 10 years since the last one",
          "Age 40 or over",
          "Being very overweight",
          "Mother or sister had pre-eclampsia",
        ],
      },
      {
        type: "p",
        text: "Many women with pre-eclampsia have none of these. It can happen to anyone, which is why every pregnant woman needs her blood pressure checked.",
      },
      { type: "h", text: "Signs" },
      {
        type: "list",
        items: [
          "Blood pressure 140/90 or higher",
          "A bad headache that doesn't go away with rest or paracetamol",
          "Blurred vision, seeing spots or flashing lights",
          "Pain high in the belly or under the right ribs",
          "Sudden swelling of the face, hands or feet",
          "Feeling sick or vomiting in the second half of pregnancy",
          "Shortness of breath",
        ],
      },
      {
        type: "alert",
        tone: "red",
        text: "Any of these signs: go to a health facility today. Headache with vision changes, upper belly pain, or fits: go now.",
      },
      { type: "h", text: "Treatment" },
      {
        type: "list",
        items: [
          "Medicine to lower blood pressure",
          "Magnesium sulphate injection to prevent or stop fits",
          "Steroid injections to help the baby's lungs if birth may come early",
          "Birth of the baby, which is the only cure. Your doctor will decide the safest time",
        ],
      },
      { type: "h", text: "After birth and later life" },
      {
        type: "p",
        text: "Keep checking your blood pressure for at least 6 weeks after birth. Women who had pre-eclampsia have a higher chance of high blood pressure, heart disease and stroke later in life, so check your blood pressure at least once a year, and tell your health worker in any future pregnancy.",
      },
    ],
    sources: [WHO_ANC, WHO_ASPIRIN, PE_FOUNDATION],
    updated: "2026-10",
  },
  {
    id: "lower-pe-risk",
    title: "Lowering your risk of pre-eclampsia",
    category: "BLOOD_PRESSURE",
    weeks: [8, 20],
    summary: "Low-dose aspirin and calcium can help some women. Ask at your clinic early, before 20 weeks.",
    readTimeMinutes: 2,
    body: [
      {
        type: "p",
        text: "If your health worker says you are at high risk of pre-eclampsia, WHO recommends low-dose aspirin every day, started before 20 weeks of pregnancy (or as soon as you start antenatal care).",
      },
      {
        type: "alert",
        tone: "amber",
        text: "Only take aspirin in pregnancy if a health worker prescribes it. The dose for pregnancy is much lower than a normal painkiller dose.",
      },
      {
        type: "p",
        text: "In places like Nigeria where many diets are low in calcium, WHO recommends calcium tablets in pregnancy to lower the risk of pre-eclampsia. Ask your clinic if you should take them. Take calcium and iron tablets at different times of day, because calcium stops iron from being absorbed.",
      },
      { type: "h", text: "Other things that help" },
      {
        type: "list",
        items: [
          "Start antenatal care early, ideally before 12 weeks",
          "Go to every antenatal visit and have your blood pressure and urine checked",
          "Eat calcium-rich foods: milk, yoghurt, small fish eaten with bones (like sardines or crayfish), green vegetables",
          "Keep active with walking unless told otherwise",
        ],
      },
    ],
    sources: [WHO_ASPIRIN, WHO_ANC],
    updated: "2026-10",
  },

  // ── PREGNANCY CARE ─────────────────────────────────────────────────────────
  {
    id: "antenatal-visits",
    title: "Your antenatal visits",
    category: "PREGNANCY_CARE",
    weeks: [0, 40],
    summary: "WHO recommends at least 8 antenatal contacts. Here's when they are and what happens at each.",
    readTimeMinutes: 3,
    body: [
      {
        type: "p",
        text: "Antenatal care finds problems early, often before you feel anything. WHO and Nigeria's health ministry recommend at least 8 contacts with a health worker in pregnancy.",
      },
      { type: "h", text: "When" },
      {
        type: "list",
        items: [
          "First visit before 12 weeks",
          "Then at about 20, 26, 30, 34, 36, 38 and 40 weeks",
          "More often if you have high blood pressure or another problem",
        ],
      },
      { type: "h", text: "What is checked" },
      {
        type: "list",
        items: [
          "Blood pressure and urine at every visit",
          "Your blood level (for anaemia), blood group, and tests for HIV, syphilis and hepatitis B. Treatment protects your baby",
          "An ultrasound scan before 24 weeks to check dates and the number of babies",
          "Your baby's growth and heartbeat",
          "Tetanus vaccine",
          "Malaria prevention tablets (from the second trimester)",
          "Iron and folic acid tablets",
        ],
      },
      {
        type: "p",
        text: "Bring your antenatal card to every visit, and bring it with you if you ever go to a different hospital.",
      },
    ],
    sources: [WHO_ANC],
    updated: "2026-10",
  },
  {
    id: "baby-movements",
    title: "Your baby's movements",
    category: "PREGNANCY_CARE",
    weeks: [16, 42],
    summary: "Feeling your baby move is a sign they are well. Less movement than usual needs checking the same day.",
    readTimeMinutes: 2,
    body: [
      {
        type: "p",
        text: "Most women first feel movements between 16 and 24 weeks. Movements become stronger and more regular as the baby grows, and continue right up to and during labour.",
      },
      {
        type: "p",
        text: "There is no set number of kicks to count. What matters is your baby's own usual pattern. Get to know it.",
      },
      {
        type: "alert",
        tone: "red",
        text: "If your baby is moving less than usual, the pattern changes, or you can't feel movements, go to your clinic or hospital today. Don't wait until the next day.",
      },
      {
        type: "list",
        items: [
          "It is not true that babies move less near the end of pregnancy",
          "Don't use a home heartbeat machine or app to reassure yourself. Only a health worker can check properly",
          "If it happens again after a normal check, go back again. Every time counts",
        ],
      },
    ],
    sources: [WHO_ANC],
    updated: "2026-10",
  },
  {
    id: "malaria",
    title: "Malaria in pregnancy",
    category: "PREGNANCY_CARE",
    weeks: [12, 42],
    summary: "Malaria is more dangerous in pregnancy. Sleep under a treated net and take your prevention tablets.",
    readTimeMinutes: 2,
    body: [
      {
        type: "p",
        text: "Malaria in pregnancy can cause severe anaemia, miscarriage, early birth and a small baby. Pregnant women get malaria more easily and more severely.",
      },
      { type: "h", text: "Protect yourself" },
      {
        type: "list",
        items: [
          "Sleep under an insecticide-treated mosquito net every night. Ask your clinic for a free one",
          "Take the malaria prevention tablets (SP, sometimes called IPTp) at your antenatal visits, starting in the second trimester. They are given at least 4 weeks apart",
          "Close windows and doors at dusk, and clear standing water near your home",
        ],
      },
      {
        type: "alert",
        tone: "amber",
        text: "Fever in pregnancy needs a malaria test the same day. Don't treat yourself with drugs from a chemist without a test: some malaria drugs are not safe in early pregnancy.",
      },
    ],
    sources: [WHO_ANC, { title: "WHO guidelines for malaria", url: "https://www.who.int/publications/i/item/guidelines-for-malaria" }],
    updated: "2026-10",
  },

  // ── FOOD AND MEDICINES ─────────────────────────────────────────────────────
  {
    id: "iron-anaemia",
    title: "Iron, folic acid and low blood",
    category: "FOOD_MEDICINE",
    summary: "Low blood (anaemia) is common in pregnancy and makes bleeding at birth more dangerous. Daily tablets help.",
    readTimeMinutes: 2,
    body: [
      {
        type: "p",
        text: "WHO recommends iron and folic acid tablets every day in pregnancy. Folic acid helps prevent problems with the baby's brain and spine. Iron prevents low blood.",
      },
      { type: "h", text: "Signs of low blood" },
      {
        type: "list",
        items: [
          "Feeling very tired or weak",
          "Pale inside the eyelids, gums or palms",
          "Getting out of breath easily, or a racing heart",
          "Dizziness",
        ],
      },
      { type: "h", text: "Tips" },
      {
        type: "list",
        items: [
          "Take the tablet every day, even when you feel fine",
          "Take it with water or orange juice, not with tea, coffee or milk",
          "Dark stools are normal on iron. Constipation is common: drink water and eat fruit and vegetables",
          "Iron-rich foods: beans, liver, meat, fish, eggs, ugu, spinach (efo), and other dark green leaves",
        ],
      },
    ],
    sources: [WHO_ANC, WHO_PPH],
    updated: "2026-10",
  },
  {
    id: "eating-well",
    title: "Eating well in pregnancy",
    category: "FOOD_MEDICINE",
    summary: "Simple, local food choices for you and your baby, and what to avoid.",
    readTimeMinutes: 3,
    body: [
      {
        type: "p",
        text: "You don't need to eat for two. Eat a mix of foods every day and add one extra small meal or snack in the second half of pregnancy.",
      },
      { type: "h", text: "Every day, try to eat" },
      {
        type: "list",
        items: [
          "Protein: beans, moi moi, eggs, fish, chicken, meat, groundnuts",
          "Vegetables and fruit: ugu, efo, garden egg, carrots, oranges, pawpaw, banana, watermelon",
          "Calcium: milk, yoghurt, sardines, crayfish",
          "Energy foods in moderate amounts: rice, yam, garri, bread, oats. Choose brown or whole-grain when you can",
          "Plenty of clean water",
        ],
      },
      { type: "h", text: "Avoid" },
      {
        type: "list",
        items: [
          "Alcohol (including palm wine) and smoking, in any amount",
          "Raw or undercooked meat, eggs or fish, and unpasteurised (fresh unboiled) milk",
          "More than about 2 cups of coffee a day. Strong tea and cola drinks also contain caffeine",
          "Lots of sugary drinks and very salty foods. Use seasoning cubes sparingly",
        ],
      },
      {
        type: "p",
        text: "Wash fruit and vegetables well, and wash your hands before cooking and eating.",
      },
    ],
    sources: [WHO_ANC],
    updated: "2026-10",
  },
  {
    id: "medicines-herbs",
    title: "Medicines, herbs and agbo",
    category: "FOOD_MEDICINE",
    summary: "Some medicines and herbal mixtures can harm your baby or cause dangerous labour. Check first.",
    readTimeMinutes: 2,
    body: [
      {
        type: "p",
        text: "Many medicines are safe in pregnancy, but some are not. Always tell the pharmacist or health worker you are pregnant.",
      },
      {
        type: "list",
        items: [
          "Paracetamol is the usual safe choice for pain or fever. Avoid ibuprofen, diclofenac and similar painkillers unless a doctor says so",
          "Don't take antibiotics, malaria drugs or blood pressure drugs from a chemist without a prescription",
          "Keep taking medicines for long-term conditions (like high blood pressure or epilepsy), but tell your clinic early. Some need changing",
        ],
      },
      {
        type: "alert",
        tone: "red",
        text: "Avoid agbo and other herbal mixtures in pregnancy, especially near the end and in labour. Some make the womb squeeze too hard, which can tear it, harm the baby, or cause heavy bleeding.",
      },
      {
        type: "p",
        text: "If you have already taken something, don't panic. Tell your health worker what it was so they can check.",
      },
    ],
    sources: [WHO_ANC],
    updated: "2026-10",
  },

  // ── LABOUR AND BIRTH ───────────────────────────────────────────────────────
  {
    id: "birth-plan",
    title: "Getting ready for birth",
    category: "BIRTH",
    weeks: [28, 42],
    summary: "Plan now so that when labour or an emergency comes, nothing slows you down.",
    readTimeMinutes: 3,
    body: [
      { type: "h", text: "Plan before 36 weeks" },
      {
        type: "list",
        items: [
          "Where you will give birth. Choose a facility with a skilled midwife or doctor, and know the nearest hospital for emergencies",
          "How you will get there, day or night. Save a driver's number",
          "Money set aside for transport and care",
          "A blood donor: a relative or friend who is willing to give blood if needed",
          "Who will come with you, and who will look after your other children",
          "A bag: antenatal card, wrappers, pads, baby clothes, soap, and your phone charger",
        ],
      },
      { type: "h", text: "Signs labour has started" },
      {
        type: "list",
        items: [
          "Tightenings that come regularly, get stronger, and get closer together",
          "A 'show': sticky mucus, sometimes with a little blood",
          "Your waters breaking",
        ],
      },
      {
        type: "alert",
        tone: "red",
        text: "Go to the facility straight away if your waters break, if there is more than a little blood, if the fluid is green or brown, or if your baby moves less.",
      },
      {
        type: "p",
        text: "Labour before 37 weeks is early (preterm). If you have regular tightenings before 37 weeks, go in to be checked.",
      },
    ],
    sources: [WHO_ANC],
    updated: "2026-10",
  },

  // ── AFTER BIRTH ────────────────────────────────────────────────────────────
  {
    id: "after-birth",
    title: "Your health after birth",
    category: "AFTER_BIRTH",
    weeks: [36, 42],
    summary: "The 6 weeks after birth are a risky time for mothers. Know your check-ups and warning signs.",
    readTimeMinutes: 4,
    body: [
      { type: "h", text: "Your check-ups" },
      {
        type: "list",
        items: [
          "Stay in the facility for at least 24 hours after birth",
          "Then at 2 to 3 days, 1 to 2 weeks, and 6 weeks after birth",
          "If you gave birth at home, see a health worker within 24 hours",
        ],
      },
      {
        type: "alert",
        tone: "red",
        text: "Go now for: heavy bleeding (a pad soaked in an hour, or clots the size of an egg), fits, chest pain, trouble breathing, or thoughts of harming yourself or your baby.",
      },
      { type: "h", text: "See a health worker the same day for" },
      {
        type: "list",
        items: [
          "Headache that doesn't get better with paracetamol, or headache with blurred vision. Pre-eclampsia can start after birth",
          "Blood pressure of 140/90 or more",
          "Fever (38°C or more), or bad-smelling discharge from the vagina",
          "A caesarean or tear wound that is red, swollen, leaking or opening",
          "One leg that is red, swollen, warm or painful",
          "Painful, red, hard area in the breast with fever",
        ],
      },
      { type: "h", text: "Spacing your next baby" },
      {
        type: "p",
        text: "WHO advises waiting at least 2 years after a birth before getting pregnant again. This is safer for you and your next baby. Ask about family planning at your postnatal visit. Many methods are safe while breastfeeding.",
      },
    ],
    sources: [WHO_PNC, POST_BIRTH],
    updated: "2026-10",
  },
  {
    id: "feelings-after-birth",
    title: "Your feelings after birth",
    category: "AFTER_BIRTH",
    summary: "Feeling low for a few days is common. Feeling low for weeks is an illness that can be treated.",
    readTimeMinutes: 2,
    body: [
      {
        type: "p",
        text: "Many mothers feel tearful, worried or irritable in the first 2 weeks after birth. This is often called the 'baby blues' and usually passes with rest and support.",
      },
      { type: "h", text: "Talk to a health worker if, for more than 2 weeks, you" },
      {
        type: "list",
        items: [
          "Feel sad, empty or hopeless most of the day",
          "Have lost interest in things, including your baby",
          "Can't sleep even when the baby sleeps, or sleep all the time",
          "Feel worthless or guilty, or very anxious",
        ],
      },
      {
        type: "p",
        text: "This is postnatal depression. It is common, it is not weakness and not a spiritual attack, and it gets better with treatment and support.",
      },
      {
        type: "alert",
        tone: "red",
        text: "If you have thoughts of harming yourself or your baby, or you see or hear things others don't, get help now. Tell someone you trust and go to a hospital.",
      },
    ],
    sources: [
      WHO_PNC,
      { title: "WHO: Maternal mental health", url: "https://www.who.int/teams/mental-health-and-substance-use/promotion-prevention/maternal-mental-health" },
    ],
    updated: "2026-10",
  },

  // ── YOUR BABY ──────────────────────────────────────────────────────────────
  {
    id: "breastfeeding",
    title: "Breastfeeding",
    category: "BABY",
    weeks: [34, 42],
    summary: "Breast milk is all your baby needs for 6 months. Start within an hour of birth.",
    readTimeMinutes: 3,
    body: [
      {
        type: "list",
        items: [
          "Put your baby to the breast within the first hour after birth",
          "The first yellow milk (colostrum) is very good for your baby. Don't throw it away",
          "Give only breast milk for the first 6 months: no water, glucose water, herbal drinks or formula. Breast milk has enough water, even in hot weather",
          "Feed whenever your baby wants, day and night, usually 8 or more times a day",
          "Keep breastfeeding with other foods until 2 years or beyond",
        ],
      },
      { type: "h", text: "Signs your baby is getting enough" },
      {
        type: "list",
        items: [
          "6 or more wet nappies a day after the first week",
          "You can hear or see swallowing",
          "Your baby is gaining weight at check-ups",
        ],
      },
      {
        type: "p",
        text: "Sore nipples usually mean the baby isn't taking enough of the breast into their mouth. Ask a midwife to check the latch. If you have HIV, your clinic will advise on safe feeding with your treatment.",
      },
    ],
    sources: [{ title: "WHO: Breastfeeding", url: "https://www.who.int/health-topics/breastfeeding" }, WHO_PNC],
    updated: "2026-10",
  },
  {
    id: "newborn-danger-signs",
    title: "Danger signs in your newborn",
    category: "BABY",
    urgent: true,
    weeks: [36, 42],
    summary: "Newborns get sick fast. Take your baby to a health facility straight away if you see any of these.",
    readTimeMinutes: 2,
    body: [
      {
        type: "alert",
        tone: "red",
        text: "Take your baby to a health facility now if you notice any sign below.",
      },
      {
        type: "list",
        items: [
          "Not feeding well, or stopped feeding",
          "Fits (convulsions)",
          "Fast breathing, or the chest pulls in with each breath",
          "Fever, or feels cold to the touch",
          "Very sleepy, floppy, or only moves when touched",
          "Yellow skin in the first day, or yellow palms and soles at any time",
          "Redness, pus or a bad smell around the cord",
        ],
      },
      { type: "h", text: "Keeping your baby well" },
      {
        type: "list",
        items: [
          "Keep the cord clean and dry. Don't put anything on it unless your health worker says so",
          "Keep your baby warm, skin-to-skin with you as much as you can",
          "Go to all postnatal check-ups and get the birth vaccines (BCG, polio and hepatitis B)",
        ],
      },
    ],
    sources: [WHO_PNC],
    updated: "2026-10",
  },
];

/** Danger signs first, then articles for the current pregnancy week, then the rest. */
export function getSortedArticles(pregnancyWeeks?: number | null): EducationArticle[] {
  const score = (a: EducationArticle) => {
    let s = 0;
    if (a.urgent) s += 100;
    if (pregnancyWeeks && a.weeks && pregnancyWeeks >= a.weeks[0] && pregnancyWeeks <= a.weeks[1]) s += 10;
    return s;
  };
  return EDUCATION_CONTENT.map((a, i) => ({ a, i }))
    .sort((x, y) => score(y.a) - score(x.a) || x.i - y.i)
    .map((x) => x.a);
}

export function getArticleById(id: string): EducationArticle | undefined {
  return EDUCATION_CONTENT.find((a) => a.id === id);
}

export function getArticlesByCategory(category: EducationCategory): EducationArticle[] {
  return EDUCATION_CONTENT.filter((a) => a.category === category);
}

/** Plain text version, e.g. for the API or sharing by SMS/WhatsApp. */
export function articleToText(a: EducationArticle): string {
  return a.body
    .map((b) =>
      b.type === "list" ? b.items.map((i) => `- ${i}`).join("\n") : b.type === "h" ? b.text.toUpperCase() : b.text,
    )
    .join("\n\n");
}
