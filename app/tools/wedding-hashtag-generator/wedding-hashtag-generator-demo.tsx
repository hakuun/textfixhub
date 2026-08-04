'use client';

import { useState, useCallback } from 'react';
import { Check, Copy } from '@phosphor-icons/react/dist/ssr';
import { generateWeddingHashtags, type HashtagGroup } from '@/lib/text/wedding-hashtags';
import TextInput from '@/components/TextInput';

export default function WeddingHashtagGeneratorDemo() {
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [year, setYear] = useState('');
  const [groups, setGroups] = useState<HashtagGroup[]>([]);
  const [copiedTag, setCopiedTag] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<number | null>(null);

  const canGenerate =
    partner1.trim().length > 0 && partner2.trim().length > 0;

  const handleGenerate = useCallback(() => {
    setGroups(generateWeddingHashtags({ partner1, partner2, year }));
    setCopiedTag(null);
    setCopiedAll(null);
  }, [partner1, partner2, year]);

  const handleCopyTag = useCallback((text: string, index: number) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedTag(index);
        setTimeout(() => setCopiedTag(null), 1500);
      })
      .catch(() => {});
  }, []);

  const handleCopyGroup = useCallback((hashtags: string[], index: number) => {
    navigator.clipboard
      .writeText(hashtags.join(' '))
      .then(() => {
        setCopiedAll(index);
        setTimeout(() => setCopiedAll(null), 2000);
      })
      .catch(() => {});
  }, []);

  const totalTags = groups.reduce((n, g) => n + g.hashtags.length, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Partner 1"
          placeholder="e.g. Emma Smith"
          value={partner1}
          onChange={setPartner1}
          rows={2}
        />
        <TextInput
          label="Partner 2"
          placeholder="e.g. Liam Jones"
          value={partner2}
          onChange={setPartner2}
          rows={2}
        />
      </div>
      <TextInput
        label="Wedding Year (optional)"
        placeholder="e.g. 2026"
        value={year}
        onChange={setYear}
        rows={1}
      />

      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-emerald-700 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Generate Hashtags
      </button>

      {groups.length === 0 ? (
        <div className="card-surface flex items-center justify-center px-6 py-10">
          <p className="text-center text-sm text-stone-500">
            Enter both partners&apos; names (include last names for the best
            results) and click Generate. Click any hashtag to copy it.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm font-semibold text-stone-700">
            {totalTags} hashtag {totalTags === 1 ? 'idea' : 'ideas'} — click to
            copy
          </p>
          {groups.map((group, gi) => (
            <div key={group.category} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-stone-800">
                  {group.category}
                </h3>
                <button
                  onClick={() => handleCopyGroup(group.hashtags, gi)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-all duration-200 ease-out hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96]"
                >
                  {copiedAll === gi ? (
                    <>
                      <Check className="h-3.5 w-3.5" weight="bold" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy All
                    </>
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.hashtags.map((tag, ti) => {
                  const key = `${gi}-${ti}`;
                  return (
                    <button
                      key={key}
                      onClick={() => handleCopyTag(tag, gi * 100 + ti)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3.5 py-1.5 text-sm font-medium text-stone-800 transition-all duration-200 ease-out hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96]"
                      title="Click to copy"
                    >
                      {tag}
                      {copiedTag === gi * 100 + ti ? (
                        <Check className="h-3 w-3 text-emerald-600" weight="bold" />
                      ) : (
                        <Copy className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
