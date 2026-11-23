import React from 'react';
import { X } from 'lucide-react';
import { SECTION_META } from '../data/defaultContent';
import { SectionId, SlideEntry } from '../types/presentation';

interface GameDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideEntry[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onJumpToSection: (section: SectionId) => void;
}

export const GameDirectoryModal: React.FC<GameDirectoryModalProps> = ({
  isOpen,
  onClose,
  slides,
  currentSlideIndex,
  onSelectSlide,
  onJumpToSection,
}) => {
  if (!isOpen) return null;

  const currentSlide = slides[currentSlideIndex];

  const countBySection = (section: SectionId) =>
    slides.filter((s) => s.section === section && s.kind === 'item').length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#182230]/45 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="قائمة الألعاب والشرائح"
    >
      <div className="w-full max-w-4xl max-h-[88vh] rounded-3xl bg-[#FAF9F5] border border-[#182230]/12 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-[#182230]/8">
          <div>
            <h2 className="text-xl font-extrabold text-[#182230]">قائمة الألعاب والشرائح</h2>
            <p className="text-xs font-medium text-[#526071]">
              اختر أي لعبة أو شريحة للانتقال إليها مباشرة
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="p-2 rounded-xl text-[#526071] hover:bg-[#FAF9F5] hover:text-[#182230] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 7 Main Sections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {SECTION_META.map((sec, idx) => {
              const isCurrent = currentSlide?.section === sec.id;
              const subCount = countBySection(sec.id);

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    onJumpToSection(sec.id);
                    onClose();
                  }}
                  className={`flex flex-col items-start text-right rounded-2xl p-4 border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-white border-[#182230] shadow-sm'
                      : 'bg-white border-[#182230]/10 hover:border-[#182230]/35'
                  }`}
                >
                  <div className="w-full flex items-center justify-between gap-2 mb-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: sec.accent }}
                      aria-hidden="true"
                    />
                    <span className="font-display tabular-nums text-xs font-bold text-[#526071]">
                      0{idx + 1}
                    </span>
                  </div>
                  <div dir="ltr" className="font-display text-base font-extrabold text-[#182230]">
                    {sec.titleEn}
                  </div>
                  <div className="text-sm font-bold text-[#526071] mt-0.5">{sec.titleAr}</div>
                  {subCount > 0 && (
                    <div className="mt-2 text-xs font-semibold text-[#11694D] tabular-nums">
                      {subCount} شرائح تفاعلية
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Direct Slide Jump List for Items */}
          <div className="rounded-2xl bg-white border border-[#182230]/10 p-4">
            <h3 className="text-sm font-extrabold text-[#182230] mb-3">
              انتقال سريع لكل الشرائح ({slides.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {slides.map((slide, idx) => {
                const active = idx === currentSlideIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => {
                      onSelectSlide(idx);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer tabular-nums ${
                      active
                        ? 'bg-[#182230] text-white'
                        : 'bg-[#FAF9F5] text-[#526071] hover:bg-[#EFECE2] hover:text-[#182230]'
                    }`}
                  >
                    {idx + 1}. {slide.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
