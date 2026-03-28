'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';

import { ArrowDownUp, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import SwitchCardGrid from '@/components/switch/SwitchCardGrid';
import SwitchCardSettingsModal from '@/components/switch/SwitchCardSettingsModal';
import SwitchFilter from '@/components/switch/SwitchFilter';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { useSearchSwitches } from '@/lib/api/queries/useSwitches';
import { cn, MANUFACTURERS } from '@/lib/utils';
import type {
  MountPins,
  SortBy,
  SortDirection,
  SwitchFilters,
  SwitchType,
} from '@/types/switch';

const parseFiltersFromParams = (
  searchParams: URLSearchParams,
): SwitchFilters => ({
  query: searchParams.get('q') || undefined,
  type: (searchParams.get('type') as SwitchType) || undefined,
  manufacturer: searchParams.get('manufacturer') || undefined,
  mountPins: searchParams.get('mountPins')
    ? (Number(searchParams.get('mountPins')) as MountPins)
    : undefined,
  silent:
    searchParams.get('silent') !== null
      ? searchParams.get('silent') === 'true'
      : undefined,
  factoryLubed:
    searchParams.get('factoryLubed') !== null
      ? searchParams.get('factoryLubed') === 'true'
      : undefined,
  actuationMin: searchParams.get('actuationMin')
    ? Number(searchParams.get('actuationMin'))
    : undefined,
  actuationMax: searchParams.get('actuationMax')
    ? Number(searchParams.get('actuationMax'))
    : undefined,
  initialMin: searchParams.get('initialMin')
    ? Number(searchParams.get('initialMin'))
    : undefined,
  initialMax: searchParams.get('initialMax')
    ? Number(searchParams.get('initialMax'))
    : undefined,
  bottomMin: searchParams.get('bottomMin')
    ? Number(searchParams.get('bottomMin'))
    : undefined,
  bottomMax: searchParams.get('bottomMax')
    ? Number(searchParams.get('bottomMax'))
    : undefined,
  travelMin: searchParams.get('travelMin')
    ? Number(searchParams.get('travelMin'))
    : undefined,
  travelMax: searchParams.get('travelMax')
    ? Number(searchParams.get('travelMax'))
    : undefined,
  sortBy: (searchParams.get('sortBy') as SortBy) || undefined,
  sortDirection:
    (searchParams.get('sortDirection') as SortDirection) || undefined,
});

const filtersToParams = (filters: SwitchFilters): string => {
  const params = new URLSearchParams();
  if (filters.query) params.set('q', filters.query);
  if (filters.type) params.set('type', filters.type);
  if (filters.manufacturer) params.set('manufacturer', filters.manufacturer);
  if (filters.mountPins !== undefined)
    params.set('mountPins', String(filters.mountPins));
  if (filters.silent !== undefined)
    params.set('silent', String(filters.silent));
  if (filters.factoryLubed !== undefined)
    params.set('factoryLubed', String(filters.factoryLubed));
  if (filters.actuationMin !== undefined)
    params.set('actuationMin', String(filters.actuationMin));
  if (filters.actuationMax !== undefined)
    params.set('actuationMax', String(filters.actuationMax));
  if (filters.initialMin !== undefined)
    params.set('initialMin', String(filters.initialMin));
  if (filters.initialMax !== undefined)
    params.set('initialMax', String(filters.initialMax));
  if (filters.bottomMin !== undefined)
    params.set('bottomMin', String(filters.bottomMin));
  if (filters.bottomMax !== undefined)
    params.set('bottomMax', String(filters.bottomMax));
  if (filters.travelMin !== undefined)
    params.set('travelMin', String(filters.travelMin));
  if (filters.travelMax !== undefined)
    params.set('travelMax', String(filters.travelMax));
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortDirection) params.set('sortDirection', filters.sortDirection);
  return params.toString();
};

const SwitchesPageContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilter, setShowFilter] = useState(true);

  const [filters, setFilters] = useState<SwitchFilters>(() =>
    parseFiltersFromParams(searchParams),
  );

  const { data, isLoading, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSearchSwitches(filters);
  const manufacturers = MANUFACTURERS as unknown as string[];

  const switches = useMemo(
    () => data?.pages.flatMap((page) => page.switches) ?? [],
    [data],
  );

  const handleSubmit = useCallback(
    (newFilters: SwitchFilters) => {
      const merged = {
        ...newFilters,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
      };
      setFilters(merged);
      const qs = filtersToParams(merged);
      router.push(qs ? `/switches?${qs}` : '/switches', { scroll: false });
    },
    [filters.sortBy, filters.sortDirection, router],
  );

  const handleReset = useCallback(() => {
    setFilters({});
    router.push('/switches', { scroll: false });
  }, [router]);

  const handleSort = useCallback(
    (sortBy: SortBy | undefined, sortDirection?: SortDirection) => {
      const newFilters = { ...filters, sortBy, sortDirection };
      setFilters(newFilters);
      const qs = filtersToParams(newFilters);
      router.push(qs ? `/switches?${qs}` : '/switches', { scroll: false });
    },
    [filters, router],
  );

  const sortByOptions: { value: SortBy; label: string }[] = [
    { value: '이름', label: t('filter.sortName') },
    { value: '입력압', label: t('filter.sortActuation') },
    { value: '초기압', label: t('filter.sortInitial') },
    { value: '바닥압', label: t('filter.sortBottom') },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{t('nav.switches')}</h1>
        <div className="flex items-center gap-1">
          <SwitchCardSettingsModal />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilter(!showFilter)}
          >
            {t('filter.title')}
            {showFilter ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </Button>
        </div>
      </div>

      {showFilter && (
        <div className="mb-6">
          <SwitchFilter
            filters={filters}
            onSubmit={handleSubmit}
            onReset={handleReset}
            manufacturers={manufacturers}
          />
        </div>
      )}

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <ArrowDownUp className="h-3 w-3" />
          {t('filter.sort')}
        </span>
        {sortByOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              if (filters.sortBy === opt.value) {
                const nextDir =
                  filters.sortDirection === 'ascending'
                    ? 'descending'
                    : 'ascending';
                handleSort(opt.value, nextDir);
              } else {
                handleSort(opt.value, 'ascending');
              }
            }}
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-colors cursor-pointer',
              filters.sortBy === opt.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-muted',
            )}
          >
            {opt.label}
            {filters.sortBy === opt.value && (
              <span className="text-[10px]">
                {filters.sortDirection === 'descending' ? '↓' : '↑'}
              </span>
            )}
          </button>
        ))}
        {filters.sortBy && (
          <button
            type="button"
            onClick={() => handleSort(undefined)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {t('filter.sortDefault')}
          </button>
        )}
      </div>

      <div className="relative">
        {isFetching && !isFetchingNextPage && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-[1px]" style={{ minHeight: '8rem' }}>
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <SwitchCardGrid
            switches={switches}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        )}
      </div>
    </div>
  );
};

const SwitchesPage = () => {
  return (
    <Suspense>
      <SwitchesPageContent />
    </Suspense>
  );
};

export default SwitchesPage;
