'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import SwitchCardGrid from '@/components/switch/SwitchCardGrid';
import SwitchCardSettingsModal from '@/components/switch/SwitchCardSettingsModal';
import SwitchFilter from '@/components/switch/SwitchFilter';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { useSearchSwitches } from '@/lib/api/queries/useSwitches';
import { MANUFACTURERS } from '@/lib/utils';
import type { MountPins, SwitchFilters, SwitchType } from '@/types/switch';

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
  travelMin: searchParams.get('travelMin')
    ? Number(searchParams.get('travelMin'))
    : undefined,
  travelMax: searchParams.get('travelMax')
    ? Number(searchParams.get('travelMax'))
    : undefined,
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
  if (filters.travelMin !== undefined)
    params.set('travelMin', String(filters.travelMin));
  if (filters.travelMax !== undefined)
    params.set('travelMax', String(filters.travelMax));
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

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSearchSwitches(filters);
  const manufacturers = MANUFACTURERS as unknown as string[];

  const switches = useMemo(
    () => data?.pages.flatMap((page) => page.switches) ?? [],
    [data],
  );

  const handleSubmit = useCallback(
    (newFilters: SwitchFilters) => {
      setFilters(newFilters);
      const qs = filtersToParams(newFilters);
      router.push(qs ? `/switches?${qs}` : '/switches', { scroll: false });
    },
    [router],
  );

  const handleReset = useCallback(() => {
    setFilters({});
    router.push('/switches', { scroll: false });
  }, [router]);

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

      <div>
        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">
            {t('common.loading')}
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
