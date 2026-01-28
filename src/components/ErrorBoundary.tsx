import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? (
                <div className="min-h-screen bg-luminaq-bg flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-serif text-white mb-4">Something went wrong</h1>
                        <p className="text-luminaq-muted mb-6">Please refresh the page to try again.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-luminaq-accent text-white rounded-full hover:bg-luminaq-accentHover transition-colors"
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
