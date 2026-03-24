'use client';

import { useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SwitchFilter from '@/components/switch/SwitchFilter';
import SwitchCardGrid from '@/components/switch/SwitchCardGrid';
import { useSearchSwitches, useManufacturers } from '@/lib/api/queries/useSwitches';
import { useTranslation } from '@/i18n/useTranslation';
import type { SwitchFilters, SwitchType, MountPins } from '@/types/switch';

const parseFiltersFromParams = (searchParams: URLSearchParams): SwitchFilters => ({
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
  if (filters.mountPins !== undefined) params.set('mountPins', String(filters.mountPins));
  if (filters.silent !== undefined) params.set('silent', String(filters.silent));
  if (filters.factoryLubed !== undefined) params.set('factoryLubed', String(filters.factoryLubed));
  if (filters.actuationMin !== undefined) params.set('actuationMin', String(filters.actuationMin));
  if (filters.actuationMax !== undefined) params.set('actuationMax', String(filters.actuationMax));
  if (filters.travelMin !== undefined) params.set('travelMin', String(filters.travelMin));
  if (filters.travelMax !== undefined) params.set('travelMax', String(filters.travelMax));
  return params.toString();
};

const SwitchesPageContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState<SwitchFilters>(() => parseFiltersFromParams(searchParams));

  const { data: switches, isLoading } = useSearchSwitches(filters);
  const { data: manufacturers } = useManufacturers();

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('nav.switches')}</h1>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={() => setShowFilter(!showFilter)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {t('filter.title')}
        </Button>
      </div>

      <div className="flex gap-8">
        <aside
          className={`w-64 shrink-0 ${showFilter ? 'block' : 'hidden'} md:block`}
        >
          <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <h2 className="font-semibold mb-4">{t('filter.title')}</h2>
            <SwitchFilter
              filters={filters}
              onSubmit={handleSubmit}
              onReset={handleReset}
              manufacturers={manufacturers}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">{t('common.loading')}</div>
          ) : (
            <SwitchCardGrid switches={switches ?? []} />
          )}
        </div>
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
