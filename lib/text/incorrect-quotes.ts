/**
 * Incorrect Quote Generator — pairs a fandom-style dialogue template with
 * your character names to produce a fake "incorrect quote": an absurd,
 * romantic, or angsty conversation the characters never actually had.
 *
 * Templates are hand-written (no AI) and grouped by mood. Generation is
 * deterministic when a seed is provided (used by tests), random otherwise.
 */

import { mulberry32 } from './random';

export type QuoteMood = 'funny' | 'romantic' | 'angst';

interface QuoteLine {
  /** Index of the speaker in the template's speaker list (0-based). */
  role: number;
  text: string;
}

interface QuoteTemplate {
  mood: QuoteMood;
  /** Number of distinct speakers this template needs (1-3). */
  speakers: number;
  lines: QuoteLine[];
}

export interface IncorrectQuoteOptions {
  names: string[];
  mood: QuoteMood | 'any';
  seed?: number;
}

export interface IncorrectQuote {
  mood: QuoteMood;
  lines: { speaker: string; text: string }[];
}

const TEMPLATES: QuoteTemplate[] = [
  // ── funny ──────────────────────────────────────────────────────────────
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'I have a plan.' },
    { role: 1, text: 'Your plan is stupid.' },
    { role: 0, text: 'It is brilliant.' },
    { role: 1, text: 'It is stupid and brilliant.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'We have to steal it.' },
    { role: 1, text: 'That is illegal.' },
    { role: 0, text: 'Since when has that stopped us?' },
    { role: 1, text: 'Fair point.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'I am not panicking.' },
    { role: 1, text: 'You are literally on fire.' },
    { role: 0, text: "It's a metaphor." },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: "We're not lost." },
    { role: 1, text: "We're on a boat in the middle of a desert." },
    { role: 0, text: "We're not lost. We're exploring." },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: "I'll distract them." },
    { role: 1, text: 'How?' },
    { role: 0, text: "I'll be myself." },
    { role: 1, text: "That's not a distraction. That's a threat." },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'Trust me, I know what I am doing.' },
    { role: 1, text: 'Last time you said that, the building caught fire.' },
    { role: 0, text: 'The building was already on fire.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'What could go wrong?' },
    { role: 1, text: 'Do NOT say that.' },
    { role: 0, text: '...what could go wrong?' },
    { role: 1, text: 'I hate you.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'I have a bad feeling about this.' },
    { role: 1, text: 'You always have a bad feeling.' },
    { role: 0, text: 'And I am always right.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'We need a code name.' },
    { role: 1, text: "Operation: Don't Get Caught." },
    { role: 0, text: "That's not subtle." },
    { role: 1, text: 'Neither are we.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'Are you sure about this?' },
    { role: 1, text: 'Absolutely not.' },
    { role: 0, text: "Great. Let's go." },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'I found the problem.' },
    { role: 1, text: 'Please tell me it is the machine.' },
    { role: 0, text: "It's not the machine." },
    { role: 1, text: "Of course it's not the machine." },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'Why are you like this?' },
    { role: 1, text: 'Years of practice.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: "We're low on supplies." },
    { role: 1, text: "Define 'supplies'." },
    { role: 0, text: 'Anything not nailed down.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'I think I broke it.' },
    { role: 1, text: 'It was already broken.' },
    { role: 0, text: 'I think I broke it more.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: "This is the worst idea you've ever had." },
    { role: 1, text: "I've had worse." },
    { role: 0, text: "That's the problem." },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: "I'm not touching that." },
    { role: 1, text: "It's not cursed." },
    { role: 0, text: "That's exactly what a cursed object would say." },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'Where did you get that?' },
    { role: 1, text: 'I do not know.' },
    { role: 0, text: "You don't know where you got a treasure map?" },
    { role: 1, text: 'I was distracted.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: "We're going to need a bigger plan." },
    { role: 1, text: 'We have a plan.' },
    { role: 0, text: 'I said bigger.' },
  ] },

  // ── romantic ───────────────────────────────────────────────────────────
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: 'You stayed.' },
    { role: 1, text: 'Where else would I go?' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: 'I brought you something.' },
    { role: 1, text: 'You remembered.' },
    { role: 0, text: 'Always.' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: "You're terrible at this." },
    { role: 1, text: 'At what?' },
    { role: 0, text: 'Being subtle about liking me.' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: 'I could stay here forever.' },
    { role: 1, text: 'Who said you have to leave?' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: "You're staring." },
    { role: 1, text: "You're worth staring at." },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: "I don't know what I'd do without you." },
    { role: 1, text: "You'd figure it out." },
    { role: 0, text: "I don't want to find out." },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: 'Is this okay?' },
    { role: 1, text: 'This is perfect.' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: 'I love the way you do that.' },
    { role: 1, text: 'Do what?' },
    { role: 0, text: 'Everything.' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: 'We should talk.' },
    { role: 1, text: "I'd rather do this instead." },
    { role: 0, text: "What is 'this'?" },
    { role: 1, text: 'This.' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: 'You make me want to be better.' },
    { role: 1, text: 'You already are.' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: "I thought you'd left." },
    { role: 1, text: 'I came back for you.' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: "There's something I've been meaning to tell you." },
    { role: 1, text: 'I already know.' },
    { role: 0, text: 'Then say it anyway.' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: "You're my favorite person." },
    { role: 1, text: 'I have no favorites.' },
    { role: 0, text: 'And yet you are still here.' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: "In another life, I'd still choose you." },
    { role: 1, text: "In every life, I'd find you." },
  ] },

  // ── angst ──────────────────────────────────────────────────────────────
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: 'You lied to me.' },
    { role: 1, text: 'I lied to protect you.' },
    { role: 0, text: 'I did not need protecting from the truth. I needed it.' },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: 'Do not go.' },
    { role: 1, text: 'I have to.' },
    { role: 0, text: 'Then take me with you.' },
    { role: 1, text: "I can't." },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: 'Was any of it real?' },
    { role: 1, text: 'All of it was real. That is why it hurts.' },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: 'I waited for you.' },
    { role: 1, text: "I'm sorry I'm late." },
    { role: 0, text: "You're three years late." },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: 'You promised.' },
    { role: 1, text: 'I broke my promise.' },
    { role: 0, text: 'Then what was the point of it?' },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: "I don't recognize you anymore." },
    { role: 1, text: 'Maybe you never knew me.' },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: "It's for the best." },
    { role: 1, text: 'Best for whom?' },
    { role: 0, text: 'For you.' },
    { role: 1, text: "That's not true and you know it." },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: 'We were supposed to be different.' },
    { role: 1, text: 'We were the same. That was the problem.' },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: 'If I could go back, I would.' },
    { role: 1, text: 'Would you change it?' },
    { role: 0, text: "I'd change everything." },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: "You're the reason I stayed." },
    { role: 1, text: 'And the reason I cannot.' },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: "Don't look at me like that." },
    { role: 1, text: 'Like what?' },
    { role: 0, text: 'Like I am already gone.' },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: 'I wrote you letters.' },
    { role: 1, text: 'I never got them.' },
    { role: 0, text: 'You never opened them.' },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: "We're running out of time." },
    { role: 1, text: "We've been running out of time since the beginning." },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: 'Tell me it was worth it.' },
    { role: 1, text: "I can't tell you that." },
  ] },
];

