/**
 * Returns a ref-backed `() => boolean` you can call after an async operation
 * resolves to check the component is still mounted before calling
 * `setState` — avoids the classic "state update on an unmounted component"
 * warning without needing a cleanup flag re-declared in every effect.
 *
 * @returns A stable function returning `true` while the component is mounted.
 *
 * @example
 * ```tsx
 * function UserProfile({ id }: { id: string }) {
 *   const isMounted = useMounted();
 *   const [user, setUser] = useState<User | null>(null);
 *
 *   useEffect(() => {
 *     fetchUser(id).then((data) => {
 *       if (isMounted()) setUser(data);
 *     });
 *   }, [id, isMounted]);
 *
 *   return user ? <span>{user.name}</span> : null;
 * }
 * ```
 */
declare function useMounted(): () => boolean;
export { useMounted };
//# sourceMappingURL=use-mounted.d.ts.map