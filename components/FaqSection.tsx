import JsonLd from './JsonLd';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  return (
    <>
      <section className="mt-12 border-t border-stone-200/80 pt-10">
        <h2 className="text-xl font-semibold text-stone-800">
          Frequently Asked Questions
        </h2>
        <dl className="mt-6 divide-y divide-stone-200/60">
          {faqs.map((faq, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0">
              <dt className="text-[15px] font-semibold text-stone-900">
                {faq.question}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-stone-600">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
    </>
  );
}
