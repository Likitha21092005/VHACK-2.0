import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import Dashboard from './pages/Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Error boundary wrapper
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial', color: '#333' }}>
          <h1>⚠️ Application Error</h1>
          <p style={{ color: '#d32f2f', fontSize: '16px' }}>
            {this.state.error?.message}
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Check browser console (F12) for details
          </p>
        </div>
      );
    }
    
    return this.props.children;
  }
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  </React.StrictMode>
);
