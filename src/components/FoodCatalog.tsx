import { Fragment, useState, useMemo } from 'react';
import { FOOD_DATASET } from '../data/foodDataset';
import { Tooltip } from './Tooltip';

type CategoryFilter = 'All' | 'Standard' | 'Allergen';

function dietMeta(dietaryType?: string): { emoji: string; label: string } {
  if (dietaryType === 'standard') return { emoji: '🥩', label: 'Meat or fish' };
  if (dietaryType === 'vegetarian') return { emoji: '🥚', label: 'Animal product' };
  return { emoji: '🌱', label: 'Plant-based' };
}



const PAGE_SIZE = 15;

export function FoodCatalog() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CategoryFilter>('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const sorted = useMemo(
    () => [...FOOD_DATASET].sort((a, b) => a.name.localeCompare(b.name)),
    []
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
  const pageItems = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (value: string) => { setSearch(value); setPage(1); setExpanded(null); };
  const handleFilter = (cat: CategoryFilter) => { setFilter(cat); setPage(1); setExpanded(null); };
  const goToPage = (n: number) => { setPage(n); setExpanded(null); };

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Foods in the dataset</h2>
        <p className="text-slate-500 text-sm">
          Browse what's already covered before suggesting something new. Tap a row to see prep details.
        </p>
      </div>

      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search foods…"
          className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-100"
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        {(['All', 'Standard', 'Allergen'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleFilter(cat)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              filter === cat
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400">
          {visible.length} food{visible.length !== 1 ? 's' : ''}{totalPages > 1 ? ` · page ${page} of ${totalPages}` : ''}
        </span>
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <div className="text-3xl mb-2">🥦</div>
          <p className="text-sm">No foods match your search.</p>
        </div>
      ) : (
        <>
        <div className="rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide rounded-tl-xl">
                  Food
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Category
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Type
                </th>
                <th className="w-10 px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide rounded-tr-xl">
                  <div className="relative group inline-flex justify-center">
                    <span>⚠️</span>
                    <Tooltip text="Choking hazard" width="w-32" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((food) => {
                const isExpanded = expanded === food.id;
                const isAllergen = food.category === 'Allergen';
                const diet = dietMeta(food.dietaryType);

                return (
                  <Fragment key={food.id}>
                    <tr
                      onClick={() => toggle(food.id)}
                      className={`cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50 ${isExpanded ? 'bg-slate-50' : ''}`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">{food.name}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          isAllergen
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {food.category}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="relative group inline-flex justify-center items-center">
                          <span className="text-base leading-none cursor-default">{diet.emoji}</span>
                          <Tooltip text={diet.label} noWrap />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {food.chokingHazardWarning ? (
                          <div className="relative group inline-flex justify-center items-center">
                            <span className="text-base leading-none cursor-default">⚠️</span>
                            <Tooltip text={food.chokingHazardWarning} width="w-52" />
                          </div>
                        ) : null}
                      </td>
                    </tr>
                    {isExpanded && (
                    <tr className="bg-slate-50">
                      <td colSpan={4} className="px-4 pb-4 pt-0">
                        <div className="space-y-3 pt-3 border-t border-slate-100 mt-1">
                          {Object.entries(food.preparationByAge).map(([range, instruction]) => (
                            <div key={range}>
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                {range} months
                              </span>
                              <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{instruction}</p>
                            </div>
                          ))}
                          {food.chokingHazardWarning && (
                            <div className="flex items-start gap-2 bg-yellow-50 rounded-lg px-3 py-2">
                              <span className="text-xs shrink-0 mt-0.5">⚠️</span>
                              <p className="text-xs text-yellow-700 leading-relaxed">{food.chokingHazardWarning}</p>
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
          <div className="flex items-center justify-center gap-1.5 pt-4">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => goToPage(n)}
                className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                  n === page
                    ? 'bg-emerald-500 text-white'
                    : 'border border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              →
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
