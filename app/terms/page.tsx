import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms of use for TextTools — free online text utilities.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Terms of Use</h1>

      <div className="mt-8 space-y-6 leading-relaxed text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            General Disclaimer
          </h2>
          <p className="mt-3">
            The tools on this Site are provided on an &quot;AS IS&quot; and
            &quot;AS AVAILABLE&quot; basis. TextTools makes no
            representations or warranties of any kind, express or implied,
            regarding the accuracy, reliability, availability, or
            suitability of the tools for any particular purpose. Your use of
            the Site and its tools is at your own risk.
          </p>
          <p className="mt-3">
            All text processing happens locally in your browser. TextTools
            does not see, store, or have access to any content you type or
            paste into the tools. You are solely responsible for the content
            you process and for ensuring you have the right to use it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Limitation of Liability
          </h2>
          <p className="mt-3">
            IN NO EVENT SHALL TEXTOOLS OR ITS OWNER BE LIABLE FOR ANY
            SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES THAT ARE DIRECTLY
            OR INDIRECTLY RELATED TO THE USE OF, OR THE INABILITY TO USE,
            THE SITE OR ITS TOOLS, EVEN IF TEXTOOLS OR AN AUTHORIZED
            REPRESENTATIVE THEREOF HAS BEEN ADVISED OF THE POSSIBILITY OF
            SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OR
            EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES,
            SO SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.
          </p>
          <p className="mt-3">
            IN NO EVENT SHALL THE TOTAL LIABILITY OF TEXTOOLS TO YOU FOR
            ALL DAMAGES, LOSSES, AND CAUSES OF ACTION (WHETHER IN CONTRACT
            OR TORT, INCLUDING, BUT NOT LIMITED TO, NEGLIGENCE OR OTHERWISE)
            ARISING FROM YOUR USE OF THE SITE EXCEED, IN THE AGGREGATE,
            $100.00.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Prohibited Uses
          </h2>
          <p className="mt-3">
            You agree not to use the Site in any way that:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Violates any applicable laws or regulations
            </li>
            <li>
              Attempts to overload, disrupt, or compromise the Site or its
              hosting infrastructure
            </li>
            <li>
              Uses automated scripts, bots, or scraping tools to
              systematically access or extract content from the Site
            </li>
            <li>
              Processes content that is unlawful, harmful, or infringing on
              the rights of others
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Intellectual Property
          </h2>
          <p className="mt-3">
            The TextTools name and the code that powers the Site are the
            property of the Site owner. The tools are provided freely for
            public use. Any text you process through the tools remains
            entirely yours — we never see, collect, or claim any ownership
            of your content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Changes to These Terms
          </h2>
          <p className="mt-3">
            We reserve the right to revise and update these Terms of Use at
            any time. Any such revisions will be effective on the date of
            posting to the Site. You should periodically visit this page to
            review the current terms to which you are bound. Your continued
            use of the Site following the posting of changes means you
            accept those changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Your Acceptance of These Terms
          </h2>
          <p className="mt-3">
            By using this Site, you signify your acceptance of these Terms
            of Use and our{' '}
            <a
              href="/privacy"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Privacy Policy
            </a>
            . If you do not agree to these terms, please do not use the
            Site.
          </p>
        </section>
      </div>
    </div>
  );
}
