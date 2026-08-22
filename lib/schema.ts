/**
 * JSON-LD structured data objects, shared between pages and tests.
 *
 * Identity types (Organization, SoftwareApplication) live on the homepage;
 * individual tool pages keep their own WebApplication blocks.
 */
import { ALL_TOOLS } from './text/types';
import { SITE_EMAIL, SITE_URL } from './site-routes';

export const websiteJsonLd = {
  '@type': 'WebSite',
  name: 'TextFixHub',
  description:
    'Free online text tools to alphabetize lists, remove line breaks, count sentences, and generate random text. All processing happens locally in your browser.',
  url: SITE_URL,
};

export const organizationJsonLd = {
  '@type': 'Organization',
  name: 'TextFixHub',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  founder: {
    '@type': 'Person',
    name: 'Hakuun',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: SITE_EMAIL,
    availableLanguage: ['en'],
  },
};

export const softwareApplicationJsonLd = {
  '@type': 'SoftwareApplication',
  name: 'TextFixHub',
  url: SITE_URL,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  description:
    'Free online text tools to alphabetize lists, remove line breaks, count sentences, and generate random sentences and nouns. No sign-up required; all processing happens locally in your browser.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: ALL_TOOLS.map((tool) => tool.name),
  browserRequirements: 'Requires JavaScript.',
};

/** Homepage JSON-LD: identity graph with WebSite + Organization + SoftwareApplication. */
export const homepageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [websiteJsonLd, organizationJsonLd, softwareApplicationJsonLd],
};
