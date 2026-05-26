import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream-100 dark:bg-ink-900 p-6">
          <div className="text-center max-w-md">
            <div className="mx-auto h-16 w-16 rounded-full bg-bronze-400/20 grid place-items-center mb-6">
              <span className="text-2xl">&#10024;</span>
            </div>
            <h1 className="font-display text-2xl text-ink-800 dark:text-cream-100">Something went wrong</h1>
            <p className="mt-3 text-ink-800/70 dark:text-cream-100/70">
              We hit a snag loading this page. Please refresh to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-800 px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-cream-100 transition-colors hover:bg-bronze-500 dark:bg-cream-100 dark:text-ink-900"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
