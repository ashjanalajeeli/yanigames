import React, { useState } from 'react';
import { Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { HEADPHONE_CATEGORY_META } from '../data/defaultContent';
import { HeadphoneCategory, PresentationContent } from '../types/presentation';

interface ContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: PresentationContent;
  onSave: (updated: PresentationContent) => void;
  onResetDefaults: () => void;
  initialTab?: 'questions' | 'headphone' | 'bonus' | 'uno';
}

export const ContentEditorModal: React.FC<ContentEditorModalProps> = ({
  isOpen,
  onClose,
  content,
  onSave,
  onResetDefaults,
  initialTab = 'questions',
}) => {
  const [tab, setTab] = useState<'questions' | 'headphone' | 'bonus' | 'uno'>(initialTab);
  const [draft, setDraft] = useState<PresentationContent>(content);
  const [newQuestion, setNewQuestion] = useState('');
  const [newWord, setNewWord] = useState('');
  const [newWordCategory, setNewWordCategory] = useState<HeadphoneCategory>('easy');
  const [newBonus, setNewBonus] = useState('');
  const [newBonusTimer, setNewBonusTimer] = useState<number>(0);

  if (!isOpen) return null;

  const handleSaveAndClose = () => {
    onSave(draft);
    onClose();
  };

  const addQuestion = () => {
    const trimmed = newQuestion.trim();
    if (!trimmed) return;
    setDraft((prev) => ({ ...prev, quickQuestions: [...prev.quickQuestions, trimmed] }));
    setNewQuestion('');
  };

  const addWord = () => {
    const trimmed = newWord.trim();
    if (!trimmed) return;
    setDraft((prev) => ({
      ...prev,
      headphoneWords: [
        ...prev.headphoneWords,
        { id: `custom-${Date.now()}`, word: trimmed, category: newWordCategory },
      ],
    }));
    setNewWord('');
  };

  const addBonus = () => {
    const trimmed = newBonus.trim();
    if (!trimmed) return;
    setDraft((prev) => ({
      ...prev,
      bonusChallenges: [
        ...prev.bonusChallenges,
        {
          id: `bonus-${Date.now()}`,
          text: trimmed,
          timerSeconds: newBonusTimer > 0 ? newBonusTimer : undefined,
        },
      ],
    }));
    setNewBonus('');
    setNewBonusTimer(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#182230]/45 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="تعديل محتوى العرض"
    >
      <div className="w-full max-w-3xl max-h-[88vh] rounded-3xl bg-[#FAF9F5] border border-[#182230]/12 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-[#182230]/8">
          <div>
            <h2 className="text-xl font-extrabold text-[#182230]">
              تعديل الأسئلة والكلمات والهدايا
            </h2>
            <p className="text-xs font-medium text-[#526071]">
              تُحفظ تعديلاتك محليًا على هذا الجهاز وتعمل بدون إنترنت
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق المحرر"
            className="p-2 rounded-xl text-[#526071] hover:bg-[#FAF9F5] hover:text-[#182230] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 flex flex-wrap gap-2">
          {[
            { id: 'questions' as const, label: `الأسئلة السريعة (${draft.quickQuestions.length})` },
            { id: 'headphone' as const, label: `كلمات السماعة (${draft.headphoneWords.length})` },
            { id: 'bonus' as const, label: `تحديات البونص (${draft.bonusChallenges.length})` },
            { id: 'uno' as const, label: `هدايا UNO (${draft.unoCards.length})` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                tab === t.id
                  ? 'bg-[#182230] text-white'
                  : 'bg-white border border-[#182230]/10 text-[#526071] hover:text-[#182230]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {tab === 'questions' && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
                  placeholder="أضف سؤالًا جديدًا..."
                  className="flex-1 rounded-xl bg-white border border-[#182230]/15 px-4 py-2.5 text-sm font-medium text-[#182230] focus:outline-none focus:border-[#182230]"
                />
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#4FD1A5] px-4 py-2.5 text-sm font-bold text-[#182230] hover:bg-[#3dc396] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة</span>
                </button>
              </div>

              <div className="space-y-2">
                {draft.quickQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-display tabular-nums text-xs font-bold text-[#526071] w-6">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={q}
                      onChange={(e) => {
                        const next = [...draft.quickQuestions];
                        next[idx] = e.target.value;
                        setDraft((prev) => ({ ...prev, quickQuestions: next }));
                      }}
                      className="flex-1 rounded-xl bg-white border border-[#182230]/10 px-3.5 py-2 text-sm text-[#182230]"
                    />
                    <button
                      type="button"
                      disabled={draft.quickQuestions.length <= 1}
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          quickQuestions: prev.quickQuestions.filter((_, i) => i !== idx),
                        }))
                      }
                      aria-label="حذف السؤال"
                      className="p-2 rounded-xl text-[#526071] hover:text-[#FF6B6B] disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'headphone' && (
            <>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addWord()}
                  placeholder="أضف كلمة أو عبارة جديدة..."
                  className="flex-1 min-w-[200px] rounded-xl bg-white border border-[#182230]/15 px-4 py-2.5 text-sm font-medium text-[#182230]"
                />
                <select
                  value={newWordCategory}
                  onChange={(e) => setNewWordCategory(e.target.value as HeadphoneCategory)}
                  className="rounded-xl bg-white border border-[#182230]/15 px-3 py-2.5 text-sm font-bold text-[#182230]"
                >
                  {(['easy', 'funny', 'work', 'hard'] as HeadphoneCategory[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {HEADPHONE_CATEGORY_META[cat].label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addWord}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#4FD1A5] px-4 py-2.5 text-sm font-bold text-[#182230] hover:bg-[#3dc396] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة</span>
                </button>
              </div>

              <div className="space-y-2">
                {draft.headphoneWords.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.word}
                      onChange={(e) => {
                        const next = [...draft.headphoneWords];
                        next[idx] = { ...item, word: e.target.value };
                        setDraft((prev) => ({ ...prev, headphoneWords: next }));
                      }}
                      className="flex-1 rounded-xl bg-white border border-[#182230]/10 px-3.5 py-2 text-sm text-[#182230]"
                    />
                    <select
                      value={item.category}
                      onChange={(e) => {
                        const next = [...draft.headphoneWords];
                        next[idx] = { ...item, category: e.target.value as HeadphoneCategory };
                        setDraft((prev) => ({ ...prev, headphoneWords: next }));
                      }}
                      className="rounded-xl bg-white border border-[#182230]/10 px-2.5 py-2 text-xs font-bold text-[#182230]"
                    >
                      {(['easy', 'funny', 'work', 'hard'] as HeadphoneCategory[]).map((cat) => (
                        <option key={cat} value={cat}>
                          {HEADPHONE_CATEGORY_META[cat].shortLabel}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={draft.headphoneWords.length <= 1}
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          headphoneWords: prev.headphoneWords.filter((w) => w.id !== item.id),
                        }))
                      }
                      aria-label="حذف الكلمة"
                      className="p-2 rounded-xl text-[#526071] hover:text-[#FF6B6B] disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'bonus' && (
            <>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={newBonus}
                  onChange={(e) => setNewBonus(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addBonus()}
                  placeholder="أضف تحدي بونص جديد..."
                  className="flex-1 min-w-[200px] rounded-xl bg-white border border-[#182230]/15 px-4 py-2.5 text-sm font-medium text-[#182230]"
                />
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={newBonusTimer}
                  onChange={(e) => setNewBonusTimer(Number(e.target.value))}
                  placeholder="ثوانٍ"
                  title="مؤقت اختياري بالثواني (0 = بدون مؤقت)"
                  className="w-24 rounded-xl bg-white border border-[#182230]/15 px-3 py-2.5 text-sm font-bold text-[#182230]"
                />
                <button
                  type="button"
                  onClick={addBonus}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#4FD1A5] px-4 py-2.5 text-sm font-bold text-[#182230] hover:bg-[#3dc396] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة</span>
                </button>
              </div>

              <div className="space-y-2">
                {draft.bonusChallenges.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => {
                        const next = [...draft.bonusChallenges];
                        next[idx] = { ...item, text: e.target.value };
                        setDraft((prev) => ({ ...prev, bonusChallenges: next }));
                      }}
                      className="flex-1 rounded-xl bg-white border border-[#182230]/10 px-3.5 py-2 text-sm text-[#182230]"
                    />
                    <button
                      type="button"
                      disabled={draft.bonusChallenges.length <= 1}
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          bonusChallenges: prev.bonusChallenges.filter((b) => b.id !== item.id),
                        }))
                      }
                      aria-label="حذف التحدي"
                      className="p-2 rounded-xl text-[#526071] hover:text-[#FF6B6B] disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'uno' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {draft.unoCards.map((card, idx) => (
                <div
                  key={card.number}
                  className="flex items-center gap-3 rounded-xl bg-white border border-[#182230]/10 p-3"
                >
                  <span className="font-display tabular-nums w-9 h-9 rounded-lg bg-[#182230] text-white font-extrabold flex items-center justify-center shrink-0">
                    {card.number}
                  </span>
                  <input
                    type="text"
                    value={card.giftLabel}
                    onChange={(e) => {
                      const next = [...draft.unoCards];
                      next[idx] = { ...card, giftLabel: e.target.value };
                      setDraft((prev) => ({ ...prev, unoCards: next }));
                    }}
                    placeholder="وصف الهدية أو المفاجأة"
                    className="flex-1 text-sm font-medium text-[#182230] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#182230]/8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onResetDefaults();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#182230]/12 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#526071] hover:text-[#FF6B6B] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>استعادة الافتراضي</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#526071] hover:text-[#182230] cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="rounded-xl bg-[#182230] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#273548] transition-colors cursor-pointer"
            >
              حفظ التعديلات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
