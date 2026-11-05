'use client';

import { Fragment, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Broccoli, ChevronDown, ChevronLeft, ChevronRight, Search, TriangleAlert } from 'lucide-react';
import { DietIcon } from '@/components/DietIcon';
import { getLocalizedFoodDataset } from '@/data/getLocalizedFoodDataset';
import { Tooltip } from '@/components/Tooltip';

type CategoryFilter = 'All' | 'Standard' | 'Allergen';

const PAGE_SIZE = 10;

export function FoodCatalog() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CategoryFilter>('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const sorted = useMemo(
    () => [...getLocalizedFoodDataset(i18n.language)].sort((a, b) => a.name.localeCompare(b.name)),
    [i18n.language]
  );

  const visible = useMemo(
    () =>
      sorted.filter((f) => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || f.category === filter;
        return matchesSearch && matchesFilter;
      }),
    [sorted, search, filter]
  );

  const totalPages = Math.ceil(visible.length / PAGE_SIZE);
  // On phones only three page numbers are shown (the current one and its neighbours); tablets and up show all.
  const windowStart = Math.min(Math.max(1, page - 1), Math.max(1, totalPages - 2));
  const inPhoneWindow = (n: number) => n >= windowStart && n <= windowStart + 2;
  const pageItems = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (value: string) => { setSearch(value); setPage(1); setExpanded(null); };
  const handleFilter = (cat: CategoryFilter) => { setFilter(cat); setPage(1); setExpanded(null); };
  const goToPage = (n: number) => { setPage(n); setExpanded(null); };
  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800 mb-1">{t('catalog.title')}</h2>
        <p className="text-slate-500 text-base">{t('catalog.subtitle')}</p>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t('catalog.searchPlaceholder')}
          className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-base text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-100"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {/* Same look as the language buttons */}
        <div data-sheet className="sheet-gradient inline-flex gap-1 rounded-md p-1">
          {(['All', 'Standard', 'Allergen'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleFilter(cat)}
              aria-pressed={filter === cat}
              className={`rounded px-3.5 py-1.5 text-base font-semibold transition-colors duration-200 ${
                filter === cat ? 'bg-seed-600 text-white' : 'text-slate-600 hover:bg-seed-600/10 hover:text-seed-700'
              }`}
            >
              {cat === 'All' ? t('catalog.filters.all') : t(`contribute.form.categoryOptions.${cat}`)}
            </button>
          ))}
        </div>
        <span className="ml-auto text-base text-slate-400">
          {t('catalog.count', { count: visible.length })}
          {totalPages > 1 ? ` · ${t('catalog.page', { current: page, total: totalPages })}` : ''}
        </span>
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Broccoli className="mx-auto mb-3 h-10 w-10 text-accent-300" aria-hidden />
          <p className="text-base">{t('catalog.noResults')}</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-slate-200">
            <table className="w-full table-fixed text-base">
              {/* Fixed layout: column widths never depend on the foods on the page, so nothing moves between pages. */}
              <colgroup>
                <col className="md:w-[34%]" />
                <col className="w-28 md:w-[24%]" />
                <col className="hidden md:table-column md:w-[16%]" />
                <col className="w-10 md:w-[14%]" />
                <col className="w-10 md:w-[12%]" />
              </colgroup>
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-3 py-2.5 text-left md:px-4 text-base font-semibold text-slate-400 uppercase tracking-wide rounded-tl-xl">
                    {t('catalog.columns.food')}
                  </th>
                  <th className="px-1.5 py-2.5 text-center text-base font-semibold text-slate-400 uppercase md:px-3 md:tracking-wide">
                    {t('catalog.columns.category')}
                  </th>
                  <th className="hidden px-3 py-2.5 text-center text-base font-semibold text-slate-400 uppercase tracking-wide md:table-cell">
                    {t('catalog.columns.type')}
                  </th>
                  <th className="px-1.5 py-2.5 text-center md:px-3">
                    <div className="relative group inline-flex justify-center">
                      <TriangleAlert className="h-5 w-5 text-amber-500" aria-hidden />
                      <Tooltip text={t('catalog.columns.hazard')} width="w-48" />
                    </div>
                  </th>
                  <th className="px-1.5 py-2.5 rounded-tr-xl md:px-3" aria-hidden="true" />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((food) => {
                  const isExpanded = expanded === food.id;
                  const isAllergen = food.category === 'Allergen';
                  const dietLabel = t(`catalog.dietType.${food.dietaryType ?? 'vegan'}`);

                  return (
                    <Fragment key={food.id}>
                      <tr
                        onClick={() => toggle(food.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggle(food.id);
                          }
                        }}
                        tabIndex={0}
                        aria-expanded={isExpanded}
                        className={`cursor-pointer border-b border-slate-100 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-500 ${
                          isExpanded ? 'bg-accent-100/25' : 'hover:bg-accent-100/20'
                        }`}
                      >
                        <td className="px-3 py-3 font-medium text-slate-800 md:px-4">
                          <span className="flex items-center gap-2">
                            <span className="md:hidden">
                              <DietIcon type={food.dietaryType} className="h-5 w-5 shrink-0 text-accent-600" />
                            </span>
                            {food.name}
                          </span>
                        </td>
                        <td className="px-1.5 py-3 text-center md:px-3">
                          <span className={`inline-block text-base font-semibold px-2.5 py-0.5 rounded-full ${
                            isAllergen
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-accent-50 text-accent-600'
                          }`}>
                            {t(`contribute.form.categoryOptions.${food.category}`)}
                          </span>
                        </td>
                        <td className="hidden px-3 py-3 text-center md:table-cell">
                          <div className="relative group inline-flex justify-center items-center">
                            <span className="cursor-default"><DietIcon type={food.dietaryType} /></span>
                            <Tooltip text={dietLabel} noWrap />
                          </div>
                        </td>
                        <td className="px-1.5 py-3 text-center md:px-3">
                          {food.chokingHazardWarning ? (
                            <div className="relative group inline-flex justify-center items-center">
                              <span className="cursor-default"><TriangleAlert className="h-5 w-5 text-amber-500" aria-hidden /></span>
                              <Tooltip text={food.chokingHazardWarning} width="w-80" />
                            </div>
                          ) : null}
                        </td>
                        <td className="px-1.5 py-3 text-center md:px-3">
                          <ChevronDown
                            className={`mx-auto h-5 w-5 text-accent-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            aria-hidden
                          />
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-accent-100/25 border-b border-slate-200">
                          <td colSpan={5} className="px-4 pb-4 pt-0">
                            <div className="space-y-3 pt-3 border-t border-accent-300 mt-1">
                              {Object.entries(food.preparationByAge).map(([range, instruction]) => (
                                <div key={range}>
                                  <span className="text-base font-semibold text-slate-400 uppercase tracking-wider">
                                    {t('catalog.months', { range })}
                                  </span>
                                  <p className="text-base text-slate-600 mt-0.5 leading-relaxed">{instruction as string}</p>
                                </div>
                              ))}
                              {food.chokingHazardWarning && (
                                <div className="flex items-start gap-2 bg-yellow-50 rounded-lg px-3 py-2">
                                  <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
                                  <p className="text-base text-yellow-700 leading-relaxed">{food.chokingHazardWarning}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 md:gap-1.5">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                aria-label={t('common.back')}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:border-seed-400 hover:bg-seed-600/10 hover:text-seed-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors md:h-9 md:w-9"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => goToPage(n)}
                  aria-current={n === page ? 'page' : undefined}
                  className={`h-11 w-11 items-center justify-center text-base font-medium rounded-lg transition-colors md:h-9 md:w-9 ${
                    inPhoneWindow(n) ? 'flex' : 'hidden md:flex'
                  } ${
                    n === page
                      ? 'bg-seed-600 text-white'
                      : 'border border-slate-300 text-slate-600 hover:border-seed-400 hover:bg-seed-600/10 hover:text-seed-700'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                aria-label={t('common.next')}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:border-seed-400 hover:bg-seed-600/10 hover:text-seed-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors md:h-9 md:w-9"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
