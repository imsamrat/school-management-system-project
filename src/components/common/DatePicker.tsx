import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  date: Date;
  onChange: (date: Date) => void;
  className?: string;
  maxDate?: Date;
}

export function DatePicker({ date, onChange, className, maxDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(date || new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleSelect = (day: Date) => {
    if (maxDate && day > maxDate) return;
    onChange(day);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 shadow-sm rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
      >
        <span className={date ? 'text-gray-900' : 'text-gray-500'}>
          {date ? format(date, 'MMM d, yyyy') : 'Pick a date'}
        </span>
        <CalendarIcon className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={previousMonth}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <h2 className="font-semibold text-gray-900 text-sm">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-xs font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for padding */}
            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day, dayIdx) => {
              const isDisabled = maxDate ? day > maxDate : false;
              return (
                <button
                  key={day.toString()}
                  onClick={() => handleSelect(day)}
                  disabled={isDisabled}
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors',
                    !isSameMonth(day, currentMonth) && 'text-gray-300',
                    isSameDay(day, date) && 'bg-primary-600 text-white font-semibold',
                    !isSameDay(day, date) && !isDisabled && 'hover:bg-gray-100 text-gray-700',
                    isDisabled && 'opacity-50 cursor-not-allowed text-gray-400',
                    isToday(day) && !isSameDay(day, date) && 'border border-primary-300 text-primary-700'
                  )}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
