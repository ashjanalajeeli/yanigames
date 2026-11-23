export type SectionId =
  | 'welcome'
  | 'xo'
  | 'quick-questions'
  | 'headphone'
  | 'bonus'
  | 'winners'
  | 'thank-you';

export type HeadphoneCategory = 'easy' | 'funny' | 'work' | 'hard';

export interface HeadphoneWord {
  id: string;
  word: string;
  category: HeadphoneCategory;
}

export interface BonusChallenge {
  id: string;
  text: string;
  timerSeconds?: number;
}

export type UnoColor = 'mint' | 'coral' | 'yellow' | 'blue';

export interface UnoCard {
  number: number;
  color: UnoColor;
  giftLabel: string;
}

export interface PresentationContent {
  quickQuestions: string[];
  headphoneWords: HeadphoneWord[];
  bonusChallenges: BonusChallenge[];
  unoCards: UnoCard[];
}

export type SlideEntry =
  | { id: string; section: 'welcome'; kind: 'intro'; label: string }
  | { id: string; section: 'xo'; kind: 'intro'; label: string }
  | { id: string; section: 'quick-questions'; kind: 'intro'; label: string }
  | { id: string; section: 'quick-questions'; kind: 'item'; label: string; itemIndex: number }
  | { id: string; section: 'headphone'; kind: 'intro'; label: string }
  | {
      id: string;
      section: 'headphone';
      kind: 'item';
      label: string;
      itemIndex: number;
      categoryFilter?: HeadphoneCategory;
    }
  | { id: string; section: 'bonus'; kind: 'intro'; label: string }
  | { id: string; section: 'bonus'; kind: 'item'; label: string; itemIndex: number }
  | { id: string; section: 'winners'; kind: 'intro'; label: string }
  | { id: string; section: 'thank-you'; kind: 'intro'; label: string };
