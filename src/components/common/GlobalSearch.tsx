import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { useLazyGlobalSearchQuery } from '@/features/search/searchApi';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [triggerSearch, { data: searchRes, isFetching }] = useLazyGlobalSearchQuery();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        triggerSearch(query);
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, 300); // Debounce
    return () => clearTimeout(timer);
  }, [query, triggerSearch]);

  const results = searchRes?.data || [];

  const handleSelect = (link: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(link);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
          placeholder="Search students, teachers, books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length > 1) setIsOpen(true);
          }}
        />
        {isFetching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && query.trim().length > 1 && (
        <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {results.length === 0 && !isFetching ? (
            <div className="p-4 text-sm text-gray-500 text-center">No results found for "{query}"</div>
          ) : (
            <ul className="py-2">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleSelect(item.link)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex flex-col transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{item.title}</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5">{item.subtitle}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
