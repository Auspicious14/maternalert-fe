/**
 * Nigerian Pidgin for the key screens: emergency, BP entry and results,
 * symptom check (danger signs) and its results.
 * IDENTICAL in maternalert-web (src/services/pidgin.ts) and
 * maternalert-fe (services/pidgin.ts). Only imports ./i18n.
 *
 * HOW IT WORKS: screens keep their English text and wrap it in tx("...").
 * When Pidgin is on, tx looks the English up here. Anything missing shows in
 * English, so nothing ever breaks.
 *
 * FOR THE REVIEWER: the left side is the English on screen, the right side
 * is the Pidgin. Please check the medical meaning carefully. Keep danger
 * words strong ("now now", "sharp sharp") and never soften advice.
 * {name} placeholders must stay as they are.
 */
import { fill, getLang } from "./i18n";
import { YO } from "./yoruba";

export const PCM: Record<string, string> = {
  // ── Common ────────────────────────────────────────────────────────────────
  Yes: "Yes",
  No: "No",
  Done: "Okay",
  Open: "Open",
  Call: "Call",
  Text: "Text",
  "Sending…": "E dey send…",
  "Saving…": "E dey save…",
  "Back to home": "Go back to home",
  "Find a clinic": "Find clinic",
  "Log blood pressure": "Check your BP",

  // ── BP entry ──────────────────────────────────────────────────────────────
  "Enter both numbers from your BP machine.": "Put the two numbers wey your BP machine show.",
  "Please enter whole numbers only.": "Abeg put only full numbers, no dot.",
  "The top number should be between 60 and 260.": "The top number suppose dey between 60 and 260.",
  "The bottom number should be between 40 and 160.": "The bottom number suppose dey between 40 and 160.",
  "The top number should be higher than the bottom number.": "The top number suppose big pass the bottom number.",
  "Saved. Your blood pressure looks normal.": "E don save. Your BP dey normal.",
  "No internet. Saved on this phone. It will send automatically when you're back online.":
    "No network. E don save for this phone. E go send by itself when network come back.",
  "We couldn't save your reading. Check your internet and try again.":
    "We no fit save your reading. Check your network and try again.",
  "Takes less than a minute": "E no go reach one minute",
  "Type the two numbers exactly as they show on your BP machine.":
    "Type the two numbers exactly as dem show for your BP machine.",
  "Top number": "Top number",
  "Bottom number": "Bottom number",
  "SYS · usually 90–140": "SYS · normally 90–140",
  "DIA · usually 60–90": "DIA · normally 60–90",
  "Save reading": "Save am",
  "For an accurate reading": "To get correct reading",
  "No BP machine? Ask at your clinic or a pharmacy. Don't guess the numbers, because a wrong reading can hide a real problem.":
    "You no get BP machine? Ask for your clinic or chemist. No guess the numbers, because wrong reading fit hide real problem.",
  "Go now if you also have a severe headache, blurred vision, pain under the ribs, or fits.":
    "Go hospital now now if you still get strong headache, your eye dey blur, pain under your ribs, or you dey jerk (fits).",
  "We'll remind you to check again.": "We go remind you to check am again.",
  "No internet, so your clinic hasn't seen this yet. It's saved on this phone and will send automatically. If you need help now, call your clinic.":
    "No network, so your clinic never see this one. E dey saved for this phone and e go send by itself. If you need help now, call your clinic.",
  "This reading couldn't be saved, so your clinic hasn't seen it. Contact them directly.":
    "We no fit save this reading, so your clinic never see am. Call dem yourself.",
  "Get emergency help": "Get emergency help",

  // ── Emergency ─────────────────────────────────────────────────────────────
  "Emergency help": "Emergency help",
  "Your midwife": "Your midwife",
  "Your partner": "Your husband or partner",
  "Family member": "Your family person",
  "Emergency contact": "Emergency contact",
  "Alert sent": "Alert don go",
  "Send alert": "Send alert",
  "Tap once": "Press am once",
  "Sends a WhatsApp or text message to your emergency contact and your clinic, saying you need help now.":
    "E go send WhatsApp or text message to your emergency contact and your clinic say you need help now now.",
  "Your alert was sent to your emergency contact and linked health facility. If you can, also call them directly to make sure they got it.":
    "Your alert don reach your emergency contact and your clinic. If you fit, still call dem make you sure say dem see am.",
  "The alert couldn't be sent. Call or text your contact below, or call {line}.":
    "The alert no go. Call or text your contact wey dey below, or call {line}.",
  "Call for help yourself": "Call for help yourself",
  "You haven't added an emergency contact yet.": "You never add emergency contact.",
  "Add an emergency contact": "Add emergency contact",
  "Call {line} (emergency line)": "Call {line} (emergency line)",
  "Nearest health facility": "Hospital wey near you",
  "Directions and phone numbers": "Road to reach am and phone numbers",
  "Your last blood pressure: {bp} mmHg. Show this to the health worker.":
    "Your last BP: {bp} mmHg. Show am to the health worker.",
  "The alert could not be sent. Call your emergency contact now?\n\n(Cancel to see other options.)":
    "The alert no go. You wan call your emergency contact now?\n\n(Press Cancel to see other options.)",
  "Send your emergency contact a text message instead?": "Make you send your emergency contact text message instead?",
  "The alert could not be sent and you have no emergency contact saved. ":
    "The alert no go and you never save emergency contact. ",
  "Call the emergency line ({line}) now? If you can't, go to the nearest health facility.":
    "You wan call the emergency line ({line}) now? If you no fit, go the nearest hospital.",

  // App-only alert dialog
  "Alert could not be sent": "The alert no go",
  "We could not reach our server. Call or text your emergency contact directly from your phone now, or call the emergency line.":
    "We no fit reach our server. Call or text your emergency contact from your phone now now, or call the emergency line.",
  "We could not reach our server and you have no emergency contact saved. Call the emergency line or go to the nearest health facility now.":
    "We no fit reach our server and you never save emergency contact. Call the emergency line or go the nearest hospital now now.",
  "Call contact": "Call contact",
  "Text contact": "Text contact",
  "Add a contact": "Add contact",
  Close: "Close",

  // ── Symptom check ─────────────────────────────────────────────────────────
  "How are you feeling?": "How your body dey?",
  "Tap everything you feel right now": "Press everything wey you dey feel now",
  "Danger signs": "Danger signs",
  "If you have any of these, go to a health facility now, even before you finish here.":
    "If you get any of these ones, go hospital now now, even before you finish here.",
  "This can be serious.": "This one fit serious.",
  "Please go to a health facility now. You can also": "Abeg go hospital now now. You fit also",
  "send an emergency alert": "send emergency alert",
  "Other symptoms": "Other things wey you dey feel",
  "Describe what you feel": "Talk wetin you dey feel",
  "For example: feeling dizzy when I stand up": "Like: my head dey turn when I stand up",
  "{symptom}: tell us more": "{symptom}: tell us more",
  "A few more details (optional)": "Small more details (if you want)",
  "How bad is it? 1 = mild, 10 = worst": "How e bad reach? 1 = small, 10 = e bad pass",
  "Is it getting better or worse?": "E dey better or e dey worse?",
  Better: "E dey better",
  Worse: "E dey worse",
  Same: "E still dey the same",
  "How long has it lasted?": "How long e don dey?",
  "e.g. 2 hours, 3 days": "like 2 hours, 3 days",
  "When did it start?": "When e start?",
  "e.g. this morning, yesterday": "like this morning, yesterday",
  "Has this happened before?": "E don happen before?",
  "Have you taken any medicine for it?": "You don take any medicine for am?",
  "Choose at least one symptom": "Choose at least one thing wey you dey feel",
  "Send {n} symptom": "Send {n} symptom",
  "Send {n} symptoms": "Send {n} symptoms",
  "Your answers go to your linked clinic. This is not a diagnosis.":
    "Wetin you answer go reach your clinic. This one no be diagnosis.",
  "Please tell us what symptom you are feeling.": "Abeg tell us wetin you dey feel.",
  "Please type the other symptom you feel.": "Abeg type the other thing wey you dey feel.",
  "This can be serious. Please go to a health facility now.": "This one fit serious. Abeg go hospital now now.",
  "Send an emergency alert": "Send emergency alert",
  "We could not save your symptoms. Please try again.": "We no fit save wetin you report. Abeg try again.",

  // Symptoms
  Headache: "Headache",
  "Vaginal Discharge": "Discharge from your private part",
  "Unusual discharge": "Discharge wey no normal",
  "Abdominal/Pelvic Pain": "Belle pain / lower belle pain",
  "Vaginal Bleeding": "Blood from your private part",
  "Nausea/Vomiting": "Belle dey turn / vomiting",
  "Urinary Symptoms": "Urine wahala",
  "Fever/Infection": "Fever / infection",
  "Fetal Movement": "Baby movement",
  "Difficulty Breathing": "You no fit breathe well",
  "Chest Pain": "Chest pain",
  Palpitations: "Heart dey beat fast",
  "Fast or irregular heartbeat": "Your heart dey beat fast or anyhow",
  Fainting: "You faint",
  "Loss of consciousness": "You fall and you no know yourself",
  "Convulsion/Seizure": "Fits / body dey jerk",
  Confusion: "Your head no clear",
  "Sudden Severe Swelling": "Swelling wey come sudden and strong",
  "Persistent Itching": "Body dey scratch you and e no stop",
  "Especially palms/soles": "Mostly for your palm and under your feet",
  "Blurred Vision / Spots": "Eye dey blur / you dey see spots",
  Malaria: "Malaria",
  "Suspected malaria symptoms": "You think say na malaria",
  "Anorexia / Loss of Appetite": "Food no dey sweet you",
  "Not feeling like eating": "You no wan chop",
  "Something else": "Another thing",
  "Type what you feel": "Type wetin you dey feel",

  // Same symptoms as shown in "You reported: …"
  "Vaginal discharge": "Discharge from your private part",
  "Abdominal pain": "Belle pain",
  "Vaginal bleeding": "Blood from your private part",
  "Nausea vomiting": "Belle dey turn / vomiting",
  "Urinary symptoms": "Urine wahala",
  Fever: "Fever",
  "Reduced fetal movement": "Baby no dey move well",
  "Difficulty breathing": "You no fit breathe well",
  "Chest pain": "Chest pain",
  "Abnormal body movement": "Fits / body dey jerk",
  "Sudden swelling": "Swelling wey come sudden",
  "Persistent itching": "Body dey scratch you and e no stop",
  "Blurred vision": "Eye dey blur",
  Anorexia: "Food no dey sweet you",

  // Detail groups
  Type: "Which kind",
  Duration: "How long",
  "Associated symptoms": "Other things wey follow am",
  Colour: "Colour",
  Consistency: "How e be",
  Odour: "Smell",
  Location: "Where e dey pain",
  Volume: "How much",
  Severity: "How e strong reach",
  Symptoms: "Wetin you dey feel",
  "Status (if established)": "How baby dey move (if e don dey move before)",

  // Detail options
  "Mild/dull": "Small / dull",
  "Throbbing/pulsating": "E dey knock knock",
  "Pressure/tightness": "E dey press / tight",
  Sharp: "E dey cut like knife",
  "Severe/sudden": "Strong / e come sudden",
  "One-sided": "For one side",
  "Behind the eyes": "Behind your eye",
  "Less than 1 hour": "E never reach 1 hour",
  "1–6 hours": "1–6 hours",
  "More than 6 hours": "E pass 6 hours",
  "Persistent/recurring": "E no gree stop / e dey come back",
  "Seeing spots/flashes": "You dey see spots or light dey flash",
  Dizziness: "Head dey turn",
  Vomiting: "Vomiting",
  "Sensitivity to light": "Light dey pain your eye",
  Weakness: "Body weak",
  Clear: "Clear like water",
  White: "White",
  Creamy: "Like cream",
  Yellow: "Yellow",
  Green: "Green",
  Grey: "Grey",
  Brown: "Brown",
  Pink: "Pink",
  "Red/bloody": "Red / get blood",
  Watery: "Like water",
  Thin: "Light",
  Thick: "Thick",
  Sticky: "E dey stick",
  Clumpy: "E dey gather like lump",
  "No unusual smell": "E no get strange smell",
  Mild: "Small",
  "Strong/foul smell": "E dey smell bad well well",
  Itching: "E dey scratch",
  Burning: "E dey burn",
  "Vaginal/vulval pain": "Pain for your private part",
  "Pain when urinating": "Pain when you dey urinate",
  "Lower abdominal pain": "Pain for lower belle",
  "Lower abdomen": "Lower belle",
  "Upper abdomen": "Upper belle (under your ribs)",
  "Right side": "Right side",
  "Left side": "Left side",
  Generalized: "Everywhere for belle",
  "Pelvic area": "Waist / lower part",
  Cramping: "E dey squeeze like period pain",
  Stabbing: "E dey stab",
  Pressure: "E dey press",
  Constant: "E no dey stop",
  "Comes and goes": "E dey come and go",
  Spotting: "Small blood (spotting)",
  "Light bleeding": "Small bleeding",
  "Moderate bleeding": "Bleeding wey plenty small",
  "Heavy bleeding": "Plenty bleeding",
  "Bright red": "Bright red",
  "Dark red": "Dark red",
  "Mild nausea": "Belle dey turn small",
  "Severe nausea": "Belle dey turn well well",
  "Vomiting 1–2 times": "Vomit 1–2 times",
  "Frequent vomiting": "You dey vomit plenty times",
  "Unable to keep food/fluids down": "Anything you chop or drink, you dey vomit am",
  "Blood in vomit": "Blood dey your vomit",
  "Frequent urination": "You dey urinate plenty times",
  "Pain/burning when urinating": "Pain or burning when you dey urinate",
  "Blood in urine": "Blood dey your urine",
  "Difficulty urinating": "Urine no gree come well",
  Urgency: "Urine dey hurry you",
  "Foul-smelling urine": "Urine dey smell bad",
  "Mild fever": "Small fever",
  "High fever": "High fever (body hot well well)",
  Chills: "Cold dey catch you",
  "Feeling unusually weak": "Your body weak pass as e dey before",
  "Foul-smelling vaginal discharge": "Discharge wey dey smell bad",
  "Less than usual": "E no dey move like before",
  "Significantly reduced": "E reduce well well",
  "No movement felt": "You no feel baby move at all",
  "General body pain": "Body pain everywhere",
  "Chills/shivering": "Cold dey catch you / you dey shake",
  Sweating: "You dey sweat",

  // ── After a symptom check ─────────────────────────────────────────────────
  "Symptoms sent": "We don receive am",
  "Looking at your recent readings too, you should see a health worker soon.":
    "When we look your recent readings too, you suppose see health worker soon.",
  "You reported: {list}.": "Wetin you report: {list}.",
  "What to do now": "Wetin to do now",
  "Send emergency alert": "Send emergency alert",
  "Show this to the nurse or doctor": "Show this one to the nurse or doctor",
  "Call my emergency contact": "Call my emergency contact",
  "Call {line}": "Call {line}",
  "Find the nearest hospital": "Find the nearest hospital",
  Important: "Important",
};

/** English text in, the current language out. Fills {placeholders}. */
export function tx(en: string, vars?: Record<string, string | number>): string {
  const lang = getLang();
  const dict = lang === "pcm" ? PCM : lang === "yo" ? YO : null;
  const s = dict ? dict[en] ?? en : en;
  return vars ? fill(s, vars) : s;
}
