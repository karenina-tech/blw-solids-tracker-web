'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DatePickerProps {
  value: string;
  onChange: (iso: string) => void;
}

function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDisplay(iso: string, months: string[]) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${months[m - 1]} ${d}, ${y}`;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const { t } = useTranslation();
  const months = t('datePicker.months', { returnObjects: true }) as string[];
  const days = t('datePicker.days', { returnObjects: true }) as string[];

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate());

  const seed = value ? new Date(value + 'T00:00:00') : today;
  const [viewYear, setViewYear] = useState(seed.getFullYear());
  const [viewMonth, setViewMonth] = useState(seed.getMonth());

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const select = (iso: string) => {
    onChange(iso);
    setOpen(false);
  };

  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    select(todayIso);
  };

  const startOffset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={[
          'w-full flex items-center justify-between border rounded-lg px-4 py-2.5 text-sm transition-colors bg-white',
          open
            ? 'border-accent-500 ring-1 ring-accent-500'
            : 'border-slate-300 hover:border-slate-400',
        ].join(' ')}
      >
        <span className={value ? 'text-slate-700' : 'text-slate-400'}>
          {value ? formatDisplay(value, months) : t('datePicker.placeholder')}
        </span>
        <svg
          className={`w-4 h-4 transition-colors ${open ? 'text-accent-500' : 'text-slate-400'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 bottom-full mb-1.5 right-0 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-3 select-none">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors text-base leading-none"
            >
              ‹
            </button>
            <span className="text-xs font-semibold text-slate-800 tracking-wide">
              {months[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors text-base leading-none"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 mb-0.5">
            {days.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-slate-400 tracking-wider py-0.5">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const iso = toIso(viewYear, viewMonth, day);
              const isSelected = iso === value;
              const isToday = iso === todayIso;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(iso)}
                  className={[
                    'mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors',
                    isSelected
                      ? 'bg-seed-600 text-white font-semibold shadow-sm'
                      : isToday
                      ? 'border-2 border-accent-300 text-accent-600 font-semibold hover:bg-background'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  ].join(' ')}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              {t('datePicker.clear')}
            </button>
            <button
              type="button"
              onClick={goToday}
              className="text-xs font-semibold text-accent-600 hover:text-accent-500 transition-colors"
            >
              {t('datePicker.today')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
