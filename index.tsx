import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RefreshCw } from 'lucide-react';

// Barrière de sécurité globale pour capturer les crashs (ex: Storage Access Denied)
class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("CRITICAL APP ERROR:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">!</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Une erreur inattendue est survenue</h1>
            <p className="text-gray-500 text-sm mb-6">
              Votre navigateur ou vos paramètres de confidentialité bloquent peut-être une fonctionnalité essentielle (Cookies/Stockage Local).
            </p>
            <div className="bg-gray-50 p-3 rounded-lg text-xs text-left font-mono text-gray-600 mb-6 overflow-auto max-h-32 border border-gray-200">
                {this.state.error?.message || "Erreur inconnue"}
            </div>
            <button
              onClick={() => {
                // Nettoyage radical avant reload
                try { window.localStorage.clear(); } catch(e){}
                window.location.reload();
              }}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
            >
              <RefreshCw size={18} /> Recharger l'application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
);