export const MOODS: QuoteMood[] = ['funny', 'romantic', 'angst'];

export function getMoodLabel(mood: QuoteMood): string {
  switch (mood) {
    case 'funny':
      return 'Funny';
    case 'romantic':
      return 'Romantic';
    case 'angst':
      return 'Angst';
  }
}

/**
 * Generate one incorrect quote from the template bank.
 *
 * - names: the characters to cast (empty → "Character N" placeholders)
 * - mood: filter to one mood, or 'any' for the whole bank
 * - seed: deterministic pick (tests / SSR); random when omitted
 *
 * Speakers are assigned in order from the provided names, cycling if there
 * are fewer names than the template needs, and truncating if there are more.
 */
export function generateIncorrectQuote(
  options: IncorrectQuoteOptions,
): IncorrectQuote {
  const names = options.names
    .map((n) => n.trim())
    .filter((n) => n.length > 0);
  const mood = options.mood;

  const pool = mood === 'any' ? TEMPLATES : TEMPLATES.filter((t) => t.mood === mood);
  // Never return an empty pool even if a mood had no templates.
  const source = pool.length > 0 ? pool : TEMPLATES;

  const rand = mulberry32(options.seed ?? Math.floor(Math.random() * 2 ** 31));
  const template = source[Math.floor(rand() * source.length)]!;

  const resolveSpeaker = (role: number): string => {
    if (names.length === 0) return `Character ${role + 1}`;
    return names[role % names.length]!;
  };

  return {
    mood: template.mood,
    lines: template.lines.map((line) => ({
      speaker: resolveSpeaker(line.role),
      text: line.text,
    })),
  };
}
