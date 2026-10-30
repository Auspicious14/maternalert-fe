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
    pcm: {
      title: "Plenty bleeding after you born",
      summary: "Bleeding after birth na the number one thing wey dey kill mothers. Know the signs so you and your family go move fast.",
      body: [
        { type: "p", text: "Small bleeding after you born dey normal. E go heavy first, then e go dey reduce, and the colour go change from red to brown to yellow-white for some weeks." },
        { type: "p", text: "Too much bleeding (postpartum haemorrhage) fit turn danger inside few minutes. Na the main thing wey dey kill mothers for childbirth for Nigeria and the whole world, and most of these deaths no suppose happen if care reach quick." },
        { type: "h", text: "Find help now now if" },
        { type: "list", items: [
          "Blood soak one pad finish inside one hour or less",
          "Blood clot wey big reach egg or pass dey comot",
          "Bleeding suddenly heavy again after e don reduce before",
          "Your head dey turn, you wan faint, your body weak well well, or your heart dey beat fast fast",
          "Your body cold and you dey sweat, or you pale well well",
        ] },
        { type: "alert", tone: "red", text: "If this one happen for house, go the nearest hospital now. Lie down and raise your legs for road. No wait make the bleeding stop by itself." },
        { type: "h", text: "How to reduce your risk" },
        { type: "list", items: [
          "Born for hospital or health centre wey get trained midwife or doctor",
          "Take your iron and folic acid tablet every day for pregnancy. Low blood (anaemia) dey make bleeding more dangerous",
          "After baby comot, dem go give you injection to help your womb tight. E normal, e dey protect you",
          "Stay for the hospital at least 24 hours after you born",
          "Plan before time for person wey go give blood if you need am",
        ] },
        { type: "p", text: "For October 2025, WHO and big midwife and doctor groups for the world tell health workers make dem act early, when blood wey comot reach 300 ml with warning signs, instead to wait reach 500 ml. To tell health worker early really matter." },
      ],
    },
    yo: {
      title: "Ẹ̀jẹ̀ púpọ̀ lẹ́yìn ìbímọ",
      summary: "Ẹ̀jẹ̀ lẹ́yìn ìbímọ ni ohun àkọ́kọ́ tó ń pa àwọn ìyá. Mọ àwọn àmì rẹ̀ kí ìwọ àti ẹbí rẹ lè yára gbé ìgbésẹ̀.",
      body: [
        { type: "p", text: "Ẹ̀jẹ̀ díẹ̀ lẹ́yìn ìbímọ jẹ́ ohun tó wọ́pọ̀. Ó máa ń pọ̀ ní àkọ́kọ́, lẹ́yìn náà ó máa dín kù, àwọ̀ rẹ̀ á sì yí padà láti pupa sí àwọ̀ ilẹ̀ sí funfun-òféèfé láàrin ọ̀sẹ̀ díẹ̀." },
        { type: "p", text: "Ẹ̀jẹ̀ tó pọ̀ jù (postpartum haemorrhage) lè di ewu láàrin ìṣẹ́jú díẹ̀. Òun ni ohun tó ń pa àwọn ìyá jù nígbà ìbímọ ní Nàìjíríà àti ní gbogbo àgbáyé, ṣùgbọ́n a lè dènà ọ̀pọ̀lọpọ̀ ikú yìí pẹ̀lú ìtọ́jú kíákíá." },
        { type: "h", text: "Wá ìrànlọ́wọ́ lẹ́sẹ̀kẹsẹ̀ tí" },
        { type: "list", items: [
          "Ẹ̀jẹ̀ bá rin pádì kan tán láàrin wákàtí kan tàbí kí ó dín",
          "Ẹ̀jẹ̀ dídì tó tóbi tó ẹyin tàbí jù bẹ́ẹ̀ lọ bá ń jáde",
          "Ẹ̀jẹ̀ bá tún pọ̀ sí i lójijì lẹ́yìn tí ó ti dín kù",
          "Orí rẹ ń yí, o fẹ́ dákú, ara rẹ ti rẹ̀ púpọ̀, tàbí ọkàn rẹ ń lù kíákíá",
          "Ara rẹ tutù tí o sì ń làágùn, tàbí o ti funfun jù",
        ] },
        { type: "alert", tone: "red", text: "Tí èyí bá ṣẹlẹ̀ nílé, lọ sí ilé ìwòsàn tó súnmọ́ ọ ní báyìí. Dùbúlẹ̀ kí o gbé ẹsẹ̀ rẹ sókè lójú ọ̀nà. Má ṣe dúró kí ẹ̀jẹ̀ náà dá dúró fúnra rẹ̀." },
        { type: "h", text: "Bí o ṣe lè dín ewu rẹ kù" },
        { type: "list", items: [
          "Bímọ ní ilé ìwòsàn tí agbẹ̀bí tàbí dókítà tó mọṣẹ́ wà",
          "Máa lo oògùn iron àti folic acid lójoojúmọ́ nígbà oyún. Ẹ̀jẹ̀ tó kéré (anaemia) máa ń mú kí ẹ̀jẹ̀ ìbímọ léwu sí i",
          "Lẹ́yìn tí ọmọ bá jáde, wọn yóò fún ọ ní abẹ́rẹ́ kí ilé ọmọ rẹ lè sún mọ́ra. Èyí wọ́pọ̀, ó sì ń dáàbò bò ọ́",
          "Dúró ní ilé ìwòsàn fún ó kéré tán wákàtí 24 lẹ́yìn ìbímọ",
          "Ṣètò ẹni tí yóò fún ọ ní ẹ̀jẹ̀ ṣáájú, tí o bá nílò rẹ̀",
        ] },
        { type: "p", text: "Ní oṣù October 2025, WHO àti àwọn ẹgbẹ́ agbẹ̀bí àti dókítà àgbáyé ní kí àwọn òṣìṣẹ́ ìlera tètè gbé ìgbésẹ̀, nígbà tí ẹ̀jẹ̀ tó jáde bá tó 300 ml pẹ̀lú àwọn àmì ìkìlọ̀, dípò kí wọ́n dúró dé 500 ml. Kí o tètè sọ fún òṣìṣẹ́ ìlera ṣe pàtàkì gan-an." },
      ],
    },
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
    pcm: {
      title: "Wetin your BP numbers mean",
      summary: "The two numbers, wetin be normal for pregnancy, and wetin to do for each level.",
      body: [
        { type: "p", text: "BP reading get two numbers, like 118/76. The top number (systolic) na the pressure when your heart beat. The bottom number (diastolic) na the pressure when your heart rest between beats." },
        { type: "p", text: "High BP for pregnancy fit no show any sign at all. Na why to dey check am well well matter, even when you feel fine." },
        { type: "h", text: "Wetin the app go tell you make you do" },
        { type: "list", items: [
          "Under 130/80: normal. Dey check am as your clinic talk.",
          "130 reach 139, or bottom number 80 reach 89: e high small. Rest, drink water small, then check again after like 4 hours.",
          "140 reach 149, or bottom number 90 reach 99: e high. Call or go your clinic today. No wait for your next appointment.",
          "150 or pass, or bottom number 100 or pass: e high well well. Go hospital now.",
        ] },
        { type: "p", text: "Any of the two numbers fit cause wahala. 128/92 dey high because the bottom number na 90 or pass." },
        { type: "alert", tone: "red", text: "Any reading wey come with strong headache, eye wey dey blur, pain under your ribs, or you no fit breathe well: go now now, no matter wetin the numbers talk." },
        { type: "p", text: "Doctors dey call am high BP for pregnancy from 140/90 go up, and dem dey call 160/110 or pass serious. The app dey tell you make you act small early, to be on the safe side." },
      ],
    },
    yo: {
      title: "Ìtumọ̀ àwọn nọ́ńbà ìfúnpá rẹ",
      summary: "Nọ́ńbà méjèèjì, ohun tó dára nígbà oyún, àti ohun tí o máa ṣe ní ìpele kọ̀ọ̀kan.",
      body: [
        { type: "p", text: "Ìwọ̀n ìfúnpá ní nọ́ńbà méjì, bí àpẹẹrẹ 118/76. Nọ́ńbà òkè (systolic) ni agbára ẹ̀jẹ̀ nígbà tí ọkàn rẹ bá lù. Nọ́ńbà ìsàlẹ̀ (diastolic) ni agbára ẹ̀jẹ̀ nígbà tí ọkàn rẹ bá sinmi láàrin lílù." },
        { type: "p", text: "Ìfúnpá gíga nígbà oyún kì í sábà fi àmì kankan hàn. Ìdí nìyẹn tí ó fi ṣe pàtàkì láti máa wò ó déédéé, bí ara rẹ tilẹ̀ yá." },
        { type: "h", text: "Ohun tí app yìí máa sọ fún ọ láti ṣe" },
        { type: "list", items: [
          "Nísàlẹ̀ 130/80: ó dára. Máa wò ó bí kílíníìkì rẹ ṣe sọ.",
          "130 sí 139, tàbí nọ́ńbà ìsàlẹ̀ 80 sí 89: ó ga díẹ̀. Sinmi, mu omi díẹ̀, kí o tún un wò lẹ́yìn nǹkan bí wákàtí mẹ́rin.",
          "140 sí 149, tàbí nọ́ńbà ìsàlẹ̀ 90 sí 99: ó ga. Kàn sí kílíníìkì rẹ lónìí. Má ṣe dúró di ìgbà ìpàdé rẹ tó kàn.",
          "150 tàbí jù bẹ́ẹ̀ lọ, tàbí nọ́ńbà ìsàlẹ̀ 100 tàbí jù bẹ́ẹ̀ lọ: ó ga jù. Lọ sí ilé ìwòsàn ní báyìí.",
        ] },
        { type: "p", text: "Nọ́ńbà èyíkéyìí nínú méjèèjì ló ṣe pàtàkì. 128/92 ga nítorí pé nọ́ńbà ìsàlẹ̀ jẹ́ 90 tàbí jù bẹ́ẹ̀ lọ." },
        { type: "alert", tone: "red", text: "Ìwọ̀n èyíkéyìí tó bá wá pẹ̀lú ẹ̀fọ́rí líle, ojú tó ń ṣú, ìrora lábẹ́ egungun ìhà, tàbí ìṣòro mímí: lọ ní báyìí, ohun yòówù tí nọ́ńbà náà bá sọ." },
        { type: "p", text: "Àwọn dókítà máa ń pè é ní ìfúnpá gíga nígbà oyún láti 140/90 sókè, wọ́n sì máa ń pe 160/110 tàbí jù bẹ́ẹ̀ lọ ní èyí tó le. App yìí ní kí o tètè gbé ìgbésẹ̀ díẹ̀ ṣáájú, kí ó lè dájú." },
      ],
    },
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
    pcm: {
      title: "How to check your BP well",
      summary: "Small mistake fit make the reading wrong. Follow these steps every time.",
      body: [
        { type: "h", text: "Before you check" },
        { type: "list", items: [
          "Use machine wey dey for upper arm (the cuff for arm, no be wrist) if you fit",
          "No chop big food, drink tea or coffee, or do exercise for the 30 minutes before",
          "Go toilet go piss first",
          "Sit down quiet for 5 minutes, make your back rest well and your feet flat for ground. No cross your legs",
        ] },
        { type: "h", text: "As you dey check" },
        { type: "list", items: [
          "Put the cuff for your bare skin, like two fingers above the place wey your elbow dey fold",
          "Rest your arm for table so the cuff go dey the same level with your heart",
          "No talk, no move",
          "Check two times, one minute between. If the two no be the same, put the second one",
        ] },
        { type: "p", text: "Check around the same time every day. If the machine show error or number wey different well well from wetin you dey see before, rest and check again." },
        { type: "alert", tone: "amber", text: "You no get machine? Many clinics, PHC and chemist go check am for you. No ever guess the numbers. Wrong reading fit hide real problem." },
      ],
    },
    yo: {
      title: "Bí o ṣe lè wọn ìfúnpá rẹ dáadáa",
      summary: "Àṣìṣe kékeré lè mú kí ìwọ̀n náà má jẹ́ òótọ́. Tẹ̀lé àwọn ìgbésẹ̀ yìí ní gbogbo ìgbà.",
      body: [
        { type: "h", text: "Kí o tó wọ̀n ọ́n" },
        { type: "list", items: [
          "Lo ẹ̀rọ apá òkè (okùn rẹ̀ lórí apá, kì í ṣe ọwọ́-ọrùn) tí o bá lè rí i",
          "Má ṣe jẹ oúnjẹ púpọ̀, mu tíì tàbí kọfí, tàbí ṣe eré ìdárayá ní ìṣẹ́jú 30 ṣáájú",
          "Tọ̀ kí o tó bẹ̀rẹ̀",
          "Jókòó jẹ́ẹ́ fún ìṣẹ́jú 5, kí ẹ̀yìn rẹ fi ara tì, kí ẹsẹ̀ rẹ sì tẹ́ lórí ilẹ̀. Má ṣe ká ẹsẹ̀ rẹ lé ara wọn",
        ] },
        { type: "h", text: "Nígbà tí o bá ń wọ̀n ọ́n" },
        { type: "list", items: [
          "Fi okùn náà sí ara rẹ tí kò ní aṣọ, nǹkan bí ìka méjì lókè ibi tí ìgúnpá rẹ ti ń ká",
          "Gbé apá rẹ lé orí tábìlì kí okùn náà lè wà ní ìpele kan náà pẹ̀lú ọkàn rẹ",
          "Má ṣe sọ̀rọ̀ tàbí rìn",
          "Wọ̀n ọ́n lẹ́ẹ̀mejì, ìṣẹ́jú kan láàrin wọn. Tí wọ́n bá yàtọ̀, kọ èkejì sílẹ̀",
        ] },
        { type: "p", text: "Máa wò ó ní nǹkan bí àkókò kan náà lójoojúmọ́. Tí ẹ̀rọ náà bá fi àṣìṣe hàn tàbí nọ́ńbà tó yàtọ̀ gan-an sí ti tẹ́lẹ̀, sinmi kí o tún un wọ̀n." },
        { type: "alert", tone: "amber", text: "O kò ní ẹ̀rọ? Ọ̀pọ̀ kílíníìkì, PHC àti ilé oògùn yóò bá ọ wò ó. Má ṣe fi ọgbọ́n inú sọ nọ́ńbà. Ìwọ̀n tí kò tọ́ lè fi ìṣòro gidi pamọ́." },
      ],
    },
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
    pcm: {
      title: "Pre-eclampsia and eclampsia",
      summary: "Serious BP problem for pregnancy and the weeks after you born. Early care dey keep mama and pikin safe.",
      body: [
        { type: "p", text: "Pre-eclampsia na high BP wey start after 20 weeks of pregnancy, plus signs say your kidney, liver, brain or blood dey under pressure (many times, protein go dey your urine). E fit also start reach 6 weeks after you born." },
        { type: "p", text: "Eclampsia na when pre-eclampsia make woman dey jerk (fits). The two of dem dey among the biggest things wey dey kill mothers for Nigeria. With early check and treatment, most women and their pikin dey fine." },
        { type: "h", text: "Who get more risk" },
        { type: "list", items: [
          "Pre-eclampsia for pregnancy before",
          "High BP, diabetes, kidney sickness, or lupus before the pregnancy",
          "Twins or more",
          "First pregnancy, or e don pass 10 years since the last one",
          "Age 40 or pass",
          "Body wey too big (overweight well well)",
          "Your mama or sister don get pre-eclampsia before",
        ] },
        { type: "p", text: "Many women wey get pre-eclampsia no get any of these. E fit happen to anybody, na why every pregnant woman need make dem dey check her BP." },
        { type: "h", text: "Signs" },
        { type: "list", items: [
          "BP 140/90 or pass",
          "Strong headache wey no gree go even after you rest or take paracetamol",
          "Eye dey blur, you dey see spots or light dey flash",
          "Pain for upper belle or under your right ribs",
          "Face, hand or leg wey swell sudden sudden",
          "You dey feel like to vomit or you dey vomit for the second half of pregnancy",
          "You no fit breathe well",
        ] },
        { type: "alert", tone: "red", text: "Any of these signs: go hospital today. Headache with eye wey dey blur, upper belle pain, or fits: go now now." },
        { type: "h", text: "Treatment" },
        { type: "list", items: [
          "Medicine to bring BP down",
          "Magnesium sulphate injection to stop fits or prevent am",
          "Steroid injection to help pikin lungs if e fit born early",
          "To born the pikin, na the only cure. Your doctor go decide the time wey safe pass",
        ] },
        { type: "h", text: "After you born and later for life" },
        { type: "p", text: "Dey check your BP for at least 6 weeks after you born. Women wey get pre-eclampsia get more chance to get high BP, heart sickness and stroke later for life, so check your BP at least once every year, and tell your health worker for any pregnancy wey go come after." },
      ],
    },
    yo: {
      title: "Pre-eclampsia àti eclampsia",
      summary: "Ìṣòro ìfúnpá tó le nígbà oyún àti àwọn ọ̀sẹ̀ lẹ́yìn ìbímọ. Ìtọ́jú kíákíá ń dáàbò bo ìyá àti ọmọ.",
      body: [
        { type: "p", text: "Pre-eclampsia ni ìfúnpá gíga tó bẹ̀rẹ̀ lẹ́yìn ọ̀sẹ̀ 20 oyún, pẹ̀lú àwọn àmì pé kíndìnrín, ẹ̀dọ̀, ọpọlọ tàbí ẹ̀jẹ̀ wà lábẹ́ ìdààmú (ọ̀pọ̀ ìgbà, protein máa ń wà nínú ìtọ̀). Ó tún lè bẹ̀rẹ̀ títí di ọ̀sẹ̀ 6 lẹ́yìn ìbímọ." },
        { type: "p", text: "Eclampsia ni nígbà tí pre-eclampsia bá fa gìrì. Àwọn méjèèjì wà lára ohun tó ń pa àwọn ìyá jù ní Nàìjíríà. Pẹ̀lú àyẹ̀wò àti ìtọ́jú kíákíá, ọ̀pọ̀ obìnrin àti ọmọ wọn máa ń wà dáadáa." },
        { type: "h", text: "Ta ló wà nínú ewu jù" },
        { type: "list", items: [
          "Ẹni tó ti ní pre-eclampsia nínú oyún tẹ́lẹ̀",
          "Ìfúnpá gíga, ìtọ̀ ṣúgà, àìsàn kíndìnrín, tàbí lupus ṣáájú oyún",
          "Ìbejì tàbí jù bẹ́ẹ̀ lọ",
          "Oyún àkọ́kọ́, tàbí tí ó ti ju ọdún 10 lọ láti oyún tó kẹ́yìn",
          "Ọjọ́ orí 40 tàbí jù bẹ́ẹ̀ lọ",
          "Ìwúwo ara tó pọ̀ jù",
          "Ìyá tàbí arábìnrin rẹ ti ní pre-eclampsia",
        ] },
        { type: "p", text: "Ọ̀pọ̀ obìnrin tó ní pre-eclampsia kò ní èyíkéyìí nínú ìwọ̀nyí. Ó lè ṣẹlẹ̀ sí ẹnikẹ́ni, ìdí nìyẹn tí gbogbo aboyún fi nílò kí wọ́n máa wo ìfúnpá wọn." },
        { type: "h", text: "Àwọn àmì" },
        { type: "list", items: [
          "Ìfúnpá 140/90 tàbí jù bẹ́ẹ̀ lọ",
          "Ẹ̀fọ́rí líle tí kò lọ lẹ́yìn ìsinmi tàbí paracetamol",
          "Ojú tó ń ṣú, rírí àmì tàbí ìmọ́lẹ̀ tó ń tàn",
          "Ìrora ní ikùn òkè tàbí lábẹ́ egungun ìhà ọ̀tún",
          "Ojú, ọwọ́ tàbí ẹsẹ̀ tó wú lójijì",
          "Ìríra tàbí èébì ní ìdajì kejì oyún",
          "Ìṣòro mímí",
        ] },
        { type: "alert", tone: "red", text: "Èyíkéyìí nínú àwọn àmì yìí: lọ sí ilé ìwòsàn lónìí. Ẹ̀fọ́rí pẹ̀lú ojú tó ń ṣú, ìrora ikùn òkè, tàbí gìrì: lọ ní báyìí." },
        { type: "h", text: "Ìtọ́jú" },
        { type: "list", items: [
          "Oògùn láti dín ìfúnpá kù",
          "Abẹ́rẹ́ magnesium sulphate láti dènà tàbí dá gìrì dúró",
          "Abẹ́rẹ́ steroid láti ran ẹ̀dọ̀fóró ọmọ lọ́wọ́ tí ó bá lè tètè bí",
          "Bíbí ọmọ náà, èyí nìkan ni ìwòsàn. Dókítà rẹ yóò pinnu àkókò tó dájú jù",
        ] },
        { type: "h", text: "Lẹ́yìn ìbímọ àti ní ọjọ́ iwájú" },
        { type: "p", text: "Máa wo ìfúnpá rẹ fún ó kéré tán ọ̀sẹ̀ 6 lẹ́yìn ìbímọ. Àwọn obìnrin tó ti ní pre-eclampsia ní àǹfààní tó ga jù láti ní ìfúnpá gíga, àìsàn ọkàn àti ẹ̀gbà ní ọjọ́ iwájú, nítorí náà máa wo ìfúnpá rẹ ó kéré tán lẹ́ẹ̀kan lọ́dún, kí o sì sọ fún òṣìṣẹ́ ìlera rẹ nínú oyún èyíkéyìí tó bá tún wáyé." },
      ],
    },
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
    pcm: {
      title: "How to reduce your risk of pre-eclampsia",
      summary: "Small-dose aspirin and calcium fit help some women. Ask your clinic early, before 20 weeks.",
      body: [
        { type: "p", text: "If your health worker talk say your risk of pre-eclampsia high, WHO recommend small-dose aspirin every day, wey you go start before 20 weeks of pregnancy (or as soon as you start antenatal)." },
        { type: "alert", tone: "amber", text: "Only take aspirin for pregnancy if health worker write am for you. The dose for pregnancy small pass the one wey people dey take for normal body pain." },
        { type: "p", text: "For places like Nigeria where many people food no get enough calcium, WHO recommend calcium tablet for pregnancy to reduce the risk of pre-eclampsia. Ask your clinic if you suppose take am. Take calcium and iron tablet for different time of the day, because calcium dey block iron make body no collect am." },
        { type: "h", text: "Other things wey dey help" },
        { type: "list", items: [
          "Start antenatal early, better before 12 weeks",
          "Go every antenatal visit, make dem check your BP and urine",
          "Chop food wey get calcium: milk, yoghurt, small fish wey you go chop with the bone (like sardine or crayfish), green vegetable",
          "Dey waka around to keep your body active, unless dem tell you make you no do am",
        ] },
      ],
    },
    yo: {
      title: "Bí o ṣe lè dín ewu pre-eclampsia kù",
      summary: "Aspirin ìwọ̀n kékeré àti calcium lè ran àwọn obìnrin kan lọ́wọ́. Béèrè ní kílíníìkì rẹ ní kùtùkùtù, ṣáájú ọ̀sẹ̀ 20.",
      body: [
        { type: "p", text: "Tí òṣìṣẹ́ ìlera rẹ bá sọ pé ewu pre-eclampsia rẹ ga, WHO dámọ̀ràn aspirin ìwọ̀n kékeré lójoojúmọ́, tí o máa bẹ̀rẹ̀ ṣáájú ọ̀sẹ̀ 20 oyún (tàbí ní kété tí o bá bẹ̀rẹ̀ ìtọ́jú oyún)." },
        { type: "alert", tone: "amber", text: "Lo aspirin nígbà oyún nìkan tí òṣìṣẹ́ ìlera bá kọ ọ́ fún ọ. Ìwọ̀n tí a ń lò nígbà oyún kéré púpọ̀ ju ìwọ̀n oògùn ìrora lásán lọ." },
        { type: "p", text: "Ní àwọn ibi bí Nàìjíríà tí oúnjẹ ọ̀pọ̀ ènìyàn kò ní calcium tó, WHO dámọ̀ràn oògùn calcium nígbà oyún láti dín ewu pre-eclampsia kù. Béèrè ní kílíníìkì rẹ bóyá o yẹ kí o lò ó. Lo calcium àti iron ní àkókò ọ̀tọ̀ọ̀tọ̀ lójúmọ́, nítorí calcium máa ń dí ara lọ́wọ́ láti gba iron." },
        { type: "h", text: "Àwọn nǹkan mìíràn tó ń ṣèrànwọ́" },
        { type: "list", items: [
          "Bẹ̀rẹ̀ ìtọ́jú oyún ní kùtùkùtù, ṣáájú ọ̀sẹ̀ 12 ló dára jù",
          "Lọ sí gbogbo ìpàdé ìtọ́jú oyún kí wọ́n wo ìfúnpá àti ìtọ̀ rẹ",
          "Jẹ oúnjẹ tó ní calcium: wàrà, yoghurt, ẹja kékeré tí a jẹ pẹ̀lú egungun rẹ̀ (bíi sardine tàbí edé), ewébẹ̀ aláwọ̀ ewé",
          "Máa rìn kiri láti mú ara ṣiṣẹ́, àyàfi tí wọ́n bá sọ pé kí o má ṣe",
        ] },
      ],
    },
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
    pcm: {
      title: "Your antenatal visits",
      summary: "WHO recommend at least 8 antenatal visits. See when dem be and wetin dey happen for each one.",
      body: [
        { type: "p", text: "Antenatal dey find problem early, many times before you feel anything. WHO and Nigeria health ministry recommend at least 8 times to see health worker for pregnancy." },
        { type: "h", text: "When" },
        { type: "list", items: [
          "First visit before 12 weeks",
          "Then around 20, 26, 30, 34, 36, 38 and 40 weeks",
          "More times if you get high BP or another problem",
        ] },
        { type: "h", text: "Wetin dem go check" },
        { type: "list", items: [
          "BP and urine for every visit",
          "Your blood level (for anaemia), blood group, and test for HIV, syphilis and hepatitis B. Treatment dey protect your pikin",
          "Scan before 24 weeks to check the date and how many pikin dey inside",
          "How your pikin dey grow and the heartbeat",
          "Tetanus injection",
          "Malaria prevention tablet (from the second trimester)",
          "Iron and folic acid tablet",
        ] },
        { type: "p", text: "Carry your antenatal card go every visit, and carry am if you go another hospital any time." },
      ],
    },
    yo: {
      title: "Àwọn ìpàdé ìtọ́jú oyún rẹ",
      summary: "WHO dámọ̀ràn ó kéré tán ìpàdé 8 fún ìtọ́jú oyún. Wo ìgbà tí wọ́n jẹ́ àti ohun tó ń ṣẹlẹ̀ nínú ọ̀kọ̀ọ̀kan.",
      body: [
        { type: "p", text: "Ìtọ́jú oyún máa ń tètè rí ìṣòro, ọ̀pọ̀ ìgbà kí o tó mọ̀ ọ́n lára. WHO àti iléeṣẹ́ ìlera Nàìjíríà dámọ̀ràn ó kéré tán ìgbà 8 láti rí òṣìṣẹ́ ìlera nígbà oyún." },
        { type: "h", text: "Ìgbà wo" },
        { type: "list", items: [
          "Ìpàdé àkọ́kọ́ ṣáájú ọ̀sẹ̀ 12",
          "Lẹ́yìn náà ní nǹkan bí ọ̀sẹ̀ 20, 26, 30, 34, 36, 38 àti 40",
          "Ju bẹ́ẹ̀ lọ tí o bá ní ìfúnpá gíga tàbí ìṣòro mìíràn",
        ] },
        { type: "h", text: "Ohun tí wọ́n máa ń yẹ̀ wò" },
        { type: "list", items: [
          "Ìfúnpá àti ìtọ̀ ní gbogbo ìpàdé",
          "Ìwọ̀n ẹ̀jẹ̀ rẹ (fún anaemia), ẹgbẹ́ ẹ̀jẹ̀, àti àyẹ̀wò HIV, syphilis àti hepatitis B. Ìtọ́jú ń dáàbò bo ọmọ rẹ",
          "Àyẹ̀wò scan ṣáájú ọ̀sẹ̀ 24 láti mọ ọjọ́ àti iye ọmọ tó wà nínú",
          "Bí ọmọ rẹ ṣe ń dàgbà àti ìlù ọkàn rẹ̀",
          "Abẹ́rẹ́ tetanus",
          "Oògùn ìdènà ibà (láti ìpele oyún kejì)",
          "Oògùn iron àti folic acid",
        ] },
        { type: "p", text: "Mú káàdì ìtọ́jú oyún rẹ wá sí gbogbo ìpàdé, kí o sì mú un lọ́wọ́ tí o bá lọ sí ilé ìwòsàn mìíràn nígbàkígbà." },
      ],
    },
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
    pcm: {
      title: "How your pikin dey move",
      summary: "When you dey feel your pikin move, e mean say e dey fine. If e no dey move like before, make dem check am that same day.",
      body: [
        { type: "p", text: "Most women dey first feel the movement between 16 and 24 weeks. The movement go dey strong and regular as pikin dey grow, and e go continue reach labour and inside labour." },
        { type: "p", text: "No fixed number of kicks wey you go count. Wetin matter na how your own pikin dey usually move. Sabi am." },
        { type: "alert", tone: "red", text: "If your pikin no dey move like before, the way e dey move change, or you no fit feel am move, go your clinic or hospital today. No wait till tomorrow." },
        { type: "list", items: [
          "E no true say pikin dey move less when pregnancy don near end",
          "No use heartbeat machine or app for house to calm yourself. Na only health worker fit check am well",
          "If e happen again after dem check you and everything normal, go back again. Every time matter",
        ] },
      ],
    },
    yo: {
      title: "Bí ọmọ rẹ ṣe ń rìn nínú",
      summary: "Kí o máa mọ̀ ọ́n lára pé ọmọ rẹ ń rìn fi hàn pé ara rẹ̀ yá. Tí kò bá rìn tó bí ó ti máa ń rìn, jẹ́ kí wọ́n yẹ̀ ọ́ wò lọ́jọ́ náà.",
      body: [
        { type: "p", text: "Ọ̀pọ̀ obìnrin máa ń kọ́kọ́ mọ ìrìn ọmọ láàrin ọ̀sẹ̀ 16 sí 24. Ìrìn náà máa ń lágbára sí i, á sì máa wáyé déédéé bí ọmọ ṣe ń dàgbà, á sì máa bá a lọ títí di àkókò ìrọbí àti nígbà ìrọbí." },
        { type: "p", text: "Kò sí iye ìtàpá kan pàtó tí o gbọ́dọ̀ kà. Ohun tó ṣe pàtàkì ni bí ọmọ tìrẹ ṣe máa ń rìn. Mọ̀ ọ́n dáadáa." },
        { type: "alert", tone: "red", text: "Tí ọmọ rẹ kò bá rìn tó bí ó ti máa ń rìn, tí ọ̀nà ìrìn rẹ̀ bá yí padà, tàbí tí o kò bá mọ̀ ọ́n lára pé ó ń rìn, lọ sí kílíníìkì tàbí ilé ìwòsàn rẹ lónìí. Má ṣe dúró di ọ̀la." },
        { type: "list", items: [
          "Kì í ṣe òótọ́ pé ọmọ máa ń dín ìrìn kù nígbà tí oyún bá ń parí",
          "Má ṣe lo ẹ̀rọ tàbí app ìlù ọkàn nílé láti fi ọkàn ara rẹ balẹ̀. Òṣìṣẹ́ ìlera nìkan ló lè yẹ̀ ọ́ wò dáadáa",
          "Tí ó bá tún ṣẹlẹ̀ lẹ́yìn tí wọ́n yẹ̀ ọ́ wò tí gbogbo nǹkan sì dára, tún padà lọ. Gbogbo ìgbà ló ṣe pàtàkì",
        ] },
      ],
    },
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
    pcm: {
      title: "Malaria for pregnancy",
      summary: "Malaria dey more dangerous for pregnancy. Sleep inside treated net and take your prevention tablet.",
      body: [
        { type: "p", text: "Malaria for pregnancy fit cause serious low blood, miscarriage, early birth and small pikin. Pregnant women dey catch malaria quick pass and e dey worse for dem." },
        { type: "h", text: "Protect yourself" },
        { type: "list", items: [
          "Sleep inside mosquito net wey get medicine every night. Ask your clinic for free one",
          "Take the malaria prevention tablet (SP, some people dey call am IPTp) for your antenatal visit, from the second trimester. Dem dey give am at least 4 weeks apart",
          "Close window and door when evening reach, and clear water wey dey stand near your house",
        ] },
        { type: "alert", tone: "amber", text: "Fever for pregnancy need malaria test that same day. No treat yourself with drug from chemist without test: some malaria drugs no safe for early pregnancy." },
      ],
    },
    yo: {
      title: "Ibà nígbà oyún",
      summary: "Ibà léwu jù nígbà oyún. Sùn sínú àwọ̀n tí a ti fi oògùn sí, kí o sì lo oògùn ìdènà rẹ.",
      body: [
        { type: "p", text: "Ibà nígbà oyún lè fa ẹ̀jẹ̀ tó kéré gan-an, oyún tó bàjẹ́, ìbímọ ṣáájú àkókò àti ọmọ kékeré. Àwọn aboyún máa ń tètè ní ibà, ó sì máa ń le fún wọn jù." },
        { type: "h", text: "Dáàbò bo ara rẹ" },
        { type: "list", items: [
          "Sùn sínú àwọ̀n ẹ̀fọn tí a ti fi oògùn sí ní gbogbo òru. Béèrè fún èyí tó jẹ́ ọ̀fẹ́ ní kílíníìkì rẹ",
          "Lo oògùn ìdènà ibà (SP, tí àwọn kan ń pè ní IPTp) nígbà ìpàdé ìtọ́jú oyún rẹ, láti ìpele oyún kejì. Wọ́n máa ń fún ọ ní i pẹ̀lú ó kéré tán ọ̀sẹ̀ 4 láàrin",
          "Ti fèrèsé àti ilẹ̀kùn nígbà ìrọ̀lẹ́, kí o sì kó omi tó dúró sí nítòsí ilé rẹ kúrò",
        ] },
        { type: "alert", tone: "amber", text: "Ibà nígbà oyún nílò àyẹ̀wò ibà lọ́jọ́ náà. Má ṣe tọ́jú ara rẹ pẹ̀lú oògùn láti ilé oògùn láìsí àyẹ̀wò: àwọn oògùn ibà kan kò dára fún oyún tó ṣẹ̀ṣẹ̀ bẹ̀rẹ̀." },
      ],
    },
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
    pcm: {
      title: "Iron, folic acid and low blood",
      summary: "Low blood (anaemia) dey common for pregnancy and e dey make bleeding for birth more dangerous. Daily tablet dey help.",
      body: [
        { type: "p", text: "WHO recommend iron and folic acid tablet every day for pregnancy. Folic acid dey help prevent problem for pikin brain and back bone. Iron dey prevent low blood." },
        { type: "h", text: "Signs of low blood" },
        { type: "list", items: [
          "You dey tire well well or your body weak",
          "Inside your eyelid, your gum or your palm dey pale",
          "Breath dey cut you quick, or your heart dey beat fast fast",
          "Your head dey turn",
        ] },
        { type: "h", text: "Tips" },
        { type: "list", items: [
          "Take the tablet every day, even when you feel fine",
          "Take am with water or orange juice, no be with tea, coffee or milk",
          "Black shit dey normal when you dey take iron. Constipation dey common: drink water and chop fruit and vegetable",
          "Food wey get iron: beans, liver, meat, fish, egg, ugu, efo, and other dark green leaf",
        ] },
      ],
    },
    yo: {
      title: "Iron, folic acid àti ẹ̀jẹ̀ tó kéré",
      summary: "Ẹ̀jẹ̀ tó kéré (anaemia) wọ́pọ̀ nígbà oyún, ó sì máa ń mú kí ẹ̀jẹ̀ ìbímọ léwu sí i. Oògùn ojoojúmọ́ ń ṣèrànwọ́.",
      body: [
        { type: "p", text: "WHO dámọ̀ràn oògùn iron àti folic acid lójoojúmọ́ nígbà oyún. Folic acid ń ṣèrànwọ́ láti dènà ìṣòro ọpọlọ àti ọ̀pá ẹ̀yìn ọmọ. Iron ń dènà ẹ̀jẹ̀ tó kéré." },
        { type: "h", text: "Àwọn àmì ẹ̀jẹ̀ tó kéré" },
        { type: "list", items: [
          "Ó rẹ̀ ọ́ gan-an tàbí ara rẹ kò lágbára",
          "Inú ìpéǹpéjú, èrìgì tàbí àtẹ́lẹwọ́ rẹ funfun",
          "Èémí máa ń tètè já ọ, tàbí ọkàn rẹ ń lù kíákíá",
          "Orí rẹ ń yí",
        ] },
        { type: "h", text: "Ìmọ̀ràn" },
        { type: "list", items: [
          "Lo oògùn náà lójoojúmọ́, bí ara rẹ tilẹ̀ yá",
          "Lò ó pẹ̀lú omi tàbí omi ọsàn, kì í ṣe pẹ̀lú tíì, kọfí tàbí wàrà",
          "Ìgbẹ́ dúdú wọ́pọ̀ nígbà tí o bá ń lo iron. Àìlè yàgbẹ́ wọ́pọ̀ pẹ̀lú: mu omi kí o sì jẹ èso àti ewébẹ̀",
          "Oúnjẹ tó ní iron: ẹ̀wà, ẹ̀dọ̀, ẹran, ẹja, ẹyin, ugu, ẹ̀fọ́ àti àwọn ewé aláwọ̀ ewé dúdú mìíràn",
        ] },
      ],
    },
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
    pcm: {
      title: "How to chop well for pregnancy",
      summary: "Simple local food wey good for you and your pikin, and the ones to avoid.",
      body: [
        { type: "p", text: "You no need chop for two people. Chop different kind of food every day, and add one small extra food or snack for the second half of pregnancy." },
        { type: "h", text: "Every day, try chop" },
        { type: "list", items: [
          "Protein: beans, moi moi, egg, fish, chicken, meat, groundnut",
          "Vegetable and fruit: ugu, efo, garden egg, carrot, orange, pawpaw, banana, watermelon",
          "Calcium: milk, yoghurt, sardine, crayfish",
          "Energy food, no too much: rice, yam, garri, bread, oats. Choose brown or whole-grain when you fit",
          "Plenty clean water",
        ] },
        { type: "h", text: "Avoid" },
        { type: "list", items: [
          "Alcohol (palm wine join) and smoking, any amount at all",
          "Meat, egg or fish wey no cook well, and fresh milk wey dem no boil",
          "Coffee wey pass about 2 cups for one day. Strong tea and cola drinks get caffeine too",
          "Plenty sweet drinks and food wey salt too much. No put too much seasoning cube",
        ] },
        { type: "p", text: "Wash fruit and vegetable well, and wash your hand before you cook and before you chop." },
      ],
    },
    yo: {
      title: "Jíjẹun dáadáa nígbà oyún",
      summary: "Oúnjẹ ìbílẹ̀ tó rọrùn fún ìwọ àti ọmọ rẹ, àti àwọn tí o yẹ kí o yẹra fún.",
      body: [
        { type: "p", text: "O kò nílò láti jẹun fún ènìyàn méjì. Jẹ oríṣiríṣi oúnjẹ lójoojúmọ́, kí o sì fi oúnjẹ kékeré kan kún un ní ìdajì kejì oyún." },
        { type: "h", text: "Lójoojúmọ́, gbìyànjú láti jẹ" },
        { type: "list", items: [
          "Protein: ẹ̀wà, ọ̀lẹ̀lẹ̀, ẹyin, ẹja, adìyẹ, ẹran, ẹ̀pà",
          "Ewébẹ̀ àti èso: ugu, ẹ̀fọ́, igbá, kárọ́ọ̀tì, ọsàn, ìbẹ́pẹ, ọ̀gẹ̀dẹ̀, bàrà",
          "Calcium: wàrà, yoghurt, sardine, edé",
          "Oúnjẹ agbára ní ìwọ̀nba: ìrẹsì, iṣu, gààrí, búrẹ́dì, oats. Yan èyí tí ó jẹ́ brown tàbí whole-grain tí o bá lè ṣe é",
          "Omi tó mọ́ púpọ̀",
        ] },
        { type: "h", text: "Yẹra fún" },
        { type: "list", items: [
          "Ọtí (pẹ̀lú ẹmu) àti sìgá, bó ti wù kí ó kéré tó",
          "Ẹran, ẹyin tàbí ẹja tí kò jinná dáadáa, àti wàrà tútù tí a kò sè",
          "Kọfí tó ju nǹkan bí ife 2 lọ lójúmọ́. Tíì líle àti ohun mímu cola náà ní caffeine",
          "Ohun mímu oníṣúgà púpọ̀ àti oúnjẹ tí iyọ̀ rẹ̀ pọ̀ jù. Má ṣe lo ọ̀pọ̀ maggi",
        ] },
        { type: "p", text: "Fọ èso àti ewébẹ̀ dáadáa, kí o sì fọ ọwọ́ rẹ kí o tó se oúnjẹ àti kí o tó jẹun." },
      ],
    },
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
    pcm: {
      title: "Medicine, herbs and agbo",
      summary: "Some medicine and herb mixture fit harm your pikin or cause dangerous labour. Check first.",
      body: [
        { type: "p", text: "Many medicines safe for pregnancy, but some no safe. Always tell the chemist or health worker say you get belle." },
        { type: "list", items: [
          "Paracetamol na the normal safe one for pain or fever. Avoid ibuprofen, diclofenac and other painkillers like dem unless doctor talk say make you take am",
          "No buy antibiotics, malaria drug or BP drug from chemist without prescription",
          "Continue to take medicine for long-time sickness (like high BP or epilepsy), but tell your clinic early. Some need make dem change am",
        ] },
        { type: "alert", tone: "red", text: "Avoid agbo and other herb mixture for pregnancy, mostly near the end and for labour. Some dey make the womb squeeze too much, wey fit tear am, harm the pikin, or cause plenty bleeding." },
        { type: "p", text: "If you don already take something, no panic. Tell your health worker wetin e be so dem fit check." },
      ],
    },
    yo: {
      title: "Oògùn, egbò àti agbo",
      summary: "Àwọn oògùn àti àdàlù egbò kan lè ṣe ọmọ rẹ ní ìpalára tàbí fa ìrọbí tó léwu. Kọ́kọ́ béèrè.",
      body: [
        { type: "p", text: "Ọ̀pọ̀ oògùn kò léwu nígbà oyún, ṣùgbọ́n àwọn kan léwu. Máa sọ fún oníṣègùn ilé oògùn tàbí òṣìṣẹ́ ìlera pé o lóyún." },
        { type: "list", items: [
          "Paracetamol ni èyí tí kò léwu tí a sábà máa ń lò fún ìrora tàbí ibà. Yẹra fún ibuprofen, diclofenac àti irú oògùn ìrora bẹ́ẹ̀ àyàfi tí dókítà bá sọ",
          "Má ṣe ra oògùn apakòkòrò, oògùn ibà tàbí oògùn ìfúnpá láti ilé oògùn láìsí ìwé dókítà",
          "Máa lo oògùn fún àìsàn tó ti pẹ́ (bíi ìfúnpá gíga tàbí wárápá), ṣùgbọ́n tètè sọ fún kílíníìkì rẹ. Àwọn kan nílò àyípadà",
        ] },
        { type: "alert", tone: "red", text: "Yẹra fún agbo àti àdàlù egbò mìíràn nígbà oyún, pàápàá nígbà tí oyún bá ń parí àti nígbà ìrọbí. Àwọn kan máa ń mú kí ilé ọmọ fún pọ̀ jù, èyí tí ó lè fà á ya, ṣe ọmọ ní ìpalára, tàbí fa ẹ̀jẹ̀ púpọ̀." },
        { type: "p", text: "Tí o bá ti lo nǹkan kan tẹ́lẹ̀, má ṣe bẹ̀rù. Sọ fún òṣìṣẹ́ ìlera rẹ ohun tí ó jẹ́ kí wọ́n lè yẹ̀ ọ́ wò." },
      ],
    },
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
    pcm: {
      title: "How to prepare for birth",
      summary: "Plan now so that when labour or emergency come, nothing go slow you down.",
      body: [
        { type: "h", text: "Plan before 36 weeks" },
        { type: "list", items: [
          "Where you go born. Choose place wey get trained midwife or doctor, and know the nearest hospital for emergency",
          "How you go reach there, day or night. Save driver number",
          "Money wey you keep for transport and care",
          "Person wey go give blood: family or friend wey ready to give blood if need be",
          "Who go follow you go, and who go look after your other pikin dem",
          "Bag: antenatal card, wrapper, pad, baby cloth, soap, and your phone charger",
        ] },
        { type: "h", text: "Signs say labour don start" },
        { type: "list", items: [
          "Belle wey dey tight and loose for regular time, dey strong more and more, and dey come close close",
          "'Show': sticky mucus, sometimes with small blood",
          "Your water break",
        ] },
        { type: "alert", tone: "red", text: "Go hospital straight if your water break, if blood plenty pass small, if the water green or brown, or if your pikin no dey move like before." },
        { type: "p", text: "Labour before 37 weeks na early labour (preterm). If your belle dey tight regular before 37 weeks, go make dem check you." },
      ],
    },
    yo: {
      title: "Mímúra sílẹ̀ fún ìbímọ",
      summary: "Ṣètò ní báyìí kí ohunkóhun má bàa dí ọ lọ́wọ́ nígbà tí ìrọbí tàbí pàjáwìrì bá dé.",
      body: [
        { type: "h", text: "Ṣètò ṣáájú ọ̀sẹ̀ 36" },
        { type: "list", items: [
          "Ibi tí o máa bímọ sí. Yan ibi tí agbẹ̀bí tàbí dókítà tó mọṣẹ́ wà, kí o sì mọ ilé ìwòsàn tó súnmọ́ ọ fún pàjáwìrì",
          "Bí o ṣe máa dé ibẹ̀, lọ́sàn-án tàbí lóru. Fi nọ́ńbà awakọ̀ kan pamọ́",
          "Owó tí o tọ́jú fún ọkọ̀ àti ìtọ́jú",
          "Ẹni tí yóò fún ọ ní ẹ̀jẹ̀: ẹbí tàbí ọ̀rẹ́ tó ṣetán láti fún ọ ní ẹ̀jẹ̀ tí ó bá pọndandan",
          "Ẹni tí yóò bá ọ lọ, àti ẹni tí yóò tọ́jú àwọn ọmọ rẹ yòókù",
          "Àpò kan: káàdì ìtọ́jú oyún, aṣọ ìró, pádì, aṣọ ọmọ, ọṣẹ, àti chaja fóònù rẹ",
        ] },
        { type: "h", text: "Àwọn àmì pé ìrọbí ti bẹ̀rẹ̀" },
        { type: "list", items: [
          "Ikùn tó ń le tó ń wáyé déédéé, tí ó ń lágbára sí i, tí ó sì ń súnmọ́ ara wọn",
          "'Show': ìkun tó lẹ̀ mọ́ra, nígbà mìíràn pẹ̀lú ẹ̀jẹ̀ díẹ̀",
          "Omi rẹ fọ́",
        ] },
        { type: "alert", tone: "red", text: "Lọ sí ilé ìwòsàn lẹ́sẹ̀kẹsẹ̀ tí omi rẹ bá fọ́, tí ẹ̀jẹ̀ bá ju díẹ̀ lọ, tí omi náà bá jẹ́ àwọ̀ ewé tàbí àwọ̀ ilẹ̀, tàbí tí ọmọ rẹ kò bá rìn tó bí ó ti máa ń rìn." },
        { type: "p", text: "Ìrọbí ṣáájú ọ̀sẹ̀ 37 jẹ́ ìrọbí àìtọ́jọ́ (preterm). Tí ikùn rẹ bá ń le déédéé ṣáájú ọ̀sẹ̀ 37, lọ kí wọ́n yẹ̀ ọ́ wò." },
      ],
    },
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
    pcm: {
      title: "Your health after you born",
      summary: "The 6 weeks after you born na risky time for mothers. Know your check-ups and the warning signs.",
      body: [
        { type: "h", text: "Your check-ups" },
        { type: "list", items: [
          "Stay for the hospital at least 24 hours after you born",
          "Then for 2 to 3 days, 1 to 2 weeks, and 6 weeks after you born",
          "If you born for house, see health worker inside 24 hours",
        ] },
        { type: "alert", tone: "red", text: "Go now now if: plenty bleeding (pad soak inside one hour, or clot wey big reach egg), fits, chest pain, you no fit breathe well, or you dey think to harm yourself or your pikin." },
        { type: "h", text: "See health worker that same day if" },
        { type: "list", items: [
          "Headache wey no gree go with paracetamol, or headache with eye wey dey blur. Pre-eclampsia fit start after you born",
          "BP of 140/90 or pass",
          "Fever (38°C or pass), or something wey dey smell dey comot from your private part",
          "Caesarean or tear wound wey red, swell, dey leak or dey open",
          "One leg wey red, swell, hot or dey pain",
          "Part of your breast wey dey pain, red and hard, plus fever",
        ] },
        { type: "h", text: "Space your next pikin" },
        { type: "p", text: "WHO advise make you wait at least 2 years after you born before you take belle again. E safe pass for you and your next pikin. Ask about family planning for your postnatal visit. Many methods safe when you dey breastfeed." },
      ],
    },
    yo: {
      title: "Ìlera rẹ lẹ́yìn ìbímọ",
      summary: "Ọ̀sẹ̀ 6 lẹ́yìn ìbímọ jẹ́ àkókò ewu fún àwọn ìyá. Mọ àwọn àyẹ̀wò rẹ àti àwọn àmì ìkìlọ̀.",
      body: [
        { type: "h", text: "Àwọn àyẹ̀wò rẹ" },
        { type: "list", items: [
          "Dúró ní ilé ìwòsàn fún ó kéré tán wákàtí 24 lẹ́yìn ìbímọ",
          "Lẹ́yìn náà ní ọjọ́ 2 sí 3, ọ̀sẹ̀ 1 sí 2, àti ọ̀sẹ̀ 6 lẹ́yìn ìbímọ",
          "Tí o bá bímọ nílé, rí òṣìṣẹ́ ìlera láàrin wákàtí 24",
        ] },
        { type: "alert", tone: "red", text: "Lọ ní báyìí fún: ẹ̀jẹ̀ púpọ̀ (pádì tó rin láàrin wákàtí kan, tàbí ẹ̀jẹ̀ dídì tó tóbi tó ẹyin), gìrì, ìrora àyà, ìṣòro mímí, tàbí èrò láti pa ara rẹ tàbí ọmọ rẹ lára." },
        { type: "h", text: "Rí òṣìṣẹ́ ìlera lọ́jọ́ náà fún" },
        { type: "list", items: [
          "Ẹ̀fọ́rí tí kò sàn pẹ̀lú paracetamol, tàbí ẹ̀fọ́rí pẹ̀lú ojú tó ń ṣú. Pre-eclampsia lè bẹ̀rẹ̀ lẹ́yìn ìbímọ",
          "Ìfúnpá 140/90 tàbí jù bẹ́ẹ̀ lọ",
          "Ibà (38°C tàbí jù bẹ́ẹ̀ lọ), tàbí ohun tó ń rùn tó ń jáde láti ojú ara",
          "Ojú ọgbẹ́ iṣẹ́ abẹ tàbí ojú tó ya tó pupa, tó wú, tó ń jò tàbí tó ń ṣí",
          "Ẹsẹ̀ kan tó pupa, tó wú, tó gbóná tàbí tó ń dùn",
          "Apá kan ọmú tó ń dùn, tó pupa, tó sì le, pẹ̀lú ibà",
        ] },
        { type: "h", text: "Fífi àyè sílẹ̀ kí o tó bí ọmọ míì" },
        { type: "p", text: "WHO gbà ọ́ nímọ̀ràn láti dúró ó kéré tán ọdún 2 lẹ́yìn ìbímọ kí o tó tún lóyún. Èyí dájú jù fún ìwọ àti ọmọ rẹ tó kàn. Béèrè nípa ìfètò sọ́mọ bíbí nígbà àyẹ̀wò lẹ́yìn ìbímọ rẹ. Ọ̀pọ̀ ọ̀nà kò léwu nígbà tí o bá ń fún ọmọ lọ́mú." },
      ],
    },
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
    pcm: {
      title: "How you dey feel after you born",
      summary: "To feel down for some days dey common. To feel down for weeks na sickness wey dem fit treat.",
      body: [
        { type: "p", text: "Many mothers dey cry easily, dey worry or vex quick for the first 2 weeks after born. People dey call am 'baby blues' and e dey usually pass with rest and support." },
        { type: "h", text: "Talk to health worker if, for more than 2 weeks, you" },
        { type: "list", items: [
          "Dey sad, empty or no get hope most of the day",
          "No dey interested for anything again, including your pikin",
          "No fit sleep even when pikin dey sleep, or you dey sleep all the time",
          "Dey feel say you no worth anything or dey feel guilty, or you dey fear well well",
        ] },
        { type: "p", text: "This one na postnatal depression. E common, e no be weakness and e no be spiritual attack, and e dey better with treatment and support." },
        { type: "alert", tone: "red", text: "If you dey think to harm yourself or your pikin, or you dey see or hear things wey other people no dey see or hear, find help now. Tell person wey you trust and go hospital." },
      ],
    },
    yo: {
      title: "Bí ọkàn rẹ ṣe rí lẹ́yìn ìbímọ",
      summary: "Kí ọkàn rẹ rẹ̀wẹ̀sì fún ọjọ́ díẹ̀ wọ́pọ̀. Kí ọkàn rẹ rẹ̀wẹ̀sì fún ọ̀sẹ̀ púpọ̀ jẹ́ àìsàn tí a lè tọ́jú.",
      body: [
        { type: "p", text: "Ọ̀pọ̀ ìyá máa ń tètè sunkún, máa ń ṣàníyàn tàbí máa ń tètè bínú ní ọ̀sẹ̀ 2 àkọ́kọ́ lẹ́yìn ìbímọ. Wọ́n sábà máa ń pè é ní 'baby blues', ó sì máa ń kọjá pẹ̀lú ìsinmi àti ìrànlọ́wọ́." },
        { type: "h", text: "Bá òṣìṣẹ́ ìlera sọ̀rọ̀ tí, fún ohun tó ju ọ̀sẹ̀ 2 lọ, o" },
        { type: "list", items: [
          "Ń banújẹ́, ń rí bí ẹni pé o ṣófo tàbí kò sí ìrètí fún èyí tó pọ̀ jù lọ́jọ́",
          "Kò nífẹ̀ẹ́ sí nǹkan mọ́, títí kan ọmọ rẹ",
          "Kò lè sùn bí ọmọ tilẹ̀ ń sùn, tàbí ń sùn ní gbogbo ìgbà",
          "Ń rí bí ẹni pé o kò wúlò tàbí o jẹ̀bi, tàbí ò ń ṣàníyàn púpọ̀",
        ] },
        { type: "p", text: "Èyí ni ìrẹ̀wẹ̀sì ọkàn lẹ́yìn ìbímọ (postnatal depression). Ó wọ́pọ̀, kì í ṣe àìlágbára, kì í sì í ṣe ìkọlù ẹ̀mí, ó sì máa ń sàn pẹ̀lú ìtọ́jú àti ìrànlọ́wọ́." },
        { type: "alert", tone: "red", text: "Tí o bá ní èrò láti pa ara rẹ tàbí ọmọ rẹ lára, tàbí tí o bá ń rí tàbí gbọ́ ohun tí àwọn ẹlòmíì kò rí tàbí gbọ́, wá ìrànlọ́wọ́ ní báyìí. Sọ fún ẹni tí o fọkàn tán kí o sì lọ sí ilé ìwòsàn." },
      ],
    },
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
    pcm: {
      title: "Breastfeeding",
      summary: "Breast milk na all wetin your pikin need for 6 months. Start inside one hour after you born.",
      body: [
        { type: "list", items: [
          "Put your pikin for breast inside the first one hour after you born",
          "The first yellow milk (colostrum) good well well for your pikin. No throw am away",
          "Give only breast milk for the first 6 months: no water, glucose water, herb drink or formula. Breast milk get enough water, even when weather hot",
          "Feed am anytime e want, day and night, usually 8 times or more for one day",
          "Continue to breastfeed with other food until 2 years or pass",
        ] },
        { type: "h", text: "Signs say your pikin dey get enough" },
        { type: "list", items: [
          "6 wet nappies or more every day after the first week",
          "You fit hear or see am dey swallow",
          "Your pikin dey add weight for check-up",
        ] },
        { type: "p", text: "Nipple wey dey pain usually mean say pikin no dey put enough of the breast for mouth. Ask midwife make she check how pikin dey hold the breast. If you get HIV, your clinic go advise you how to feed pikin safe with your treatment." },
      ],
    },
    yo: {
      title: "Fífún ọmọ lọ́mú",
      summary: "Wàrà ọmú ni gbogbo ohun tí ọmọ rẹ nílò fún oṣù 6. Bẹ̀rẹ̀ láàrin wákàtí kan lẹ́yìn ìbímọ.",
      body: [
        { type: "list", items: [
          "Fi ọmọ rẹ sí ọmú láàrin wákàtí àkọ́kọ́ lẹ́yìn ìbímọ",
          "Wàrà òféèfé àkọ́kọ́ (colostrum) dára gan-an fún ọmọ rẹ. Má ṣe dà á nù",
          "Fún un ní wàrà ọmú nìkan fún oṣù 6 àkọ́kọ́: kò sí omi, omi glucose, ohun mímu egbò tàbí wàrà agolo. Wàrà ọmú ní omi tó tó, kódà nígbà ooru",
          "Fún un lọ́mú nígbàkígbà tí ó bá fẹ́, lọ́sàn-án àti lóru, nígbà mẹ́jọ tàbí jù bẹ́ẹ̀ lọ lójúmọ́",
          "Máa fún un lọ́mú pẹ̀lú oúnjẹ mìíràn títí di ọdún 2 tàbí jù bẹ́ẹ̀ lọ",
        ] },
        { type: "h", text: "Àwọn àmì pé ọmọ rẹ ń rí tó" },
        { type: "list", items: [
          "Ìtọ̀ tó rin nápì 6 tàbí jù bẹ́ẹ̀ lọ lójúmọ́ lẹ́yìn ọ̀sẹ̀ àkọ́kọ́",
          "O lè gbọ́ tàbí rí i tí ó ń gbé mì",
          "Ọmọ rẹ ń fi ìwúwo kún un nígbà àyẹ̀wò",
        ] },
        { type: "p", text: "Orí ọmú tó ń dùn sábà máa ń túmọ̀ sí pé ọmọ kò fi ọmú tó sí ẹnu. Ní kí agbẹ̀bí wo bí ọmọ ṣe ń di ọmú mú. Tí o bá ní HIV, kílíníìkì rẹ yóò gbà ọ́ nímọ̀ràn lórí bí o ṣe lè fún ọmọ lọ́mú láìléwu pẹ̀lú ìtọ́jú rẹ." },
      ],
    },
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
    pcm: {
      title: "Danger signs for your new born pikin",
      summary: "New born pikin dey sick quick. Carry your pikin go hospital straight if you see any of these.",
      body: [
        { type: "alert", tone: "red", text: "Carry your pikin go hospital now if you notice any sign wey dey below." },
        { type: "list", items: [
          "E no dey suck well, or e don stop to suck",
          "Fits (e dey jerk)",
          "E dey breathe fast fast, or the chest dey pull inside every time e breathe",
          "Fever, or the body cold when you touch am",
          "E dey sleep too much, body soft like say e no get power, or e dey move only when you touch am",
          "Yellow skin for the first day, or yellow palm and foot bottom any time",
          "Redness, pus or bad smell around the cord",
        ] },
        { type: "h", text: "How to keep your pikin well" },
        { type: "list", items: [
          "Keep the cord clean and dry. No put anything for am unless your health worker talk",
          "Keep your pikin warm, skin to skin with you as much as you fit",
          "Go all postnatal check-ups and make dem give pikin the birth vaccines (BCG, polio and hepatitis B)",
        ] },
      ],
    },
    yo: {
      title: "Àwọn àmì ewu fún ọmọ tuntun rẹ",
      summary: "Àìsàn máa ń yára mú ọmọ tuntun. Gbé ọmọ rẹ lọ sí ilé ìwòsàn lẹ́sẹ̀kẹsẹ̀ tí o bá rí èyíkéyìí nínú ìwọ̀nyí.",
      body: [
        { type: "alert", tone: "red", text: "Gbé ọmọ rẹ lọ sí ilé ìwòsàn ní báyìí tí o bá kíyèsí àmì èyíkéyìí nísàlẹ̀ yìí." },
        { type: "list", items: [
          "Kò mu ọmú dáadáa, tàbí ó ti dẹ́kun mímu ọmú",
          "Gìrì",
          "Ó ń mí kíákíá, tàbí àyà rẹ̀ ń wọnú pẹ̀lú èémí kọ̀ọ̀kan",
          "Ibà, tàbí ara rẹ̀ tutù tí o bá fọwọ́ kàn án",
          "Ó ń sùn jù, ara rẹ̀ rọ̀, tàbí ó ń rìn nìkan tí o bá fọwọ́ kàn án",
          "Ara pọ́n ní ọjọ́ àkọ́kọ́, tàbí àtẹ́lẹwọ́ àti àtẹ́lẹsẹ̀ tó pọ́n nígbàkígbà",
          "Pípupa, ọyún tàbí òórùn burúkú ní àyíká ìdodo",
        ] },
        { type: "h", text: "Bí o ṣe lè pa ọmọ rẹ mọ́ ní àlàáfíà" },
        { type: "list", items: [
          "Jẹ́ kí ìdodo mọ́, kí ó sì gbẹ. Má ṣe fi nǹkan kankan sí i àyàfi tí òṣìṣẹ́ ìlera rẹ bá sọ",
          "Jẹ́ kí ara ọmọ rẹ gbóná, ara rẹ̀ mọ́ ara rẹ bí o ti lè ṣe tó",
          "Lọ sí gbogbo àyẹ̀wò lẹ́yìn ìbímọ, kí wọ́n sì fún ọmọ ní àwọn abẹ́rẹ́ àjẹsára ìbímọ (BCG, polio àti hepatitis B)",
        ] },
      ],
    },
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
