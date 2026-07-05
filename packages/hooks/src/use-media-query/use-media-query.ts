import { useEffect, useState } from 'react';

/**
 * Tracks whether `query` (a CSS media query string, e.g. `'(min-width: 768px)'`)
 * currently matches. Returns `false` on the server and during the first
 * client render before hydration reconciles — pair with `useMounted`/a
 * `suppressHydrationWarning` if a mismatch flash matters for your case.
 *
 * @param query - Any valid media query, e.g. `'(min-width: 768px)'` or `'(prefers-color-scheme: dark)'`.
 * @returns Whether `query` currently matches.
 *
 * @example
 * ```tsx
 * function ResponsiveNav() {
 *   const isDesktop = useMediaQuery('(min-width: 1024px)');
 *   return isDesktop ? <DesktopNav /> : <MobileNav />;
 * }
 * ```
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQueryList.matches);

    // addEventListener on MediaQueryList is broadly supported now, but fall
    // back to the deprecated addListener API for older WebKit/Safari.
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    }
    mediaQueryList.addListener(onChange);
    return () => mediaQueryList.removeListener(onChange);
  }, [query]);

  return matches;
}

export { useMediaQuery };
