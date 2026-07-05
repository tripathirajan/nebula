import * as React from 'react';

interface BoundaryProps {
  children: React.ReactNode;
  /**
   * Rendered instead of `children` after an error is caught. Receives the
   * error and a `reset` function that re-attempts rendering `children`
   * (clears the caught error and re-renders — useful for a "Try again"
   * button; it does not fix whatever caused the error, so an error in a
   * `useEffect` that runs on every mount will just throw again).
   */
  fallback: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode);
  /** Called with the caught error (and React's componentStack) for logging/reporting. */
  onError?: (error: Error, info: { componentStack: string | null }) => void;
}

interface BoundaryState {
  error: Error | null;
}

/**
 * An error boundary — documented here as an "accessibility" primitive
 * alongside `FocusScope`/`DismissableLayer` because an uncaught render
 * error otherwise leaves the page silently blank or half-rendered, which is
 * as much a disaster for screen-reader/keyboard users as it is for anyone
 * else (there's often no visual cue anything went wrong at all). Catches
 * errors thrown during rendering in its subtree; does **not** catch errors
 * in event handlers, effects, or async code — handle those with a regular
 * `try`/`catch` and feed them to the same `onError` if you want unified
 * reporting.
 *
 * @example
 * ```tsx
 * <Boundary
 *   fallback={(error, reset) => (
 *     <Alert>
 *       Something went wrong: {error.message}
 *       <Button onClick={reset}>Try again</Button>
 *     </Alert>
 *   )}
 *   onError={(error, info) => reportError(error, info)}
 * >
 *   <Dashboard />
 * </Boundary>
 * ```
 */
class Boundary extends React.Component<BoundaryProps, BoundaryState> {
  static displayName = 'Boundary';

  override state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.props.onError?.(error, { componentStack: info.componentStack ?? null });
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  override render(): React.ReactNode {
    const { error } = this.state;
    if (error) {
      const { fallback } = this.props;
      return typeof fallback === 'function' ? fallback(error, this.reset) : fallback;
    }
    return this.props.children;
  }
}

export { Boundary };
export type { BoundaryProps };
