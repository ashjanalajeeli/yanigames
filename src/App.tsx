import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Pencil,
  Volume2,
  VolumeX,
  WifiOff,
} from 'lucide-react';
import { ConfettiOverlay } from './components/ConfettiOverlay';
import { ContentEditorModal } from './components/ContentEditorModal';
import { GameDirectoryModal } from './components/GameDirectoryModal';
import { GeometricBackdrop } from './components/GeometricBackdrop';
import { PWAInstallButton } from './components/PWAInstallButton';
import { BonusChallengeSlide, BonusIntroSlide } from './components/slides/BonusSlides';
import { HeadphoneIntroSlide, HeadphoneWordSlide } from './components/slides/HeadphoneSlides';
import {
  QuickQuestionSlide,
  QuickQuestionsIntroSlide,
} from './components/slides/QuickQuestionsSlides';
import { ThankYouSlide } from './components/slides/ThankYouSlide';
import { WelcomeSlide } from './components/slides/WelcomeSlide';
import { WinnersSlide } from './components/slides/WinnersSlide';
import { XOSlide } from './components/slides/XOSlide';
import {
  SECTION_META,
  loadContent,
  resetStoredContent,
  saveContent,
} from './data/defaultContent';
import { useOnlineStatus } from './hooks/usePWAInstall';
import {
  HeadphoneCategory,
  PresentationContent,
  SectionId,
  SlideEntry,
} from './types/presentation';
import { soundFx } from './utils/soundFx';

