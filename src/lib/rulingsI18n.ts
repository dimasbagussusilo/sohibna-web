// Localized rulings-catalog content, keyed by the backend ruling `slug`.
//
// The backend seed (sohibna-api internal/seed/seed.go) stores ruling content in
// Indonesian. To let the Hukum "Rulings Collection" follow the app language
// WITHOUT a backend schema change, this module holds the English renderings and
// a category-label map. Callers pass the runtime `RulingEntry` (from /rulings)
// plus the active `lang`; if a translation exists it wins, otherwise the
// backend's own (Indonesian) field is the fallback — so rulings added to the
// backend later still render.
//
// Keep the slug keys in sync with seed.go `rulingSeeds`.

import type { Lang } from '@/i18n/types';
import type { Perspective, RulingEntry } from '@/api';

type LocalizedRuling = {
  question: string;
  perspectives: Perspective[];
};

// Per-ruling overrides. Indonesian comes straight from the backend; English and
// Arabic are the translation work here.
const RULING_I18N: Record<string, Partial<Record<Lang, LocalizedRuling>>> = {
  'parfum-alkohol': {
    en: {
      question: 'Is it permissible to use perfume containing alcohol?',
      perspectives: [
        { label: 'Hanafi School', view: 'Permissible. Alcohol not derived from intoxicating grape/date drink is not impure, so alcohol-based perfume may be used and the garment stays pure for prayer.' },
        { label: "Shafi'i School", view: 'Better avoided (wara’). Some scholars equate every intoxicant with khamr and consider it impure; avoiding it is more cautious, especially on prayer garments.' },
        { label: 'Note', view: 'The difference lies in how khamr is defined and whether industrial alcohol is impure. Follow your conviction and your teacher.' },
      ],
    },
    ar: {
      question: 'هل يجوز استعمال العطر الذي يحتوي على الكحول؟',
      perspectives: [
        { label: 'المذهب الحنفي', view: 'جائز. الكحول غير المستخرج من خمر العنب والتمر ليس بنجس، فيجوز استعمال العطر الكحولي وتبقى الثياب طاهرة للصلاة.' },
        { label: 'المذهب الشافعي', view: 'الأولى تركه (ورعًا). بعض العلماء يلحقون كل مسكر بالخمر ويعتبرونه نجسًا، فتركه أحوط، خصوصًا على ثياب الصلاة.' },
        { label: 'ملاحظة', view: 'الخلاف في حدّ الخمر وفي نجاسة الكحول الصناعي. اتّبع ما تطمئن إليه وشيخك.' },
      ],
    },
  },
  'bunga-bank': {
    en: {
      question: 'What is the ruling on bank interest?',
      perspectives: [
        { label: 'Majority of Scholars', view: 'Haram. It is a form of riba strictly forbidden in the Qur’an (Al-Baqarah: 275–279).' },
        { label: 'Minority View', view: 'A few scholars distinguish consumer interest (haram) from productive interest; this view is weak and not relied upon.' },
        { label: 'Alternative', view: 'Use Islamic banks (murabahah, mudharabah, wadi’ah) that are free of riba as a safer option.' },
      ],
    },
    ar: {
      question: 'ما حكم الفائدة البنكية (الربا)؟',
      perspectives: [
        { label: 'جمهور العلماء', view: 'حرام. وهي صورة من الربا المحرّم تحريمًا قطعيًا في القرآن (البقرة: 275–279).' },
        { label: 'رأي الأقلية', view: 'يفرّق قلة من العلماء بين الفائدة الاستهلاكية (محرّمة) والإنتاجية؛ وهو رأي ضعيف لا يُعتمد.' },
        { label: 'البديل', view: 'استخدم البنوك الإسلامية (المرابحة، المضاربة، الوكالة بأجر) الخالية من الربا وهي أأمن.' },
      ],
    },
  },
  musik: {
    en: {
      question: 'Is listening to music permissible?',
      perspectives: [
        { label: 'The Prohibition View', view: 'Some scholars (including the Shafi‘i school and some companions) forbid musical instruments, with few exceptions such as the duff on Eid.' },
        { label: 'The Permissive View', view: 'Other scholars (including some companions and the tabi‘in) permit music as long as it contains no sin and does not distract from worship.' },
        { label: 'Note', view: 'Lyrics and context (entertainment vs distraction) are decisive. Refer to your conviction and your teacher.' },
      ],
    },
    ar: {
      question: 'ما حكم الاستماع إلى الموسيقى؟',
      perspectives: [
        { label: 'رأي المانعين', view: 'يحرّم بعض العلماء (منهم المذهب الشافعي وبعض الصحابة) آلات المعازف، باستثناءات قليلة كالدف في العيد.' },
        { label: 'رأي المجيزين', view: 'يجوّز آخرون (منهم بعض الصحابة والتابعون) الموسيقى ما دامت خالية من المعصية ولا تصرف عن العبادة.' },
        { label: 'ملاحظة', view: 'الكلمات والسياق (ترويح مقابل إلهاء) حاسمان. ارجع إلى ما تطمئن إليه وشيخك.' },
      ],
    },
  },
  'puasa-suntik': {
    en: {
      question: 'Do injections or IV fluids break the fast?',
      perspectives: [
        { label: 'MUI & Contemporary Majority', view: 'Nutritious injections/IV fluids (replacing food/drink) break the fast; ordinary non-nutritious medicine injections do not.' },
        { label: 'Note', view: 'Vaccines and non-nutritious IV medicine generally do not break the fast. For medical conditions, consult both a doctor and a scholar to balance worship and health.' },
      ],
    },
    ar: {
      question: 'هل الإبر أو المحاليل الوريدية تفطر؟',
      perspectives: [
        { label: 'جمهور المعاصرين', view: 'الإبر والمحاليل المغذّية (التي تقوم مقام الطعام والشراب) تفطر؛ أما إبر الدواء غير المغذّية فلا.' },
        { label: 'ملاحظة', view: 'اللقاحات والإبر العلاجية غير المغذّية لا تفطر عمومًا. للحالات المرضية، استشر طبيبًا وعالمًا للموازنة بين العبادة والصحة.' },
      ],
    },
  },
  'hewan-laut': {
    en: {
      question: 'Which sea animals are halal?',
      perspectives: [
        { label: 'Hanafi School', view: 'Only fish is halal; prawn is allowed, but non-fish sea animals (shark, shellfish, squid) are generally avoided.' },
        { label: "Shafi'i, Maliki, Hanbali", view: 'All sea animals are halal, as in “Lawful to you is game from the sea…” — including prawn, squid, and shellfish.' },
        { label: 'Note', view: 'Those that are venomous or poisonous remain haram because of the harm, not because they come from the sea.' },
      ],
    },
    ar: {
      question: 'ما حيوانات البحر الحلال؟',
      perspectives: [
        { label: 'المذهب الحنفي', view: 'الحلال هو السمك فقط؛ ويجوز الجمبري، أما حيوانات البحر غير السمك (القرش، المحار، الحبار) فيُتجنَب عمومًا.' },
        { label: 'الشافعية والمالكية والحنابلة', view: 'جميع حيوانات البحر حلال، لقوله تعالى «أُحِلَّ لَكُمْ صَيْدُ الْبَحْرِ» — بما فيها الجمبري والحبار والمحار.' },
        { label: 'ملاحظة', view: 'ما كان سامًّا أو مؤذيًا يبقى حرامًا لضرره لا لمجرد كونه بحريًا.' },
      ],
    },
  },
  qurban: {
    en: {
      question: 'How is the sacrificial (qurban) meat distributed?',
      perspectives: [
        { label: 'Prophetic Sunnah', view: 'Divided into thirds: one third for the one offering the sacrifice, one third for family/relatives, one third for the poor.' },
        { label: 'Note', view: 'It may also all be given away. The key is to avoid waste and keep the spirit of the worship alive.' },
      ],
    },
    ar: {
      question: 'كيف تُوزَّع لحوم الأضحية؟',
      perspectives: [
        { label: 'السنّة النبوية', view: 'تُقسَّم أثلاثًا: ثلث للمضحّي، وثلث للأهل والأقارب، وثلث للفقراء.' },
        { label: 'ملاحظة', view: 'ويجوز إهداؤها كلها. والمهم تجنّب الإسراف وإبقاء روح العبادة حيّة.' },
      ],
    },
  },
  tato: {
    en: {
      question: 'What is the ruling on getting a tattoo?',
      perspectives: [
        { label: 'Majority of Scholars', view: 'Haram. The Prophet ﷺ cursed the woman who tattoos and the one who gets tattooed, as it alters Allah’s creation.' },
        { label: 'Regarding Wudu', view: 'A tattoo sits under the skin and does not block water; the majority hold that wudu remains valid, though the sin remains until it is removed.' },
        { label: 'Note', view: 'For those tattooed before knowing the ruling, repentance is sufficient; removing it is preferable if possible without greater harm.' },
      ],
    },
    ar: {
      question: 'ما حكم الوشم؟',
      perspectives: [
        { label: 'جمهور العلماء', view: 'حرام. لعن النبي ﷺ الواشمة والمستوشمة لتغيير خلق الله.' },
        { label: 'في الوضوء', view: 'الوشم تحت الجلد ولا يمنع وصول الماء؛ وعند الجمهور يصحّ الوضوء، مع بقاء الإثم حتى يُزال.' },
        { label: 'ملاحظة', view: 'من وُشم قبل معرفة الحكم فالتوبة كافية، وإزالته أولى إن أمكنت دون ضرر أكبر.' },
      ],
    },
  },
  anjing: {
    en: {
      question: 'What is the ruling on keeping dogs?',
      perspectives: [
        { label: 'Majority of Scholars', view: 'Keeping a dog without need (guarding, hunting, herding) is haram. Dog saliva is a heavy impurity (mughallazhah) and must be washed seven times, one with earth/clean water.' },
        { label: 'Minority View', view: 'Some scholars (Maliki school) consider dogs pure, so keeping them is not impure as long as there is no harm.' },
        { label: 'Note', view: 'For genuine needs such as guard, police, hunting, or guide dogs, it is allowed to the extent of the need.' },
      ],
    },
    ar: {
      question: 'ما حكم تربية الكلاب؟',
      perspectives: [
        { label: 'جمهور العلماء', view: 'تربية الكلب بلا حاجة (حراسة، صيد، رعي) حرام. ولعاب الكلب نجاسة مغلّظة يجب غسلها سبعًا إحداهن بالتراب.' },
        { label: 'رأي الأقلية', view: 'يعتبر بعض العلماء (المالكية) الكلب طاهرًا، فتربيته لا تنجّس ما دام لا ضرر فيه.' },
        { label: 'ملاحظة', view: 'للحاجات الحقيقية كالحراسة والشرطة والصيد والكلاب البوليسية يجوز بقدر الحاجة.' },
      ],
    },
  },
  'bersalaman-lawan-jenis': {
    en: {
      question: 'Is shaking hands with a non-mahram of the opposite sex permissible?',
      perspectives: [
        { label: 'Majority of Scholars', view: 'Haram to shake hands with (touch) a non-mahram of the opposite sex, for both men and women. The Prophet ﷺ never shook hands with women not lawful for him.' },
        { label: 'Note', view: 'In formal or work settings that are hard to avoid, decline politely. Some scholars allow it for an elderly non-mahram without desire, but caution (wara‘) is better.' },
      ],
    },
    ar: {
      question: 'هل يجوز مصافحة غير المحرم من الجنس الآخر؟',
      perspectives: [
        { label: 'جمهور العلماء', view: 'يحرم على الرجل والمرأة مصافحة (لمس) غير المحرم من الجنس الآخر. ولم يصافح النبي ﷺ امرأة أجنبية قط.' },
        { label: 'ملاحظة', view: 'في المواقف الرسمية أو العملية التي يصعب تفاديها، اعتذر بأدب. وأجاز بعض العلماء ذلك لكبير سنّ غير محرم بلا شهوة، لكن الورع أولى.' },
      ],
    },
  },
  asuransi: {
    en: {
      question: 'What is the ruling on taking out insurance?',
      perspectives: [
        { label: 'Majority of Scholars & MUI', view: 'Conventional insurance is haram as it contains gharar (uncertainty), riba, and maysir (gambling).' },
        { label: 'Sharia Alternative', view: 'Islamic insurance (ta’min/takaful) with a mutual-help (tabarru’) contract and free of riba is halal.' },
        { label: 'Note', view: 'Choose a Sharia-compliant insurance product for protection that is blessed.' },
      ],
    },
    ar: {
      question: 'ما حكم التأمين؟',
      perspectives: [
        { label: 'جمهور العلماء', view: 'التأمين التجاري حرام لاشتماله على الغرر والربا والميسر (القمار).' },
        { label: 'البديل الشرعي', view: 'التأمين الإسلامي (التكافل) بعقد التبرّع الخالي من الربا حلال.' },
        { label: 'ملاحظة', view: 'اختر منتج تأمين متوافقًا مع الشريعة لحماية مباركة.' },
      ],
    },
  },
  judi: {
    en: {
      question: 'What is the ruling on gambling?',
      perspectives: [
        { label: 'Majority (Consensus)', view: 'Haram. This includes lotteries, betting, and any game whose gain or loss depends on chance (Al-Ma’idah: 90–91).' },
        { label: 'Note', view: 'What is forbidden is not only winning money but also merely participating, as it corrupts wealth and the heart.' },
      ],
    },
    ar: {
      question: 'ما حكم القمار (الميسر)؟',
      perspectives: [
        { label: 'الإجماع', view: 'حرام. ويشمل اليانصيب والرهان وكل لعبة يعتمد ربحها أو خسارتها على الحظ (المائدة: 90–91).' },
        { label: 'ملاحظة', view: 'المحرّم ليس كسب المال فقط بل المشاركة نفسها، لإفسادها المال والقلب.' },
      ],
    },
  },
  'membaca-quran-tanpa-wudhu': {
    en: {
      question: 'Can the Qur’an be read without wudu (e.g. from a phone)?',
      perspectives: [
        { label: 'Majority of Scholars', view: 'Touching the mushaf (physical Qur’an) requires purity (wudu) based on Al-Waqi‘ah: 79. Reciting from memory without touching the mushaf is allowed without wudu.' },
        { label: 'Other View', view: 'The Hanafi school allows touching the mushaf while in a state of minor impurity; this is a minority view.' },
        { label: 'Contemporary Note', view: 'Reading the Qur’an from a phone/tablet screen — most contemporary scholars allow it without wudu since the screen is not a mushaf, though being in a state of purity is more respectful.' },
      ],
    },
    ar: {
      question: 'هل يجوز قراءة القرآن بلا وضوء (كالقراءة من الهاتف)؟',
      perspectives: [
        { label: 'جمهور العلماء', view: 'مسّ المصحف (القرآن الورقي) يشترط له الطهارة (الوضوء) بناءً على الواقعة: 79. وأما القراءة عن ظهر قلب بلا مسّ المصحف فتجوز بلا وضوء.' },
        { label: 'رأي آخر', view: 'يُجيز المذهب الحنفي مسّ المصحف على غير طهارة؛ وهو رأي الأقلية.' },
        { label: 'ملاحظة معاصرة', view: 'قراءة القرآن من شاشة الهاتف/اللوحي — يجوّزها أكثر المعاصرين بلا وضوء إذ الشاشة ليست مصحفًا، وإن كانت الطهارة أورع.' },
      ],
    },
  },
  'mencukur-jenggot': {
    en: {
      question: 'What is the ruling on shaving the beard?',
      perspectives: [
        { label: 'Majority of Scholars', view: 'Growing the beard and trimming the moustache is recommended (sunnah), as in the hadith of Bukhari & Muslim.' },
        { label: 'On Shaving', view: 'Some scholars hold that shaving the beard is haram, others consider it makruh; this is a disputed matter (khilafiyah).' },
        { label: 'Note', view: 'The established practice is to keep the beard. Refer to your conviction and your teacher.' },
      ],
    },
    ar: {
      question: 'ما حكم حلق اللحية؟',
      perspectives: [
        { label: 'جمهور العلماء', view: 'إعفاء اللحية وتقصير الشارب من السنّة، كما في حديث البخاري ومسلم.' },
        { label: 'في الحلق', view: 'يرى بعض العلماء أن حلقها حرام، وبعضهم يرى أنه مكروه؛ وهو من المسائل الخلافية.' },
        { label: 'ملاحظة', view: 'العمل الثابت هو إبقاء اللحية. ارجع إلى ما تطمئن إليه وشيخك.' },
      ],
    },
  },
  'wanita-haid': {
    en: {
      question: 'What is a menstruating woman not allowed to do?',
      perspectives: [
        { label: 'Majority (Consensus)', view: 'A menstruating woman is neither obligated to nor validly performs prayer and tawaf, and she need not make up the missed obligatory prayers.' },
        { label: 'Note', view: 'Missed Ramadan fasts must be made up (qadha) after purification. Dhikr, studying religion, and reciting the Qur’an without touching the mushaf remain recommended.' },
      ],
    },
    ar: {
      question: 'ما الذي يحرم على الحائض؟',
      perspectives: [
        { label: 'الإجماع', view: 'الحائض لا تجب عليها الصلاة ولا تصحّ منها، ولا الطواف، ولا قضاء الصلوات الفائتة.' },
        { label: 'ملاحظة', view: 'أما صيام رمضان الفائت فيقضى بعد الطهر. ويبقى الذكر وتعلّم الدين وقراءة القرآن بلا مسّ المصحف مستحبّة.' },
      ],
    },
  },
  aqiqah: {
    en: {
      question: 'What are the rulings for aqiqah for a newborn?',
      perspectives: [
        { label: 'Majority of Scholars', view: 'Sunnah muakkadah: two goats for a boy and one for a girl, performed on the seventh day from birth.' },
        { label: 'Note', view: 'It may also be done on the 14th, 21st, or whenever feasible. Shaving the baby’s hair and giving charity equal to the weight of the hair is also recommended.' },
      ],
    },
    ar: {
      question: 'ما أحكام العقيقة للمولود؟',
      perspectives: [
        { label: 'جمهور العلماء', view: 'سنّة مؤكّدة: شاتان للغلام وشاة للجارية، تُذبح في اليوم السابع من الولادة.' },
        { label: 'ملاحظة', view: 'ويجوز فعلها في الرابع عشر أو الحادي والعشرين أو عند الاستطاعة. ويُستحبّ حلق شعر المولود والتصدّق بوزنه ذهبًا أو فضة.' },
      ],
    },
  },
  cryptocurrency: {
    en: {
      question: 'What is the ruling on trading cryptocurrency?',
      perspectives: [
        { label: 'Cautious View', view: 'Some scholars and the DSN-MUI view crypto as permissible as a commodity under strict conditions (clear, with an underlying asset, not purely speculative).' },
        { label: 'Prohibition View', view: 'Other scholars forbid it because of high gharar (uncertainty), speculation, and extreme price volatility.' },
        { label: 'Note', view: 'Crypto transactions carry much risk and uncertainty; consult a Sharia expert and understand the risk before getting involved.' },
      ],
    },
    ar: {
      question: 'ما حكم تداول العملات الرقمية (الكريبتو)؟',
      perspectives: [
        { label: 'رأي المتحرّزين', view: 'يرى بعض العلماء إباحة الكريبتو كسلعة بشروط صارمة (واضحة، لها أصل حقيقي، ليست ربحية محضة).' },
        { label: 'رأي المانعين', view: 'يحرّمه آخرون لفرط الغرر والمضاربة والتذبذب الحادّ في الأسعار.' },
        { label: 'ملاحظة', view: 'معاملات الكريبتو تنطوي على مخاطرة وغرر كبيرَين؛ استشر خبيرًا شرعيًا وافهم الخطر قبل الانخراط فيها.' },
      ],
    },
  },
};

// Category label overrides (many are Arabic technical terms kept as-is).
const CATEGORY_I18N: Record<string, Partial<Record<Lang, string>>> = {
  Thaharah: { en: 'Purification', ar: 'الطهارة' },
  Muamalah: { en: 'Transactions', ar: 'المعاملات' },
  Ibadah: { en: 'Worship', ar: 'العبادات' },
  Konsumsi: { en: 'Food & Drink', ar: 'الأطعمة والأشربة' },
  Hiburan: { en: 'Entertainment', ar: 'الترفيه' },
  Adab: { en: 'Manners', ar: 'الآداب' },
};

/** Localized question for a ruling (falls back to the backend field). */
export const rulingQuestion = (r: RulingEntry, lang: Lang): string =>
  RULING_I18N[r.slug]?.[lang]?.question ?? r.question;

/** Localized perspectives for a ruling (falls back to the backend field). */
export const rulingPerspectives = (r: RulingEntry, lang: Lang): Perspective[] =>
  RULING_I18N[r.slug]?.[lang]?.perspectives ?? r.perspectives;

/** Localized category label (falls back to the backend value). */
export const rulingCategory = (category: string, lang: Lang): string =>
  CATEGORY_I18N[category]?.[lang] ?? category;
