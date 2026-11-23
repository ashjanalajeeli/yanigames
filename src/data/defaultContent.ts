import { HeadphoneCategory, PresentationContent } from '../types/presentation';

export const HEADPHONE_CATEGORY_META: Record<
  HeadphoneCategory,
  { label: string; shortLabel: string; colorClass: string; bgClass: string; borderClass: string }
> = {
  easy: {
    label: 'كلمات سهلة',
    shortLabel: 'سهلة',
    colorClass: 'text-[#11694D]',
    bgClass: 'bg-[#D7F7EC]',
    borderClass: 'border-[#4FD1A5]',
  },
  funny: {
    label: 'كلمات مضحكة',
    shortLabel: 'مضحكة',
    colorClass: 'text-[#9F2929]',
    bgClass: 'bg-[#FFE1DF]',
    borderClass: 'border-[#FF6B6B]',
  },
  work: {
    label: 'كلمات متعلقة بالعمل',
    shortLabel: 'العمل',
    colorClass: 'text-[#1E568A]',
    bgClass: 'bg-[#DCEEFF]',
    borderClass: 'border-[#5B9BD5]',
  },
  hard: {
    label: 'عبارات وتحديات أصعب',
    shortLabel: 'عبارات أصعب',
    colorClass: 'text-[#805B00]',
    bgClass: 'bg-[#FFF3C4]',
    borderClass: 'border-[#FFD95A]',
  },
};

export const SECTION_META: Array<{
  id:
    | 'welcome'
    | 'xo'
    | 'quick-questions'
    | 'headphone'
    | 'bonus'
    | 'winners'
    | 'thank-you';
  titleEn: string;
  titleAr: string;
  accent: string;
}> = [
  { id: 'welcome', titleEn: 'Welcome', titleAr: 'الترحيب', accent: '#4FD1A5' },
  { id: 'xo', titleEn: 'XO Challenge', titleAr: 'تحدي XO', accent: '#FF6B6B' },
  { id: 'quick-questions', titleEn: 'Quick Questions', titleAr: 'أسئلة سريعة', accent: '#FFD95A' },
  { id: 'headphone', titleEn: 'Headphone', titleAr: 'اقرأ الشفاه', accent: '#5B9BD5' },
  { id: 'bonus', titleEn: 'Bonus Round', titleAr: 'جولة المفاجآت', accent: '#FF6B6B' },
  { id: 'winners', titleEn: 'Winners & Gifts', titleAr: 'الفائزون والهدايا', accent: '#4FD1A5' },
  { id: 'thank-you', titleEn: 'Thank You', titleAr: 'الختام', accent: '#FFD95A' },
];

