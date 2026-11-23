import React, { useState } from 'react';
import { RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { XO_MINI_PROMPTS } from '../../data/defaultContent';
import { soundFx } from '../../utils/soundFx';

interface XOSlideProps {
  onCelebrate: () => void;
}

type CellValue = 'X' | 'O' | null;

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const RULES = [
  'فريقان يتنافسان: فريق X ضد فريق O.',
  'اللعب بالتناوب بين الفريقين.',
  'قبل اختيار الخانة، يجب الإجابة عن سؤال أو تنفيذ تحدٍ.',
  'الإجابة الصحيحة تمنح الفريق حق اختيار خانة على اللوحة.',
  'أول فريق يكوّن 3 علامات متتالية (أفقيًا، عموديًا، أو قطريًا) يفوز!',
];

function checkWinner(board: CellValue[]): { winner: 'X' | 'O' | 'DRAW' | null; line: number[] } {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: 'DRAW', line: [] };
  }
  return { winner: null, line: [] };
}

export const XOSlide: React.FC<XOSlideProps> = ({ onCelebrate }) => {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [scores, setScores] = useState<{ X: number; O: number }>({ X: 0, O: 0 });
  const [promptIndex, setPromptIndex] = useState<number | null>(null);

  const { winner, line: winLine } = checkWinner(board);

  const handleCellClick = (index: number) => {
    if (board[index] !== null || winner !== null) return;
    const nextBoard = [...board];
    nextBoard[index] = turn;
    setBoard(nextBoard);
    soundFx.playPlaceMark(turn);

    const result = checkWinner(nextBoard);
    if (result.winner === 'X' || result.winner === 'O') {
      const winTeam = result.winner;
      setScores((prev) => ({ ...prev, [winTeam]: prev[winTeam] + 1 }));
      soundFx.playWinFanfare();
      onCelebrate();
    } else if (!result.winner) {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  };

  const handleNewRound = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    soundFx.playSoftNav();
  };

  const handleResetScores = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setScores({ X: 0, O: 0 });
    setPromptIndex(null);
    soundFx.playSoftNav();
  };

  const handleDrawPrompt = () => {
    const next = promptIndex === null ? 0 : (promptIndex + 1) % XO_MINI_PROMPTS.length;
    setPromptIndex(next);
    soundFx.playSoftNav();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-10 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Right Column: Title & Rules */}
      <div className="lg:col-span-6 flex flex-col items-start text-right">
        <div className="flex items-center gap-3">
          <h1
            dir="ltr"
            className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#182230]"
          >
            XO CHALLENGE
          </h1>
          <span className="text-3xl" aria-hidden="true">
            ❌⭕
          </span>
        </div>

        <p className="mt-2 text-2xl font-extrabold text-[#FF6B6B]">التحدي يبدأ من هنا!</p>

        <ol className="mt-6 space-y-3 w-full">
          {RULES.map((rule, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3.5 text-base sm:text-lg text-[#182230] leading-snug"
            >
              <span className="font-display tabular-nums shrink-0 w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#805B00] font-bold text-sm flex items-center justify-center mt-0.5">
                0{idx + 1}
              </span>
              <span className="font-medium">{rule}</span>
            </li>
          ))}
        </ol>

        {/* Optional Host Mini-Challenge Drawer */}
        <div className="mt-6 w-full rounded-2xl bg-white border border-[#182230]/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-[#526071]">
              سؤال / تحدٍ سريع للخانة (اختياري)
            </span>
            <button
              type="button"
              onClick={handleDrawPrompt}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFD95A] px-3.5 py-2 text-xs sm:text-sm font-bold text-[#182230] hover:bg-[#f6cc44] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{promptIndex === null ? 'اسحب تحدي' : 'تحدي آخر'}</span>
            </button>
          </div>
          {promptIndex !== null && (
            <p className="mt-3 text-base sm:text-lg font-bold text-[#182230] bg-[#FAF9F5] rounded-xl px-4 py-3 border border-[#182230]/6">
              {XO_MINI_PROMPTS[promptIndex]}
            </p>
          )}
        </div>
      </div>

      {/* Left Column: Live Interactive XO Board */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div className="w-full max-w-[420px] rounded-3xl bg-white border border-[#182230]/10 p-5 sm:p-6 shadow-sm">
          {/* Team Scores & Turn Bar */}
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#182230]/8">
            <div className="flex items-center gap-4 text-sm sm:text-base font-bold tabular-nums">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl ${
                  turn === 'X' && !winner
                    ? 'bg-[#FFE1DF] text-[#9F2929]'
                    : 'text-[#526071]'
                }`}
              >
                <span>فريق X:</span>
                <span>{scores.X}</span>
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl ${
                  turn === 'O' && !winner
                    ? 'bg-[#D7F7EC] text-[#11694D]'
                    : 'text-[#526071]'
                }`}
              >
                <span>فريق O:</span>
                <span>{scores.O}</span>
              </span>
            </div>

            {winner ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#182230]">
                <Trophy className="w-4 h-4 text-[#FF6B6B]" />
                <span>
                  {winner === 'DRAW' ? 'تعادل!' : `فاز فريق ${winner}!`}
                </span>
              </span>
            ) : (
              <span className="text-sm font-bold text-[#526071]">
                الدور الآن:{' '}
                <strong className={turn === 'X' ? 'text-[#FF6B6B]' : 'text-[#11694D]'}>
                  {turn}
                </strong>
              </span>
            )}
          </div>

          {/* 3x3 Interactive Grid */}
          <div
            dir="ltr"
            className="grid grid-cols-3 gap-3 my-5"
            role="grid"
            aria-label="لوحة لعبة XO"
          >
            {board.map((cell, idx) => {
              const isWinCell = winLine.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleCellClick(idx)}
                  disabled={cell !== null || winner !== null}
                  aria-label={`خانة ${idx + 1} ${cell ? cell : 'فارغة'}`}
                  className={`aspect-square rounded-2xl font-display text-5xl sm:text-6xl font-extrabold flex items-center justify-center transition-all duration-150 select-none ${
                    isWinCell
                      ? 'bg-[#FFD95A] text-[#182230] scale-[1.02] shadow-sm'
                      : cell === 'X'
                      ? 'bg-[#FFE1DF] text-[#FF6B6B]'
                      : cell === 'O'
                      ? 'bg-[#D7F7EC] text-[#2BB686]'
                      : 'bg-[#FAF9F5] border border-[#182230]/10 text-[#182230]/20 hover:bg-[#F1EFE7] hover:border-[#182230]/25 cursor-pointer'
                  }`}
                >
                  {cell}
                </button>
              );
            })}
          </div>

          {/* Board Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleNewRound}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#182230] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#273548] transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>جولة جديدة</span>
            </button>
            <button
              type="button"
              onClick={handleResetScores}
              className="rounded-xl border border-[#182230]/12 px-4 py-2.5 text-sm font-semibold text-[#526071] hover:bg-[#FAF9F5] hover:text-[#182230] transition-colors cursor-pointer whitespace-nowrap"
            >
              تصفير النقاط
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
