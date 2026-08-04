import type { Metadata } from 'next';
import {
  pickRandomNflTeams,
  teamFullName,
} from '@/lib/nfl-teams';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import NflTeamGeneratorDemo from './nfl-team-generator-demo';

export const metadata: Metadata = {
  title: 'Random NFL Team Generator - Fantasy & Pools',
  description:
    'Pick random NFL teams with one click. Filter by AFC or NFC, or by division, and get no-duplicate picks with team colors. Perfect for fantasy football, office pools, and Madden. Free, no sign-up.',
  alternates: {
    canonical: '/tools/random-nfl-team-generator',
  },
  openGraph: {
    title:
      'Random NFL Team Generator — Pick Teams for Fantasy & Pools | TextFixHub',
    description:
      'Pick random NFL teams with one click. Filter by AFC or NFC, or by division, and get no-duplicate picks with team colors. Perfect for fantasy football, office pools, and Madden. Free, no sign-up.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title:
      'Random NFL Team Generator — Pick Teams for Fantasy & Pools | TextFixHub',
    description:
      'Pick random NFL teams with one click. Filter by AFC or NFC, or by division, and get no-duplicate picks with team colors. Perfect for fantasy football, office pools, and Madden. Free, no sign-up.',
  },
};

const workedExampleTeams = pickRandomNflTeams({
  count: 3,
  conference: 'AFC',
  division: 'East',
  seed: 2026,
});

const NFL_FAQS = [
  {
    question: 'What is a random NFL team generator?',
    answer:
      'It picks NFL teams at random from all 32 teams — or from a filtered pool like just the AFC, or just the NFC North. Great when you need a fair, random team assignment and don’t want to pick by hand.',
  },
  {
    question: 'Can I filter by conference or division?',
    answer:
      'Yes. Choose All, AFC, or NFC for the conference, and All, East, North, South, or West for the division. The generator then picks randomly only from the teams that match both filters.',
  },
  {
    question: 'What is this tool used for?',
    answer:
      'Fantasy football draft order and random team assignments, office Super Bowl pools, Madden random team matchups, playoff bracket picks, and any situation where you need a fair random NFL team choice.',
  },
  {
    question: 'Can I get the same team twice?',
    answer:
      'No. Every pick is unique — if you pick 5 teams, you get 5 different teams. The count is capped at the size of your filtered pool.',
  },
  {
    question: 'Why color swatches instead of team logos?',
    answer:
      'NFL team logos are trademarked, so we render each team’s approximate brand color as a swatch instead. The full team name and division are shown alongside, so picks are still instantly recognizable.',
  },
  {
    question: 'Does this tool store anything?',
    answer:
      'No. Team selection happens locally in your browser. Nothing is uploaded, stored, or tracked — there’s no account and no data collection.',
  },
];

export default function RandomNflTeamGeneratorPage() {
  return (
    <ToolLayout pageName="Random NFL Team Generator">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">
          Random NFL Team Generator
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Pick random NFL teams — filtered by conference or division, with no
          duplicates. Perfect for fantasy drafts, office pools, and Madden.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">
            Try It Out
          </h2>
          <div className="mt-4">
            <NflTeamGeneratorDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            How It Works
          </h2>
          <p className="mt-2 text-stone-600">
            All 32 NFL teams are stored locally in your browser, grouped by
            conference (AFC / NFC) and division (East, North, South, West).
            When you hit Generate, the tool shuffles the matching pool and
            deals out the first N teams — each pick is guaranteed unique.
          </p>
          <p className="mt-3 text-stone-600">
            Official logos are trademarked, so teams are shown with their
            approximate brand colors instead. Every team card shows the full
            name plus its conference and division, so there’s no ambiguity.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            Use Cases
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-stone-600">
            <li>
              <strong>Fantasy football</strong> — randomize draft order or
              assign teams to league members.
            </li>
            <li>
              <strong>Office pools</strong> — hand out random teams for Super
              Bowl or playoff squares.
            </li>
            <li>
              <strong>Madden / gaming</strong> — pick a random team for your
              next franchise or quick play.
            </li>
            <li>
              <strong>Trivia &amp; games</strong> — a fair random team for any
              NFL-themed game night.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Example</h2>
          <div className="mt-4">
            <WorkedExample
              input="Random pick (AFC East)"
              output={workedExampleTeams.map(teamFullName).join(', ')}
              inputLabel="Filter"
              outputLabel="Picked Teams"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="random-nfl-team-generator" />
        <FaqSection faqs={NFL_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Random NFL Team Generator',
          description:
            'Pick random NFL teams filtered by conference or division, with no duplicates and team colors. Runs entirely in the browser.',
          url: 'https://www.textfixhub.com/tools/random-nfl-team-generator',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
