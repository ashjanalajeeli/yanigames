import React from 'react';
import { ArrowLeft, LayoutGrid } from 'lucide-react';

interface WelcomeSlideProps {
  onNext: () => void;
  onOpenMenu: () => void;
}

export const WelcomeSlide: React.FC<WelcomeSlideProps> = ({ onNext, onOpenMenu }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      {/* Text Content (Right side in RTL) */}
      <div className="lg:col-span-7 flex flex-col items-start text-right">
        <p className="text-sm md:text-base font-semibold text-[#526071] tracking-wide mb-3">
          احتفالية الفريق · لقاء ممتع وخفيف
        </p>

        <h1
          dir="ltr"
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#182230] leading-[1.05]"
        >
          BE CREATIVE
        </h1>

        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#182230] text-balance leading-tight">
          يومنا مختلف 🎉
        </h2>

        <p className="mt-6 text-xl sm:text-2xl font-bold text-[#11694D] text-balance">
          يوم مختلف، ضحك أكثر، وذكريات أجمل!
        </p>

        <p className="mt-3 text-base sm:text-lg text-[#526071] max-w-xl leading-relaxed">
          أهلًا بالزملاء الرائعين! اتركوا روتين العمل قليلًا، واستعدوا لتحديات سريعة،
          مواقف مضحكة، ومفاجآت جميلة نعيشها معًا اليوم.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-3 rounded-2xl bg-[#182230] px-7 py-4 text-lg font-bold text-white shadow-sm hover:bg-[#273548] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>ابدأ التحدي الأول</span>
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex items-center gap-2.5 rounded-2xl border border-[#182230]/15 bg-white px-6 py-4 text-base font-bold text-[#182230] hover:bg-[#FFF3C4] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <LayoutGrid className="w-5 h-5 text-[#526071]" />
            <span>قائمة الألعاب</span>
          </button>
        </div>
      </div>

      {/* Playful Geometric Composition (Left side in RTL) */}
      <div className="lg:col-span-5 flex items-center justify-center">
        <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
          <svg
            viewBox="0 0 360 360"
            className="w-full h-full drop-shadow-sm"
            fill="none"
            aria-label="تصميم هندسي مرح يمثل روح الإبداع والمرح"
          >
            {/* Soft off-white backing card */}
            <rect
              x="24"
              y="24"
              width="312"
              height="312"
              rx="44"
              fill="#FFFFFF"
              stroke="#182230"
              strokeOpacity="0.08"
              strokeWidth="2"
            />
            {/* Mint circle */}
            <circle cx="118" cy="118" r="56" fill="#4FD1A5" />
            {/* Soft Yellow rounded square */}
            <rect x="190" y="64" width="106" height="106" rx="28" fill="#FFD95A" />
            {/* Calm Blue arc */}
            <path
              d="M68 258C68 214.922 102.922 180 146 180V258H68Z"
              fill="#5B9BD5"
            />
            {/* Coral Pink rounded capsule */}
            <rect x="164" y="196" width="132" height="92" rx="30" fill="#FF6B6B" />
            {/* Crisp geometric XO / Sparkle accents */}
            <path
              d="M104 104L132 132M132 104L104 132"
              stroke="#182230"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="243" cy="117" r="22" stroke="#182230" strokeWidth="8" />
            <path
              d="M210 242L228 260L264 222"
              stroke="#FFFFFF"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
