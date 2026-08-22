/**
 * Edge middleware: content negotiation + agent-friendly responses.
 *
 * - Requests whose Accept header prefers text/markdown get the page's
 *   Markdown twin (a static file generated into public/ at build time),
 *   served as text/markdown with Vary: Accept.
 * - Markdown requests to unknown extensionless paths get a real HTTP 404
 *   with a short markdown body pointing agents at the sitemap and llms.txt.
 * - HTML responses for known pages carry Vary: Accept plus a Link header
 *   advertising the Markdown twin and llms.txt (llmstxt.org v2 link relations).
 *
 * Browsers are unaffected: they never send Accept: text/markdown, so their
 * requests pass through untouched apart from the Vary/Link headers.
 */
import { NextRequest, NextResponse } from 'next/server';
import { negotiate } from '@/lib/negotiate';
import { PAGE_PATHS, absoluteUrl, markdownPathFor } from '@/lib/site-routes';
import { notFoundMarkdown } from '@/lib/markdown';

const MD_CONTENT_TYPE = 'text/markdown; charset=utf-8';

function isFileLike(pathname: string): boolean {
  const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
  return /\.\w+$/.test(lastSegment);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Never touch internal routes or anything that looks like a file
  // (*.md, *.txt, *.xml, assets — including this feature's own .md twins).
  if (pathname.startsWith('/_next') || isFileLike(pathname)) {
    return NextResponse.next();
  }

  // Let Next's trailingSlash:false redirect canonicalize "/about/" → "/about"
  // before we make any negotiation decision.
  const bare = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (bare !== pathname) {
    return NextResponse.next();
  }

  const knownPage = PAGE_PATHS.includes(bare);
  const wantsMarkdown = negotiate(req.headers.get('accept')) === 'markdown';

  if (wantsMarkdown) {
    if (knownPage) {
      const res = NextResponse.rewrite(new URL(markdownPathFor(bare), req.url));
      res.headers.set('Content-Type', MD_CONTENT_TYPE);
      res.headers.set('Vary', 'Accept, Accept-Encoding');
      return res;
    }
    return new Response(notFoundMarkdown(pathname), {
      status: 404,
      headers: {
        'Content-Type': MD_CONTENT_TYPE,
        Vary: 'Accept, Accept-Encoding',
      },
    });
  }

  const res = NextResponse.next();
  if (knownPage) {
    res.headers.set('Vary', 'Accept');
    res.headers.set(
      'Link',
      `<${absoluteUrl(markdownPathFor(bare))}>; rel="alternate"; type="text/markdown", <${absoluteUrl('/llms.txt')}>; rel="describedby"`,
    );
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.svg).*)'],
};
