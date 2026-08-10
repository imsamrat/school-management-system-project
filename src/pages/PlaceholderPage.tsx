import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

export default function PlaceholderPage() {
  const location = useLocation();
  const pageName = location.pathname
    .split('/')
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' '))
    .join(' › ');

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-amber-500" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{pageName || 'Page'}</h2>
      <p className="text-sm text-gray-500 mt-1 max-w-sm text-center">
        This page is under construction and will be available in a future update.
      </p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => window.history.back()} className="btn-secondary">
          Go back
        </button>
        <a href="/" className="btn-primary">
          Dashboard
        </a>
      </div>
    </div>
  );
}
