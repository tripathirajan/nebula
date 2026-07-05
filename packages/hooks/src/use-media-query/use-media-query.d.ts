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
declare function useMediaQuery(query: string): boolean;
export { useMediaQuery };
//# sourceMappingURL=use-media-query.d.ts.map