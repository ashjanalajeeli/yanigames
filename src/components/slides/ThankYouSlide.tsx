import React from 'react';
import { Home, LayoutGrid, PartyPopper } from 'lucide-react';

interface ThankYouSlideProps {
  onCelebrate: () => void;
  onGoHome: () => void;
  onOpenMenu: () => void;
}

export const ThankYouSlide: React.FC<ThankYouSlideProps> = ({
  onCelebrate,
  onGoHome,
  onOpenMenu,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-8 flex flex-col items-center text-center">
      {/* Geometric Heart / Sun Badge */}
      <div className="w-20 h-20 rounded-3xl bg-[#FFF3C4] border border-[#FFD95A] flex items-center justify-center text-4xl mb-6">
        💛
      </div>

      <h1
        dir="ltr"
        className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#182230] text-balance leading-[1.12] max-w-4xl"
      >
        THANK YOU FOR MAKING TODAY SPECIAL
      </h1>

      <p className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#11694D] text-balance">
        أجمل اللحظات هي التي نصنعها معًا.
      </p>

      <p className="mt-4 text-lg text-[#526071] max-w-2xl leading-relaxed">
        شكرًا لحماسكم، ضحككم، وروح الفريق الرائعة! نتمنى لكم بقية يوم مليء بالإيجابية
        والإبداع، وإلى لقاءات قادمة أجمل 🎉
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={onCelebrate}
          className="inline-flex items-center gap-2.5 rounded-2xl bg-[#FF6B6B] px-7 py-4 text-lg font-bold text-white hover:bg-[#ef5a5a] transition-colors cursor-pointer whitespace-nowrap"
        >
          <PartyPopper className="w-5 h-5" />
          <span>احتفال الختام!</span>
        </button>

        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#182230]/15 bg-white px-6 py-4 text-base font-bold text-[#182230] hover:bg-[#FAF9F5] transition-colors cursor-pointer whitespace-nowrap"
        >
          <LayoutGrid className="w-5 h-5 text-[#526071]" />
          <span>قائمة الألعاب</span>
        </button>

        <button
          type="button"
          onClick={onGoHome}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#182230]/15 bg-white px-6 py-4 text-base font-bold text-[#526071] hover:text-[#182230] transition-colors cursor-pointer whitespace-nowrap"
        >
          <Home className="w-5 h-5" />
          <span>البداية</span>
        </button>
      </div>
    </div>
  );
};
