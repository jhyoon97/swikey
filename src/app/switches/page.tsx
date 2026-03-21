'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SwitchFilter from '@/components/switch/SwitchFilter';
import SwitchCardGrid from '@/components/switch/SwitchCardGrid';
import { useSearchSwitches, useManufacturers } from '@/lib/api/queries/useSwitches';
import { useTranslation } from '@/i18n/useTranslation';
import type { SwitchFilters, SwitchType, MountPins } from '@/types/switch';

const SwitchesPageContent = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState<SwitchFilters>(() => ({
    query: searchParams.get('q') || undefined,
    type: (searchParams.get('type') as SwitchType) || undefined,
    manufacturer: searchParams.get('manufacturer') || undefined,
    mountPins: searchParams.get('mountPins')
      ? (Number(searchParams.get('mountPins')) as MountPins)
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
  }));

  const { data: switches, isLoading } = useSearchSwitches(filters);
  const { data: manufacturers } = useManufacturers();

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
          <div className="sticky top-20">
            <h2 className="font-semibold mb-4">{t('filter.title')}</h2>
            <SwitchFilter filters={filters} onFilterChange={setFilters} manufacturers={manufacturers} />
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