export const DEFAULT_CONTENT: PresentationContent = {
  quickQuestions: [
    'لو صحيت الصبح ولقيت نفسك مدير المكان ليوم واحد، إيش أول قرار بتتخذه؟',
    'إيش المشروب اللي مستحيل يبدأ يومك في الدوام بدونه؟',
    'لو حياتنا في العمل كانت فيلم سينمائي، إيش بيكون عنوانه؟',
    'ما هو أكثر إيموجي تستخدمه في رسائل العمل؟',
    'لو تقدر تضيف ميزة واحدة لمكتبنا بدون أي قيود، إيش بتكون؟',
    'إيش الشيء اللي دايمًا تنساه على مكتبك أو في السيارة؟',
    'لو عندك زر "تخطي" ليوم واحد في الأسبوع، أي يوم تختار وليش؟',
    'إيش أغرب وجبة فطور أكلتها وأنت مستعجل للدوام؟',
    'لو اشتغلت عن بُعد من أي مدينة في العالم لمدة شهر، وين بتروح؟',
    'إيش الجملة اللي تسمعها أو تقولها أكثر شيء وقت الاجتماعات؟',
    'قهوة الصباح: هدوء تام أم سوالف مع الزملاء؟',
    'لو تقدر تتعلم مهارة جديدة في 5 دقائق فقط، إيش بتختار؟',
    'لو فاز فريقنا برحلة جماعية، تقترح رحلة بحرية أم جبلية؟',
    'من الشخص في القاعة اللي تحس إن عنده حل لكل مشكلة تقنية؟',
    'إيش أكثر موقف خفيف وطريف ضحكت عليه في الدوام الفترة الأخيرة؟',
  ],
  headphoneWords: [
    // كلمات سهلة
    { id: 'e1', word: 'قهوة', category: 'easy' },
    { id: 'e2', word: 'مكتب', category: 'easy' },
    { id: 'e3', word: 'مطر', category: 'easy' },
    { id: 'e4', word: 'سيارة', category: 'easy' },
    { id: 'e5', word: 'مفتاح', category: 'easy' },
    { id: 'e6', word: 'جوال', category: 'easy' },
    { id: 'e7', word: 'نظارة', category: 'easy' },
    { id: 'e8', word: 'بيتزا', category: 'easy' },
    // كلمات مضحكة
    { id: 'f1', word: 'كرسي دوّار', category: 'funny' },
    { id: 'f2', word: 'منبه الصباح', category: 'funny' },
    { id: 'f3', word: 'بطاطس مقلية', category: 'funny' },
    { id: 'f4', word: 'شاحن ضايع', category: 'funny' },
    { id: 'f5', word: 'زحمة السير', category: 'funny' },
    { id: 'f6', word: 'نمت في الاجتماع', category: 'funny' },
    { id: 'f7', word: 'بيجاما', category: 'funny' },
    { id: 'f8', word: 'عصير ليمون', category: 'funny' },
    // كلمات متعلقة بالعمل
    { id: 'w1', word: 'بريد إلكتروني', category: 'work' },
    { id: 'w2', word: 'اجتماع طارئ', category: 'work' },
    { id: 'w3', word: 'إجازة سنوية', category: 'work' },
    { id: 'w4', word: 'عرض تقديمي', category: 'work' },
    { id: 'w5', word: 'كلمة المرور', category: 'work' },
    { id: 'w6', word: 'استراحة الغداء', category: 'work' },
    { id: 'w7', word: 'خطة العمل', category: 'work' },
    { id: 'w8', word: 'مشروع جديد', category: 'work' },
    // عبارات وتحديات أصعب
    { id: 'h1', word: 'المايك عندك مكتوم', category: 'hard' },
    { id: 'h2', word: 'النت فصل فجأة', category: 'hard' },
    { id: 'h3', word: 'وين ملف الإكسل؟', category: 'hard' },
    { id: 'h4', word: 'باقي خمس دقايق', category: 'hard' },
    { id: 'h5', word: 'القهوة بردت خلاص', category: 'hard' },
    { id: 'h6', word: 'اجتماع يقدر يكون إيميل', category: 'hard' },
    { id: 'h7', word: 'خلصنا بدري اليوم', category: 'hard' },
    { id: 'h8', word: 'أرسل لي اللوكيشن', category: 'hard' },
  ],
  bonusChallenges: [
    { id: 'b1', text: 'قل 3 أشياء تحتاجها في رحلة برية خلال 5 ثوانٍ!', timerSeconds: 5 },
    { id: 'b2', text: 'قلّد طريقة إعلان اجتماع مفاجئ بنبرة مذيع أخبار!' },
    { id: 'b3', text: 'اختر زميلًا في القاعة وقل له شيئًا إيجابيًا تقدّره فيه.' },
    { id: 'b4', text: 'اذكر 3 أشياء لا تستطيع الاستغناء عنها في العمل يوميًا خلال 5 ثوانٍ!', timerSeconds: 5 },
    { id: 'b5', text: 'مثّل كلمة أو موقفًا من يوميات العمل بدون أي كلام!' },
    { id: 'b6', text: 'اقترح اسمًا مبتكرًا ومضحكًا لفريقنا في 10 ثوانٍ!', timerSeconds: 10 },
    { id: 'b7', text: 'وجّه رسالة شكر سريعة ومبهجة لفريقك بكلمتين فقط!' },
  ],
  unoCards: [
    { number: 1, color: 'mint', giftLabel: 'مفاجأة عند الاختيار!' },
    { number: 2, color: 'coral', giftLabel: 'مفاجأة عند الاختيار!' },
    { number: 3, color: 'yellow', giftLabel: 'مفاجأة عند الاختيار!' },
    { number: 4, color: 'blue', giftLabel: 'مفاجأة عند الاختيار!' },
    { number: 5, color: 'mint', giftLabel: 'مفاجأة عند الاختيار!' },
    { number: 6, color: 'coral', giftLabel: 'مفاجأة عند الاختيار!' },
    { number: 7, color: 'yellow', giftLabel: 'مفاجأة عند الاختيار!' },
    { number: 8, color: 'blue', giftLabel: 'مفاجأة عند الاختيار!' },
    { number: 9, color: 'mint', giftLabel: 'مفاجأة عند الاختيار!' },
    { number: 0, color: 'coral', giftLabel: 'مفاجأة عند الاختيار!' },
  ],
};

export const XO_MINI_PROMPTS: string[] = [
  'اذكر 3 أشياء لونها أخضر في 5 ثوانٍ!',
  'ما هي عاصمة اليابان؟',
  'اذكر تطبيقين تستخدمهما كل يوم في العمل.',
  'قل جملة "خيط حرير على حيط خليل" 3 مرات بسرعة!',
  'اذكر 3 مشروبات ساخنة في 5 ثوانٍ!',
  'في أي قارة تقع دولة البرازيل؟',
  'صف يومك في الدوام بكلمة واحدة إيجابية!',
  'اذكر 3 أشياء توجد عادةً على كل مكتب.',
  'كم عدد أيام السنة الكبيسة؟',
  'اختر زميلًا من الفريق المنافس وصفّق له!',
];

const STORAGE_KEY = 'be_creative_presentation_content_v1';

export function loadContent(): PresentationContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONTENT;
    const parsed = JSON.parse(raw) as Partial<PresentationContent>;
    return {
      quickQuestions:
        Array.isArray(parsed.quickQuestions) && parsed.quickQuestions.length > 0
          ? parsed.quickQuestions
          : DEFAULT_CONTENT.quickQuestions,
      headphoneWords:
        Array.isArray(parsed.headphoneWords) && parsed.headphoneWords.length > 0
          ? parsed.headphoneWords
          : DEFAULT_CONTENT.headphoneWords,
      bonusChallenges:
        Array.isArray(parsed.bonusChallenges) && parsed.bonusChallenges.length > 0
          ? parsed.bonusChallenges
          : DEFAULT_CONTENT.bonusChallenges,
      unoCards:
        Array.isArray(parsed.unoCards) && parsed.unoCards.length > 0
          ? parsed.unoCards
          : DEFAULT_CONTENT.unoCards,
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function saveContent(content: PresentationContent): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    // Ignore storage quota errors silently
  }
}

export function resetStoredContent(): PresentationContent {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
  return DEFAULT_CONTENT;
}
