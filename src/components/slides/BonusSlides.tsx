import React, { useEffect, useState } from 'react';
import { ArrowLeft, Pause, Pencil, Play, RotateCcw, Sparkles } from 'lucide-react';
import { BonusChallenge } from '../../types/presentation';
import { soundFx } from '../../utils/soundFx';

interface BonusIntroProps {
  totalChallenges: number;
  onStartBonus: () => void;
  onOpenEditor: () => void;
}

export const BonusIntroSlide: React.FC<BonusIntroProps> = ({
  totalChallenges,
  onStartBonus,
  onOpenEditor,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-6 flex flex-col items-center text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#FFE1DF] text-[#FF6B6B] mb-5">
        <Sparkles className="w-8 h-8" />
      </div>

      <h1
        dir="ltr"
        className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight text-[#182230]"
      >
        BONUS ROUND ✨
      </h1>

      <p className="mt-4 text-2xl sm:text-3xl font-extrabold text-[#FF6B6B]">
        جولة المفاجآت والتحديات الخفيفة!
      </p>

      <p className="mt-4 text-lg text-[#526071] max-w-2xl leading-relaxed">
        تحديات قصيرة، عفوية، وتُضفي جوًا من الضحك والحماس بين الجولات. كل تحدٍ
        يظهر منفردًا على الشاشة، والمقدمة تختار المشارك أو المتطوع.
      </p>

      <p className="mt-3 text-sm font-bold text-[#526071] tabular-nums">
        {totalChallenges} تحديات جاهزة للعرض
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={onStartBonus}
          className="inline-flex items-center gap-3 rounded-2xl bg-[#182230] px-7 py-4 text-lg font-bold text-white hover:bg-[#273548] transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>عرض التحدي الأول</span>
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onOpenEditor}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#182230]/15 bg-white px-5 py-4 text-base font-bold text-[#182230] hover:bg-[#FAF9F5] transition-colors cursor-pointer whitespace-nowrap"
        >
          <Pencil className="w-4 h-4 text-[#526071]" />
          <span>تعديل التحديات</span>
        </button>
      </div>
    </div>
  );
};

interface BonusChallengeSlideProps {
  challenge: BonusChallenge;
  index: number;
  total: number;
  onOpenEditor: () => void;
}

export const BonusChallengeSlide: React.FC<BonusChallengeSlideProps> = ({
  challenge,
  index,
  total,
  onOpenEditor,
}) => {
  const initialTimer = challenge.timerSeconds ?? 0;
  const [secondsLeft, setSecondsLeft] = useState(initialTimer);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setRunning(false);
    setSecondsLeft(challenge.timerSeconds ?? 0);
  }, [challenge.id, challenge.timerSeconds]);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          soundFx.playTimerEnd();
          return 0;
        }
        soundFx.playTimerTick();
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, secondsLeft]);

  const colors = ['#FF6B6B', '#4FD1A5', '#FFD95A', '#5B9BD5'];
  const accent = colors[index % colors.length];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-6 flex flex-col items-center text-center">
      <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-[#526071] tabular-nums">
        <span dir="ltr" className="font-display tracking-wide text-[#182230]">
          BONUS ROUND
        </span>
        <span aria-hidden="true">·</span>
        <span>
          التحدي {String(index + 1).padStart(2, '0')} من {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-6 w-full rounded-[32px] bg-white border border-[#182230]/10 px-8 sm:px-14 py-14 sm:py-20 shadow-sm relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-2.5"
          style={{ backgroundColor: accent }}
        />

        <div className="font-display tabular-nums text-5xl sm:text-6xl font-extrabold text-[#182230]/12 mb-4 select-none">
          #{String(index + 1).padStart(2, '0')}
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#182230] leading-[1.35] text-balance max-w-3xl mx-auto">
          {challenge.text}
        </h2>

        {/* Optional Manual Mini Timer when challenge specifies 5s or 10s */}
        {initialTimer > 0 && (
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#FAF9F5] border border-[#182230]/10 px-5 py-2.5">
            <span
              className={`font-display tabular-nums text-2xl font-extrabold min-w-[3ch] ${
                secondsLeft === 0 ? 'text-[#FF6B6B]' : 'text-[#182230]'
              }`}
            >
              {secondsLeft}s
            </span>
            <button
              type="button"
              onClick={() => {
                if (secondsLeft === 0) setSecondsLeft(initialTimer);
                setRunning((r) => !r);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#182230] text-white px-4 py-2 text-sm font-bold hover:bg-[#273548] transition-colors cursor-pointer whitespace-nowrap"
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{running ? 'إيقاف' : `ابدأ ${initialTimer} ثوانٍ`}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setSecondsLeft(initialTimer);
              }}
              aria-label="إعادة المؤقت"
              className="p-2 rounded-xl text-[#526071] hover:bg-white hover:text-[#182230] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenEditor}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#526071] hover:text-[#182230] transition-colors cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
          <span>تعديل تحديات البونص</span>
        </button>
      </div>
    </div>
  );
};
