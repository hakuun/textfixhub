import { describe, expect, it } from 'vitest';
import {
  homepageJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
} from './schema';
import { SITE_EMAIL, SITE_URL } from './site-routes';
import { ALL_TOOLS } from './text/types';

describe('homepageJsonLd identity graph', () => {
  it('carries WebSite, Organization, and SoftwareApplication in one @graph', () => {
    expect(homepageJsonLd['@context']).toBe('https://schema.org');
    const types = homepageJsonLd['@graph'].map(
      (node) => (node as { '@type': string })['@type'],
    );
    expect(types).toEqual(['WebSite', 'Organization', 'SoftwareApplication']);
  });
});

describe('organizationJsonLd', () => {
  it('has identity fields and a contactPoint with email + contactType', () => {
    expect(organizationJsonLd.name).toBe('TextFixHub');
    expect(organizationJsonLd.url).toBe(SITE_URL);
    expect(organizationJsonLd.contactPoint['@type']).toBe('ContactPoint');
    expect(organizationJsonLd.contactPoint.email).toBe(SITE_EMAIL);
    expect(organizationJsonLd.contactPoint.contactType).toBe(
      'customer support',
    );
  });

  it('deliberately omits PostalAddress (no public address exists)', () => {
    expect(organizationJsonLd).not.toHaveProperty('address');
  });
});

describe('softwareApplicationJsonLd', () => {
  it('describes the suite with offer price and feature list', () => {
    expect(softwareApplicationJsonLd.name).toBe('TextFixHub');
    expect(softwareApplicationJsonLd.applicationCategory).toBe(
      'UtilitiesApplication',
    );
    expect(softwareApplicationJsonLd.offers.price).toBe('0');
    expect(softwareApplicationJsonLd.offers.priceCurrency).toBe('USD');
    expect(softwareApplicationJsonLd.featureList).toHaveLength(
      ALL_TOOLS.length,
    );
  });
});
