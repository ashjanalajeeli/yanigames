import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Headphones,
  Pause,
  Pencil,
  Play,
  RotateCcw,
} from 'lucide-react';
import { HEADPHONE_CATEGORY_META } from '../../data/defaultContent';
import { HeadphoneCategory, HeadphoneWord } from '../../types/presentation';
import { soundFx } from '../../utils/soundFx';

interface HeadphoneIntroProps {
  words: HeadphoneWord[];
  onStartCategory: (category: HeadphoneCategory | 'all') => void;
  onOpenEditor: () => void;
}

const RULES = [
  'أحد اللاعبين يرتدي السماعة ويشغّل الموسيقى.',
  'زميله يحاول إيصال الكلمة من خلال حركة الشفاه فقط.',
  'ممنوع الصراخ أو تكرار الكلمة بصوت مسموع أو استخدام الإشارات باليد.',
  'أمام اللاعب 60 ثانية لتخمين أكبر عدد من الكلمات.',
  'كل كلمة صحيحة تُحتسب نقطة.',
];

export const HeadphoneIntroSlide: React.FC<HeadphoneIntroProps> = ({
  words,
  onStartCategory,
  onOpenEditor,
}) => {
  const categories: HeadphoneCategory[] = ['easy', 'funny', 'work', 'hard'];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-10 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Rules */}
      <div className="lg:col-span-7 flex flex-col items-start text-right">
        <div className="flex items-center gap-3">
          <h1
            dir="ltr"
            className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#182230]"
          >
            HEADPHONE CHALLENGE
          </h1>
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#DCEEFF] text-[#1E568A]">
            <Headphones className="w-6 h-6" />
          </span>
        </div>

        <p className="mt-2 text-2xl font-extrabold text-[#1E568A]">
          اقرأ الشفاه.. واحزر الكلمة!
        </p>

        <ol className="mt-6 space-y-3 w-full">
          {RULES.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-3.5 text-base sm:text-lg text-[#182230]">
              <span className="font-display tabular-nums shrink-0 w-7 h-7 rounded-lg bg-[#DCEEFF] text-[#1E568A] font-bold text-sm flex items-center justify-center mt-0.5">
                0{idx + 1}
              </span>
              <span className="font-medium leading-snug">{rule}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onStartCategory('all')}
            className="inline-flex items-center gap-2.5 rounded-2xl bg-[#182230] px-6 py-3.5 text-base sm:text-lg font-bold text-white hover:bg-[#273548] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>ابدأ عرض الكلمات</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onOpenEditor}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#182230]/15 bg-white px-5 py-3.5 text-base font-bold text-[#182230] hover:bg-[#FAF9F5] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Pencil className="w-4 h-4 text-[#526071]" />
            <span>تعديل الكلمات</span>
          </button>
        </div>
      </div>

      {/* Category Quick Launcher */}
      <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
        {categories.map((cat) => {
          const meta = HEADPHONE_CATEGORY_META[cat];
          const count = words.filter((w) => w.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onStartCategory(cat)}
              className="group flex items-center justify-between gap-4 rounded-2xl bg-white border border-[#182230]/10 px-5 py-4 text-right hover:border-[#182230]/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-3.5 h-10 rounded-full shrink-0 ${meta.bgClass} border ${meta.borderClass}`}
                  aria-hidden="true"
                />
                <div>
                  <div className="text-lg font-bold text-[#182230]">{meta.label}</div>
                  <div className="text-xs font-semibold text-[#526071] tabular-nums">
                    {count} كلمة / عبارة
                  </div>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-[#526071] group-hover:-translate-x-1 transition-transform" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface HeadphoneWordSlideProps {
  wordItem: HeadphoneWord;
  index: number;
  total: number;
  activeCategory: HeadphoneCategory | 'all';
  onSelectCategory: (cat: HeadphoneCategory | 'all') => void;
  onNextWord: () => void;
  onOpenEditor: () => void;
}

export const HeadphoneWordSlide: React.FC<HeadphoneWordSlideProps> = ({
  wordItem,
  index,
  total,
  activeCategory,
  onSelectCategory,
  onNextWord,
  onOpenEditor,
}) => {
  // Host-controlled visibility: defaults to hidden on each word slide so the guessing player never sees it prematurely!
  const [isRevealed, setIsRevealed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [roundScore, setRoundScore] = useState(0);

  const prevWordIdRef = useRef(wordItem.id);

  // Reset reveal state whenever navigating to a new word (so guessing player stays safe!)
  useEffect(() => {
    if (prevWordIdRef.current !== wordItem.id) {
      prevWordIdRef.current = wordItem.id;
      setIsRevealed(false);
    }
  }, [wordItem.id]);

  // Manual 60-second countdown timer
  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          soundFx.playTimerEnd();
          return 0;
        }
        if (prev <= 6) {
          soundFx.playTimerTick();
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  // Shortcut 'H' to toggle hide/show word
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'h' || e.key === 'H' || e.key === 'ا') {
        setIsRevealed((r) => !r);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const meta = HEADPHONE_CATEGORY_META[wordItem.category];
  const categories: Array<{ id: HeadphoneCategory | 'all'; label: string }> = [
    { id: 'all', label: 'الكل' },
    { id: 'easy', label: 'سهلة' },
    { id: 'funny', label: 'مضحكة' },
    { id: 'work', label: 'العمل' },
    { id: 'hard', label: 'عبارات أصعب' },
  ];

  const handleCorrectPoint = () => {
    setRoundScore((s) => s + 1);
    soundFx.playCorrect();
    onNextWord();
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setSecondsLeft(60);
    soundFx.playSoftNav();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-10 py-3 flex flex-col items-center">
      {/* Category Switcher + Timer + Round Score */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3">
        {/* Interactive Category Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[#182230]/10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#182230] text-white'
                  : 'text-[#526071] hover:text-[#182230]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Manual 60s Timer + Round Score Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-white border border-[#182230]/10 px-3 py-1.5">
            <span
              className={`font-display tabular-nums text-xl font-extrabold min-w-[3ch] text-center ${
                secondsLeft <= 10 && secondsLeft > 0
                  ? 'text-[#FF6B6B]'
                  : secondsLeft === 0
                  ? 'text-[#9F2929]'
                  : 'text-[#182230]'
              }`}
            >
              {String(secondsLeft).padStart(2, '0')}s
            </span>

            <button
              type="button"
              onClick={() => {
                if (secondsLeft === 0) setSecondsLeft(60);
                setTimerRunning((r) => !r);
              }}
              aria-label={timerRunning ? 'إيقاف المؤقت' : 'تشغيل المؤقت'}
              className="inline-flex items-center gap-1 rounded-lg bg-[#DCEEFF] text-[#1E568A] px-2.5 py-1 text-xs font-bold hover:bg-[#c5e2ff] transition-colors cursor-pointer whitespace-nowrap"
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{timerRunning ? 'إيقاف' : '60 ثانية'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetTimer}
              title="إعادة ضبط المؤقت"
              aria-label="إعادة ضبط المؤقت"
              className="p-1.5 rounded-lg text-[#526071] hover:bg-[#FAF9F5] hover:text-[#182230] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white border border-[#182230]/10 px-3 py-1.5 text-sm font-bold tabular-nums">
            <span className="text-[#526071]">النقاط:</span>
            <span className="text-[#11694D] text-base">{roundScore}</span>
            {roundScore > 0 && (
              <button
                type="button"
                onClick={() => setRoundScore(0)}
                className="text-xs text-[#526071] hover:text-[#FF6B6B] underline cursor-pointer"
              >
                تصفير
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Line */}
      <div className="mt-4 flex items-center gap-3 text-sm font-bold text-[#526071] tabular-nums">
        <span className={meta.colorClass}>{meta.label}</span>
        <span aria-hidden="true">·</span>
        <span>
          الكلمة {String(index + 1).padStart(2, '0')} من {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Main Word Display / Privacy Curtain */}
      <div className="mt-4 w-full rounded-[32px] bg-white border border-[#182230]/10 px-8 sm:px-14 py-12 sm:py-16 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-2.5"
          style={{
            backgroundColor:
              wordItem.category === 'easy'
                ? '#4FD1A5'
                : wordItem.category === 'funny'
                ? '#FF6B6B'
                : wordItem.category === 'work'
                ? '#5B9BD5'
                : '#FFD95A',
          }}
        />

        {isRevealed ? (
          <>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#182230] leading-tight text-balance my-4">
              {wordItem.word}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#526071]">
              تظهر الكلمة الآن لقارئ الشفاه فقط — اضغط H لإخفائها فورًا
            </p>
          </>
        ) : (
          <div className="py-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF9F5] border border-[#182230]/10 flex items-center justify-center text-[#526071] mb-4">
              <EyeOff className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">
              الكلمة مخفية عن الشاشة
            </h2>
            <p className="mt-2 text-base text-[#526071] max-w-md">
              تأكد أن اللاعب الذي يرتدي السماعة لا ينظر إلى الشاشة، ثم اضغط إظهار الكلمة.
            </p>
          </div>
        )}

        {/* Host Action Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsRevealed((r) => !r);
              soundFx.playSoftNav();
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-bold transition-colors cursor-pointer whitespace-nowrap ${
              isRevealed
                ? 'border border-[#182230]/15 bg-[#FAF9F5] text-[#182230] hover:bg-[#EFECE2]'
                : 'bg-[#182230] text-white hover:bg-[#273548]'
            }`}
          >
            {isRevealed ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            <span>{isRevealed ? 'إخفاء الكلمة (H)' : 'إظهار الكلمة لقارئ الشفاه'}</span>
          </button>

          {isRevealed && (
            <button
              type="button"
              onClick={handleCorrectPoint}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#4FD1A5] px-6 py-3 text-base font-bold text-[#182230] hover:bg-[#3dc396] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Check className="w-5 h-5" />
              <span>تخمين صحيح (+1) والكلمة التالية</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenEditor}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#526071] hover:text-[#182230] transition-colors cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
          <span>تعديل قائمة الكلمات</span>
        </button>
      </div>
    </div>
  );
};
