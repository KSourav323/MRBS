import React from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Something went wrong!</h2>
          <p>Redirecting to home page...</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;