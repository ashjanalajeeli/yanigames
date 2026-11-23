import React from 'react';
import { ArrowLeft, Pencil, Zap } from 'lucide-react';

interface QuickQuestionsIntroProps {
  totalQuestions: number;
  onStartQuestions: () => void;
  onOpenEditor: () => void;
}

const RULES = [
  'سيظهر سؤال واحد على الشاشة.',
  'أسرع شخص يرفع يده يحصل على فرصة الإجابة.',
  'لا يجوز مقاطعة المجيب أثناء كلامه.',
  'الإجابة السريعة أو المشاركة المميزة قد تمنح نقطة أو فرصة للفوز بهدية.',
];

export const QuickQuestionsIntroSlide: React.FC<QuickQuestionsIntroProps> = ({
  totalQuestions,
  onStartQuestions,
  onOpenEditor,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-6 flex flex-col items-start text-right">
      <div className="flex items-center gap-3">
        <h1
          dir="ltr"
          className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[#182230]"
        >
          QUICK QUESTIONS
        </h1>
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFD95A] text-[#182230]">
          <Zap className="w-7 h-7" />
        </span>
      </div>

      <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#1E568A]">
        جاوب بسرعة.. لا تفكر كثير!
      </p>

      <div className="mt-8 w-full rounded-3xl bg-white border border-[#182230]/10 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#182230]/8">
          <h2 className="text-lg font-bold text-[#182230]">قواعد الجولة</h2>
          <span className="text-sm font-semibold text-[#526071] tabular-nums">
            {totalQuestions} سؤالًا جاهزًا
          </span>
        </div>

        <ol className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {RULES.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-3.5 text-lg text-[#182230]">
              <span className="font-display tabular-nums shrink-0 w-8 h-8 rounded-xl bg-[#D7F7EC] text-[#11694D] font-bold text-sm flex items-center justify-center mt-0.5">
                0{idx + 1}
              </span>
              <span className="font-medium leading-relaxed">{rule}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onStartQuestions}
          className="inline-flex items-center gap-3 rounded-2xl bg-[#182230] px-7 py-4 text-lg font-bold text-white hover:bg-[#273548] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>عرض السؤال الأول</span>
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onOpenEditor}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#182230]/15 bg-white px-5 py-4 text-base font-bold text-[#182230] hover:bg-[#FAF9F5] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Pencil className="w-4 h-4 text-[#526071]" />
          <span>تعديل الأسئلة</span>
        </button>
      </div>
    </div>
  );
};

interface QuickQuestionSlideProps {
  question: string;
  index: number;
  total: number;
  onOpenEditor: () => void;
}

export const QuickQuestionSlide: React.FC<QuickQuestionSlideProps> = ({
  question,
  index,
  total,
  onOpenEditor,
}) => {
  const accentColors = ['#4FD1A5', '#FF6B6B', '#FFD95A', '#5B9BD5'];
  const accent = accentColors[index % accentColors.length];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-6 flex flex-col items-center text-center">
      {/* Unboxed clean metadata header */}
      <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-[#526071] tabular-nums">
        <span dir="ltr" className="font-display tracking-wide text-[#182230]">
          QUICK QUESTIONS
        </span>
        <span aria-hidden="true">·</span>
        <span>
          السؤال {String(index + 1).padStart(2, '0')} من {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Single Question Focal Stage */}
      <div className="mt-6 w-full rounded-[32px] bg-white border border-[#182230]/10 px-8 sm:px-14 py-14 sm:py-20 shadow-sm relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-2.5"
          style={{ backgroundColor: accent }}
        />

        <div className="font-display tabular-nums text-5xl sm:text-6xl font-extrabold text-[#182230]/12 mb-4 select-none">
          {String(index + 1).padStart(2, '0')}
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#182230] leading-[1.35] text-balance max-w-3xl mx-auto">
          {question}
        </h2>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenEditor}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#526071] hover:text-[#182230] transition-colors cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
          <span>تعديل أو إضافة سؤال</span>
        </button>
      </div>
    </div>
  );
};