export default function App() {
  const [content, setContent] = useState<PresentationContent>(() => loadContent());
  const [headphoneFilter, setHeadphoneFilter] = useState<HeadphoneCategory | 'all'>('all');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorInitialTab, setEditorInitialTab] = useState<
    'questions' | 'headphone' | 'bonus' | 'uno'
  >('questions');
  const [confettiKey, setConfettiKey] = useState(0);
  const isOnline = useOnlineStatus();

  const filteredHeadphoneWords = useMemo(() => {
    if (headphoneFilter === 'all') return content.headphoneWords;
    return content.headphoneWords.filter((w) => w.category === headphoneFilter);
  }, [content.headphoneWords, headphoneFilter]);

  const slides: SlideEntry[] = useMemo(() => {
    const list: SlideEntry[] = [
      { id: 'welcome', section: 'welcome', kind: 'intro', label: 'الترحيب · BE CREATIVE' },
      { id: 'xo', section: 'xo', kind: 'intro', label: 'تحدي XO' },
      {
        id: 'quick-intro',
        section: 'quick-questions',
        kind: 'intro',
        label: 'قواعد الأسئلة السريعة',
      },
      ...content.quickQuestions.map((_, i) => ({
        id: `qq-${i}`,
        section: 'quick-questions' as const,
        kind: 'item' as const,
        label: `سؤال ${i + 1}`,
        itemIndex: i,
      })),
      {
        id: 'headphone-intro',
        section: 'headphone',
        kind: 'intro',
        label: 'قواعد تحدي السماعة',
      },
      ...filteredHeadphoneWords.map((w, i) => ({
        id: `hp-${w.id}`,
        section: 'headphone' as const,
        kind: 'item' as const,
        label: `كلمة ${i + 1}`,
        itemIndex: i,
      })),
      { id: 'bonus-intro', section: 'bonus', kind: 'intro', label: 'جولة البونص' },
      ...content.bonusChallenges.map((_, i) => ({
        id: `bonus-${i}`,
        section: 'bonus' as const,
        kind: 'item' as const,
        label: `تحدي ${i + 1}`,
        itemIndex: i,
      })),
      { id: 'winners', section: 'winners', kind: 'intro', label: 'الفائزون والهدايا' },
      { id: 'thank-you', section: 'thank-you', kind: 'intro', label: 'الختام والشكر' },
    ];
    return list;
  }, [content, filteredHeadphoneWords]);

  // Clamp slide index if content shrinks after editing
  const safeIndex = Math.min(currentSlideIndex, Math.max(0, slides.length - 1));
  const currentSlide = slides[safeIndex];

  const goToSlide = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, index));
      setCurrentSlideIndex(clamped);
      soundFx.playSoftNav();
    },
    [slides.length]
  );

  const goNext = useCallback(() => {
    if (safeIndex < slides.length - 1) {
      goToSlide(safeIndex + 1);
    }
  }, [safeIndex, slides.length, goToSlide]);

  const goPrev = useCallback(() => {
    if (safeIndex > 0) {
      goToSlide(safeIndex - 1);
    }
  }, [safeIndex, goToSlide]);

  const jumpToSection = useCallback(
    (section: SectionId) => {
      const idx = slides.findIndex((s) => s.section === section);
      if (idx !== -1) {
        goToSlide(idx);
      }
    },
    [slides, goToSlide]
  );

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen restriction inside sandboxed iframes
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const triggerCelebration = useCallback(() => {
    setConfettiKey((k) => k + 1);
    soundFx.playWinFanfare();
  }, []);

  // Presenter Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsEditorOpen(false);
        return;
      }

      if (isMenuOpen || isEditorOpen) return;

      // In RTL, ArrowLeft advances forward and ArrowRight goes back
      if (e.key === 'ArrowLeft' || e.key === 'PageDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key === ' ' && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        goNext();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMenuOpen((v) => !v);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, isMenuOpen, isEditorOpen, toggleFullscreen]);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
  };

  const openEditorFor = (tab: 'questions' | 'headphone' | 'bonus' | 'uno') => {
    setEditorInitialTab(tab);
    setIsEditorOpen(true);
  };

  const handleSaveContent = (updated: PresentationContent) => {
    setContent(updated);
    saveContent(updated);
  };

  const handleResetContent = () => {
    const fresh = resetStoredContent();
    setContent(fresh);
  };

  const handleStartHeadphoneCategory = (category: HeadphoneCategory | 'all') => {
    setHeadphoneFilter(category);
    // Find first word slide index after headphone-intro
    const introIdx = slides.findIndex((s) => s.id === 'headphone-intro');
    if (introIdx !== -1) {
      // Wait for next tick if filter changed, or jump directly to introIdx + 1
      setCurrentSlideIndex(introIdx + 1);
      soundFx.playSoftNav();
    }
  };

  const handleSelectHeadphoneFilter = (cat: HeadphoneCategory | 'all') => {
    setHeadphoneFilter(cat);
    const introIdx = slides.findIndex((s) => s.id === 'headphone-intro');
    if (introIdx !== -1) {
      setCurrentSlideIndex(introIdx + 1);
      soundFx.playSoftNav();
    }
  };

  const currentSectionMeta =
    SECTION_META.find((s) => s.id === currentSlide.section) ?? SECTION_META[0];

  const renderSlide = () => {
    switch (currentSlide.section) {
      case 'welcome':
        return (
          <WelcomeSlide
            onNext={goNext}
            onOpenMenu={() => setIsMenuOpen(true)}
          />
        );

      case 'xo':
        return <XOSlide onCelebrate={triggerCelebration} />;

      case 'quick-questions':
        if (currentSlide.kind === 'intro') {
          return (
            <QuickQuestionsIntroSlide
              totalQuestions={content.quickQuestions.length}
              onStartQuestions={goNext}
              onOpenEditor={() => openEditorFor('questions')}
            />
          );
        }
        return (
          <QuickQuestionSlide
            question={content.quickQuestions[currentSlide.itemIndex] ?? ''}
            index={currentSlide.itemIndex}
            total={content.quickQuestions.length}
            onOpenEditor={() => openEditorFor('questions')}
          />
        );

      case 'headphone':
        if (currentSlide.kind === 'intro') {
          return (
            <HeadphoneIntroSlide
              words={content.headphoneWords}
              onStartCategory={handleStartHeadphoneCategory}
              onOpenEditor={() => openEditorFor('headphone')}
            />
          );
        }
        return (
          <HeadphoneWordSlide
            wordItem={
              filteredHeadphoneWords[currentSlide.itemIndex] ??
              filteredHeadphoneWords[0] ??
              content.headphoneWords[0]
            }
            index={currentSlide.itemIndex}
            total={filteredHeadphoneWords.length}
            activeCategory={headphoneFilter}
            onSelectCategory={handleSelectHeadphoneFilter}
            onNextWord={() => {
              if (safeIndex < slides.length - 1 && slides[safeIndex + 1]?.section === 'headphone') {
                goNext();
              } else {
                const introIdx = slides.findIndex((s) => s.id === 'headphone-intro');
                if (introIdx !== -1) goToSlide(introIdx + 1);
              }
            }}
            onOpenEditor={() => openEditorFor('headphone')}
          />
        );

      case 'bonus':
        if (currentSlide.kind === 'intro') {
          return (
            <BonusIntroSlide
              totalChallenges={content.bonusChallenges.length}
              onStartBonus={goNext}
              onOpenEditor={() => openEditorFor('bonus')}
            />
          );
        }
        return (
          <BonusChallengeSlide
            challenge={
              content.bonusChallenges[currentSlide.itemIndex] ??
              content.bonusChallenges[0]
            }
            index={currentSlide.itemIndex}
            total={content.bonusChallenges.length}
            onOpenEditor={() => openEditorFor('bonus')}
          />
        );

      case 'winners':
        return (
          <WinnersSlide
            cards={content.unoCards}
            onCelebrate={triggerCelebration}
            onOpenEditor={() => openEditorFor('uno')}
          />
        );

      case 'thank-you':
        return (
          <ThankYouSlide
            onCelebrate={triggerCelebration}
            onGoHome={() => goToSlide(0)}
            onOpenMenu={() => setIsMenuOpen(true)}
          />
        );
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col bg-[#FAF9F5] text-[#182230] select-none">
      <GeometricBackdrop section={currentSlide.section} />
      <ConfettiOverlay triggerKey={confettiKey} />

      {/* Top Presenter Bar — Clean 3-Zone Contract */}
      <header className="relative z-20 flex items-center justify-between gap-4 px-5 sm:px-8 py-3.5 border-b border-[#182230]/8 bg-[#FAF9F5]/85 backdrop-blur-sm shrink-0">
        {/* Zone 1: Brand Title */}
        <button
          type="button"
          onClick={() => goToSlide(0)}
          className="flex items-center gap-2 text-base sm:text-lg font-extrabold tracking-tight text-[#182230] whitespace-nowrap shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span dir="ltr" className="font-display">
            BE CREATIVE
          </span>
          <span className="text-[#526071] font-normal">·</span>
          <span>يومنا مختلف</span>
        </button>

        {/* Zone 2: Section Navigation & Game Directory Trigger */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-bold text-[#526071]">
          {SECTION_META.map((sec) => {
            const active = currentSlide.section === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => jumpToSection(sec.id)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                  active
                    ? 'text-[#182230] border-[#182230]'
                    : 'border-transparent hover:text-[#182230]'
                }`}
              >
                {sec.titleAr}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Presenter Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton />

          <button
            type="button"
            onClick={() => {
              const tabMap: Record<SectionId, 'questions' | 'headphone' | 'bonus' | 'uno'> = {
                welcome: 'questions',
                xo: 'questions',
                'quick-questions': 'questions',
                headphone: 'headphone',
                bonus: 'bonus',
                winners: 'uno',
                'thank-you': 'questions',
              };
              openEditorFor(tabMap[currentSlide.section]);
            }}
            title="تعديل الأسئلة والكلمات"
            aria-label="تعديل الأسئلة والكلمات"
            className="p-2 rounded-lg border border-[#182230]/12 bg-white text-[#182230] hover:bg-[#FFF3C4] transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم الصوت'}
            aria-label={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم الصوت'}
            className="p-2 rounded-lg border border-[#182230]/12 bg-white text-[#182230] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#FF6B6B]" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'إنهاء ملء الشاشة (F)' : 'عرض ملء الشاشة (F)'}
            aria-label={isFullscreen ? 'إنهاء ملء الشاشة' : 'عرض ملء الشاشة'}
            className="p-2 rounded-lg border border-[#182230]/12 bg-white text-[#182230] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#182230] px-3.5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#273548] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>قائمة الألعاب</span>
          </button>
        </div>
      </header>

      {/* Main 16:9 Presentation Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center overflow-y-auto py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Minimal Presenter Controls */}
      <footer className="relative z-20 flex items-center justify-between gap-4 px-5 sm:px-8 py-3 border-t border-[#182230]/8 bg-[#FAF9F5]/90 backdrop-blur-sm shrink-0">
        {/* Previous Button (Right arrow in RTL) */}
        <button
          type="button"
          onClick={goPrev}
          disabled={safeIndex === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-[#182230]/12 bg-white px-4 py-2 text-sm font-bold text-[#182230] hover:bg-[#EFECE2] disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowRight className="w-4 h-4" />
          <span>السابق</span>
        </button>

        {/* Section & Slide Progress */}
        <div className="flex items-center gap-3">
          {!isOnline && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#11694D]">
              <WifiOff className="w-3.5 h-3.5" />
              <span>يعمل دون إنترنت</span>
              <span aria-hidden="true">·</span>
            </span>
          )}
          <span className="text-xs sm:text-sm font-bold text-[#526071] tabular-nums">
            {currentSectionMeta.titleAr} · {safeIndex + 1} / {slides.length}
          </span>
        </div>

        {/* Next Button (Left arrow in RTL) */}
        <button
          type="button"
          onClick={goNext}
          disabled={safeIndex === slides.length - 1}
          className="inline-flex items-center gap-2 rounded-xl bg-[#182230] px-5 py-2 text-sm font-bold text-white hover:bg-[#273548] disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>التالي</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </footer>

      {/* Game Directory / Quick Jump Modal */}
      <GameDirectoryModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        slides={slides}
        currentSlideIndex={safeIndex}
        onSelectSlide={goToSlide}
        onJumpToSection={jumpToSection}
      />

      {/* Host Content Editor Modal */}
      {isEditorOpen && (
        <ContentEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          content={content}
          onSave={handleSaveContent}
          onResetDefaults={handleResetContent}
          initialTab={editorInitialTab}
        />
      )}
    </div>
  );
}
