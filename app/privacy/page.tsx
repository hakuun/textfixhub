import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'TextFixHub privacy policy: how we handle your data, cookies, and third-party services.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-stone-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-stone-400">
        Effective as of July 29, 2026
      </p>

      <div className="mt-8 space-y-6 leading-relaxed text-stone-600">
        <section>
          <p>
            As the owner of this website, I understand that your privacy is
            important. This Privacy Policy describes what information we
            collect from you via the Site and how we use and disclose such
            information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-900">
            Information We Collect
          </h2>
          <p className="mt-3">
            <strong>
              We do not collect any personal information that you type or paste
              into our tools.
            </strong>{' '}
            All text processing happens locally in your browser using
            client-side JavaScript. Your content is never uploaded to a server,
            stored in a database, or shared with third parties. We simply have
            no way to see it.
          </p>
          <p className="mt-3">
            Like most websites, our hosting provider (Vercel) may collect
            standard server-side access logs, including IP addresses, browser
            type, referring pages, and timestamps. These are used for
            operational purposes such as diagnosing technical issues and
            preventing abuse.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-900">
            Our Use of Cookies
          </h2>
          <p className="mt-3">
            A cookie is a file containing an identifier that is sent by a web
            server to a web browser and stored by the browser. Cookies may be
            either &quot;persistent&quot; cookies (remain until their expiry
            date) or &quot;session&quot; cookies (expire when you close your
            browser).
          </p>
          <p className="mt-3">
            Currently, TextFixHub does not set any cookies of its own. However,
            we may introduce cookies in the future for the following purposes:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Analytics</strong> — to help us understand how the site
              is used and improve it
            </li>
            <li>
              <strong>Advertising</strong> — to display relevant
              advertisements and measure their performance
            </li>
            <li>
              <strong>Preferences</strong> — to remember your settings (such
              as dark mode, if added)
            </li>
          </ul>
          <p className="mt-3">
            Most browsers allow you to refuse or delete cookies. Blocking
            cookies may affect the functionality of some features on the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-900">
            Third-Party Services
          </h2>
          <p className="mt-3">
            We may use third-party services to operate and improve the Site:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Hosting</strong> — the Site is hosted on Vercel.{' '}
              <a
                href="https://vercel.com/legal/privacy-policy"
                className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel&apos;s privacy policy
              </a>{' '}
              governs how they handle server logs.
            </li>
            <li>
              <strong>Analytics</strong> — we may use Google Analytics or a
              similar service to understand how visitors use the Site. These
              services use cookies to collect anonymous usage data.
            </li>
            <li>
              <strong>Advertising</strong> — we may display advertisements
              through networks such as Google AdSense. These ad networks may
              use cookies to show relevant ads based on your browsing history.
            </li>
          </ul>
          <p className="mt-3">
            When third-party services are added, this policy will be updated
            with specific details and links to their respective privacy
            policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-900">
            Children&apos;s Privacy
          </h2>
          <p className="mt-3">
            Our Site is not directed to children under the age of 13. We do
            not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-900">
            Changes to This Privacy Policy
          </h2>
          <p className="mt-3">
            We may update this Privacy Policy from time to time. The most
            recent version will always be posted on this page, with the
            &quot;Effective Date&quot; at the top. We may revise this policy
            as our practices change, as we add new services, or as technology
            changes. By continuing to use the Site after the Effective Date,
            you agree to the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-900">Contact</h2>
          <p className="mt-3">
            If you have any questions about this Privacy Policy, please
            contact us at:{' '}
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
