import type { Metadata } from 'next';

const CAREER_START_YEAR = 2020;
const yearsOfExperience = new Date().getFullYear() - CAREER_START_YEAR;

export const metadata: Metadata = {
  title: 'About TextTools',
  description:
    'TextTools is built by Hakuun, a frontend developer. Simple, practical text tools that run locally in your browser.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-stone-900">About TextTools</h1>

      <div className="mt-8 space-y-6 leading-relaxed text-stone-600">
        <section>
          <h2 className="text-xl font-semibold text-stone-900">
            Hey, I&apos;m Hakuun
          </h2>
          <p className="mt-3">
            I&apos;m a frontend developer with {yearsOfExperience} years of
            experience building web applications. I created TextTools because I
            wanted a set of simple, well-designed text utilities that I could
            actually enjoy using — and I figured others might find them useful
            too.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-900">
            Why I Built This
          </h2>
          <p className="mt-3">
            I use text tools all the time — cleaning up formatting, counting
            words, generating placeholder content. Most of the existing options
            are either cluttered with aggressive ads, require sign-ups for
            basic features, or look like they were built in 2005 and never
            updated.
          </p>
          <p className="mt-3">
            My goal with TextTools is straightforward:{' '}
            <strong>
              build practical tools that are genuinely useful and pleasant to
              use
            </strong>
            . If enough people find them helpful, maybe the site can also
            generate a little income through unobtrusive advertising down the
            road. But the tools themselves will always be free to use — that
            part won&apos;t change.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-900">
            How It Works
          </h2>
          <p className="mt-3">
            Every tool runs entirely in your browser using client-side
            JavaScript. Your text never leaves your computer — nothing is
            uploaded to a server, stored in a database, or shared with anyone.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>
              <strong>Your data stays local</strong> — all processing happens
              on your device
            </li>
            <li>
              <strong>No sign-ups</strong> — just open a tool and start using
              it
            </li>
            <li>
              <strong>Works instantly</strong> — no server round-trips, no
              loading spinners
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-900">Get in Touch</h2>
          <p className="mt-3">
            Have a suggestion for a tool? Found something that could be better?
            I&apos;d genuinely love to hear from you.
          </p>
          <p className="mt-2">
            Email:{' '}
            <a
              href="mailto:kuangxiu0702@gmail.com"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              kuangxiu0702@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
