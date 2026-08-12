/**
 * Incorrect Quote Generator — pairs a fandom-style dialogue template with
 * your character names to produce a fake "incorrect quote": an absurd,
 * romantic, or angsty conversation the characters never actually had.
 *
 * Templates are hand-written (no AI), grouped by mood, and may carry an
 * optional scene header for extra context. Generation is deterministic when
 * a seed is provided (used by tests), random otherwise.
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
  /** Number of distinct speakers this template needs (1-4). */
  speakers: number;
  /** Optional scene header, e.g. "(after the heist)" — rendered above the dialogue. */
  scene?: string;
  lines: QuoteLine[];
}

export interface IncorrectQuoteOptions {
  names: string[];
  mood: QuoteMood | 'any';
  seed?: number;
}

export interface IncorrectQuote {
  mood: QuoteMood;
  scene?: string;
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
  // funny — long-line / rambling + 3-speaker
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: "I don't want to alarm anyone, but I have spent the last three hours making a very detailed plan. It involves all of us. Specifically you. Specifically now. It is legally binding." },
    { role: 1, text: 'It is not legally binding.' },
    { role: 0, text: 'It is spiritually binding.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: "Listen. I know I said 'trust the process.' I know the process has been on fire for eleven minutes. I know I am the one who lit it. But the process is fine." },
    { role: 1, text: 'The process is not fine.' },
    { role: 0, text: 'The process is my friend.' },
  ] },
  { mood: 'funny', speakers: 3, lines: [
    { role: 0, text: 'So here is the plan.' },
    { role: 1, text: "Don't." },
    { role: 2, text: 'Let them cook.' },
    { role: 0, text: 'The plan is that we —' },
    { role: 1, text: "They said don't." },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'I have three rules. One: no panicking. Two: if we do panic, panic quietly. Three: never tell the others about the panic — they will make it worse.' },
    { role: 1, text: 'I heard that.' },
    { role: 0, text: 'Rule four: the others have supernatural hearing.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: "We're not trapped. We're just... temporarily geographically committed." },
    { role: 1, text: 'We are in a locked basement.' },
    { role: 0, text: 'Commitment is a virtue.' },
  ] },
  { mood: 'funny', speakers: 3, lines: [
    { role: 0, text: 'Who broke it?' },
    { role: 1, text: 'It was already broken.' },
    { role: 2, text: 'It was NOT already broken. I watched.' },
    { role: 0, text: 'So we have a liar among us. Wonderful.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'Okay, new plan. We escape through the ceiling. Before you ask — yes, I checked the ceiling. Yes, there is a ceiling. No, I do not know where it leads. That is the adventure part.' },
    { role: 1, text: 'The adventure part is how we die.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'I made a mistake.' },
    { role: 1, text: "Define 'a mistake'." },
    { role: 0, text: 'There is a horse. In the building.' },
    { role: 1, text: 'Which floor?' },
    { role: 0, text: 'All of them, statistically.' },
  ] },
  { mood: 'funny', speakers: 3, lines: [
    { role: 0, text: 'I found a door.' },
    { role: 1, text: "We've seen that door. It's a wall." },
    { role: 2, text: "It's a door that thinks it's a wall." },
    { role: 0, text: 'It just needs encouragement.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'Why is there a suspiciously well-organized map of this building on your desk?' },
    { role: 1, text: "That's not a map. That's a floor plan for the ideal nap." },
    { role: 0, text: "You don't nap on the ceiling." },
    { role: 1, text: 'Not with that attitude.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'For the record, I predicted this. I predicted it in writing. I filed the prediction. It was a very good prediction. Nobody wants to talk about the prediction now.' },
    { role: 1, text: 'We are all talking about the prediction.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: "I've been meaning to ask. What's your greatest fear?" },
    { role: 1, text: 'This conversation.' },
    { role: 0, text: "Too late, we're in it." },
  ] },
  { mood: 'funny', speakers: 3, lines: [
    { role: 0, text: 'We need to blend in.' },
    { role: 1, text: 'Blend in with what?' },
    { role: 2, text: 'In a crowd.' },
    { role: 0, text: 'We ARE a crowd.' },
    { role: 1, text: 'Four people is not a crowd.' },
    { role: 0, text: "It's a crowd if we stand close." },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: 'I have a brilliant idea.' },
    { role: 1, text: 'The last brilliant idea cost us the entire budget.' },
    { role: 0, text: 'This one costs nothing.' },
    { role: 1, text: "That's worse." },
  ] },
  { mood: 'funny', speakers: 2, scene: '(after the heist)', lines: [
    { role: 0, text: "So we're rich?" },
    { role: 1, text: "We're wanted." },
    { role: 0, text: 'Tomato, tomato.' },
  ] },
  { mood: 'funny', speakers: 2, scene: '(at the worst possible moment)', lines: [
    { role: 0, text: 'The good news is I have a plan.' },
    { role: 1, text: 'The bad news?' },
    { role: 0, text: 'The plan is you.' },
  ] },
  { mood: 'funny', speakers: 3, scene: '(mid-battle)', lines: [
    { role: 0, text: 'Cover me!' },
    { role: 1, text: 'Cover you with what?' },
    { role: 2, text: 'I can throw a chair.' },
    { role: 0, text: 'Throw the chair.' },
  ] },
  { mood: 'funny', speakers: 2, lines: [
    { role: 0, text: "I don't negotiate with—" },
    { role: 1, text: 'With what?' },
    { role: 0, text: 'I was going to say terrorists but honestly you are worse. You have opinions.' },
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
  // romantic — long-line
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: "I've done the math. I've done it three times. Every time it comes out the same — that I'm happier with you than without you, and the margin isn't even close. So. That's my report." },
    { role: 1, text: "That's the sweetest spreadsheet I've ever heard." },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: 'You know what I like about you? Everything. That is not a compliment. That is a research finding.' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: 'If I had to pick a favorite version of you...' },
    { role: 1, text: "There's only one version of me." },
    { role: 0, text: 'Every morning is a new version, and I like them all.' },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: 'People ask why I stay. And I always say the same thing — because you make ordinary days feel like something I want to keep. That is it. That is the whole reason. It is a good reason.' },
    { role: 1, text: "It's a great reason." },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: "I'm not good at saying things." },
    { role: 1, text: "You don't have to be. You're good at being here." },
    { role: 0, text: "That's the same thing." },
  ] },
  { mood: 'romantic', speakers: 2, lines: [
    { role: 0, text: 'We should get matching something.' },
    { role: 1, text: 'Matching what?' },
    { role: 0, text: "I don't know. Matching futures." },
  ] },
  { mood: 'romantic', speakers: 2, scene: '(at 3am, no particular reason)', lines: [
    { role: 0, text: 'Are you awake?' },
    { role: 1, text: 'I am now.' },
    { role: 0, text: 'I was just thinking that I like you. A lot. That is all.' },
    { role: 1, text: '...go to sleep.' },
    { role: 0, text: 'Say it back first.' },
  ] },
  { mood: 'romantic', speakers: 2, scene: '(raining)', lines: [
    { role: 0, text: "You're going to get soaked." },
    { role: 1, text: "You're already soaked." },
    { role: 0, text: 'Then what is one more minute?' },
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
  // angst — long-line
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: "You don't get to do that. You don't get to leave and then act like I'm the one who stopped calling. I wrote your name in my phone as 'home' for three years. And home moved." },
    { role: 1, text: "...I'm sorry." },
    { role: 0, text: "I'm not asking you to be sorry. I'm asking you to stay gone." },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: 'I look for you in every crowd.' },
    { role: 1, text: 'Stop.' },
    { role: 0, text: "I can't. I've tried." },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: "You asked if I'd do it all again. Knowing how it ends?" },
    { role: 1, text: 'Yes.' },
    { role: 0, text: 'In a heartbeat. That is the problem.' },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: "I don't blame you for leaving. I blame myself for making it easy. I gave you nothing to stay for and everything to leave with. That is on me, not you. But it still hurts." },
    { role: 1, text: 'It hurts me too.' },
    { role: 0, text: 'Then why did you make it so easy to leave?' },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: 'I kept your side of the bed.' },
    { role: 1, text: "That's not healthy." },
    { role: 0, text: 'Neither was leaving.' },
  ] },
  { mood: 'angst', speakers: 2, lines: [
    { role: 0, text: 'We could have been everything.' },
    { role: 1, text: 'We were almost everything.' },
    { role: 0, text: 'Almost is the worst kind of nothing.' },
  ] },
  { mood: 'angst', speakers: 2, scene: '(three years later)', lines: [
    { role: 0, text: 'I still think about it. The last thing you said.' },
    { role: 1, text: 'And what do you think now?' },
    { role: 0, text: 'That I should have said more. And you should have stayed.' },
  ] },
  { mood: 'angst', speakers: 2, scene: '(the morning after)', lines: [
    { role: 0, text: 'Do you regret it?' },
    { role: 1, text: 'I regret that it ended.' },
    { role: 0, text: 'That is not the same thing.' },
    { role: 1, text: 'It is the only thing.' },
  ] },
];

export const MOODS: QuoteMood[] = ['funny', 'romantic', 'angst'];

/** Total size of the hand-written template bank (for tests / docs). */
export const TEMPLATE_COUNT = TEMPLATES.length;

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
    ...(template.scene ? { scene: template.scene } : {}),
    lines: template.lines.map((line) => ({
      speaker: resolveSpeaker(line.role),
      text: line.text,
    })),
  };
}
