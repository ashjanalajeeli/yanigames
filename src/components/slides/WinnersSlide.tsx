import React, { useState } from 'react';
import { Gift, Pencil, RotateCcw } from 'lucide-react';
import { UnoCard, UnoColor } from '../../types/presentation';
import { soundFx } from '../../utils/soundFx';

interface WinnersSlideProps {
  cards: UnoCard[];
  onCelebrate: () => void;
  onOpenEditor: () => void;
}

const STEPS = [
  'الهدايا مرتبطة بأرقام بطاقات UNO.',
  'كل فائز يحصل على بطاقة برقم محدد.',
  'الرقم على البطاقة يحدد الهدية أو المفاجأة.',
  'لا يتم الكشف عن الهدية إلا لحظة الاختيار!',
];

const UNO_COLOR_STYLES: Record<
  UnoColor,
  { bg: string; inner: string; text: string; badgeText: string }
> = {
  mint: {
    bg: 'bg-[#4FD1A5]',
    inner: 'bg-[#2BB686]',
    text: 'text-[#182230]',
    badgeText: 'text-[#11694D]',
  },
  coral: {
    bg: 'bg-[#FF6B6B]',
    inner: 'bg-[#E65151]',
    text: 'text-white',
    badgeText: 'text-[#9F2929]',
  },
  yellow: {
    bg: 'bg-[#FFD95A]',
    inner: 'bg-[#F0C230]',
    text: 'text-[#182230]',
    badgeText: 'text-[#805B00]',
  },
  blue: {
    bg: 'bg-[#5B9BD5]',
    inner: 'bg-[#3B7CB8]',
    text: 'text-white',
    badgeText: 'text-[#1E568A]',
  },
};

export const WinnersSlide: React.FC<WinnersSlideProps> = ({
  cards,
  onCelebrate,
  onOpenEditor,
}) => {
  const [revealedNumbers, setRevealedNumbers] = useState<Record<number, boolean>>({});

  const toggleCard = (num: number) => {
    const nextState = !revealedNumbers[num];
    setRevealedNumbers((prev) => ({ ...prev, [num]: nextState }));
    soundFx.playCardFlip();
    if (nextState) {
      onCelebrate();
    }
  };

  const handleResetAll = () => {
    setRevealedNumbers({});
    soundFx.playSoftNav();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-10 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Right Side: Visual Explanation */}
      <div className="lg:col-span-5 flex flex-col items-start text-right">
        <div className="flex items-center gap-3">
          <h1
            dir="ltr"
            className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#182230]"
          >
            WINNERS &amp; GIFTS
          </h1>
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#D7F7EC] text-[#11694D]">
            <Gift className="w-6 h-6" />
          </span>
        </div>

        <p className="mt-2 text-2xl font-extrabold text-[#11694D]">حان وقت المفاجآت!</p>

        <ol className="mt-6 space-y-3.5 w-full">
          {STEPS.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3.5 text-base sm:text-lg text-[#182230]"
            >
              <span className="font-display tabular-nums shrink-0 w-7 h-7 rounded-lg bg-[#D7F7EC] text-[#11694D] font-bold text-sm flex items-center justify-center mt-0.5">
                0{idx + 1}
              </span>
              <span className="font-medium leading-snug">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-2 rounded-xl border border-[#182230]/15 bg-white px-4 py-2.5 text-sm font-bold text-[#182230] hover:bg-[#FAF9F5] transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إخفاء جميع البطاقات</span>
          </button>

          <button
            type="button"
            onClick={onOpenEditor}
            className="inline-flex items-center gap-2 rounded-xl border border-[#182230]/15 bg-white px-4 py-2.5 text-sm font-bold text-[#526071] hover:text-[#182230] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Pencil className="w-4 h-4" />
            <span>تخصيص الهدايا</span>
          </button>
        </div>
      </div>

      {/* Left Side: Interactive UNO Card Grid */}
      <div className="lg:col-span-7">
        <div className="rounded-3xl bg-white border border-[#182230]/10 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#182230]/8">
            <span className="text-sm font-bold text-[#182230]">
              بطاقات الأرقام التفاعلية — اضغط على رقم الفائز عند الاختيار
            </span>
            <span className="text-xs font-semibold text-[#526071] tabular-nums">
              {Object.values(revealedNumbers).filter(Boolean).length} / {cards.length} مكشوفة
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mt-5">
            {cards.map((card) => {
              const isFlipped = !!revealedNumbers[card.number];
              const style = UNO_COLOR_STYLES[card.color];

              return (
                <button
                  key={card.number}
                  type="button"
                  onClick={() => toggleCard(card.number)}
                  aria-label={`بطاقة UNO رقم ${card.number}`}
                  className="perspective-1000 aspect-[3/4] w-full cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#182230] rounded-2xl"
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-300 preserve-3d ${
                      isFlipped ? 'rotate-y-180' : 'group-hover:-translate-y-1'
                    }`}
                  >
                    {/* Front: UNO Numbered Card */}
                    <div
                      className={`absolute inset-0 backface-hidden rounded-2xl ${style.bg} p-2 flex flex-col items-center justify-between shadow-sm border-2 border-white`}
                    >
                      <span
                        className={`self-start font-display tabular-nums text-xs font-extrabold ${style.text} px-1`}
                      >
                        {card.number}
                      </span>

                      <div className="w-4/5 aspect-[3/4] rounded-xl bg-white/95 flex items-center justify-center shadow-inner">
                        <span
                          className={`font-display tabular-nums text-4xl sm:text-5xl font-extrabold ${style.badgeText}`}
                        >
                          {card.number}
                        </span>
                      </div>

                      <span
                        className={`self-end font-display tabular-nums text-xs font-extrabold ${style.text} px-1`}
                      >
                        {card.number}
                      </span>
                    </div>

                    {/* Back: Revealed State */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-[#182230] text-white p-3 flex flex-col items-center justify-center text-center border-2 border-[#FFD95A]">
                      <Gift className="w-6 h-6 text-[#FFD95A] mb-2 shrink-0" />
                      <span className="font-display tabular-nums text-xs text-[#FFD95A] font-bold mb-1">
                        #{card.number}
                      </span>
                      <span className="text-xs sm:text-sm font-bold leading-snug line-clamp-3">
                        {card.giftLabel}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
