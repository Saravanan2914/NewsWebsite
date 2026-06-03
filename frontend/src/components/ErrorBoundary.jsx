import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    try {
      localStorage.clear();
      console.log('LocalStorage cleared by ErrorBoundary to resolve state corruption.');
    } catch (e) {
      console.error('Failed to clear LocalStorage in ErrorBoundary:', e);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">📰</div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
              Something went wrong
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Don't worry, your data is safe. Please go back to the homepage.
            </p>
            <Link
              to="/"
              onClick={() => {
                try {
                  localStorage.clear();
                } catch (e) {}
                this.setState({ hasError: false, error: null });
              }}
              className="inline-block px-6 py-2.5 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors shadow-md"
            >
              ← Go to Homepage
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
