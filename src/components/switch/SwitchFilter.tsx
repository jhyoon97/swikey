'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/i18n/useTranslation';
import type { SwitchType, MountPins, SwitchFilters } from '@/types/switch';

interface SwitchFilterProps {
  filters: SwitchFilters;
  onFilterChange: (filters: SwitchFilters) => void;
  manufacturers?: string[];
}

const switchTypes: { value: SwitchType; labelKey: string }[] = [
  { value: '리니어', labelKey: 'switch.linear' },
  { value: '택타일', labelKey: 'switch.tactile' },
  { value: 'hall effect', labelKey: 'switch.hallEffect' },
];

const mountPinOptions: { value: MountPins; labelKey: string }[] = [
  { value: 5, labelKey: 'switch.pin5' },
  { value: 3, labelKey: 'switch.pin3' },
  { value: 0, labelKey: 'switch.pinNone' },
];

const SwitchFilter = ({ filters, onFilterChange, manufacturers = [] }: SwitchFilterProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrl = useCallback(
    (newFilters: SwitchFilters) => {
      const params = new URLSearchParams();
      if (newFilters.query) params.set('q', newFilters.query);
      if (newFilters.type) params.set('type', newFilters.type);
      if (newFilters.manufacturer) params.set('manufacturer', newFilters.manufacturer);
      if (newFilters.mountPins !== undefined) params.set('mountPins', String(newFilters.mountPins));
      if (newFilters.factoryLubed !== undefined)
        params.set('factoryLubed', String(newFilters.factoryLubed));
      if (newFilters.actuationMin !== undefined)
        params.set('actuationMin', String(newFilters.actuationMin));
      if (newFilters.actuationMax !== undefined)
        params.set('actuationMax', String(newFilters.actuationMax));
      if (newFilters.travelMin !== undefined)
        params.set('travelMin', String(newFilters.travelMin));
      if (newFilters.travelMax !== undefined)
        params.set('travelMax', String(newFilters.travelMax));
      const qs = params.toString();
      router.push(qs ? `/switches?${qs}` : '/switches', { scroll: false });
    },
    [router],
  );

  const update = (partial: Partial<SwitchFilters>) => {
    const newFilters = { ...filters, ...partial };
    onFilterChange(newFilters);
    updateUrl(newFilters);
  };

  const reset = () => {
    const empty: SwitchFilters = {};
    onFilterChange(empty);
    router.push('/switches', { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('common.search')}</Label>
        <Input
          placeholder={t('hero.searchPlaceholder')}
          value={filters.query ?? ''}
          onChange={(e) => update({ query: e.target.value || undefined })}
        />
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-3 block">{t('filter.type')}</Label>
        <div className="space-y-2">
          <button
            type="button"
            className={`block text-sm w-full text-left px-2 py-1 rounded ${!filters.type ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => update({ type: undefined })}
          >
            {t('switch.all')}
          </button>
          {switchTypes.map((st) => (
            <button
              key={st.value}
              type="button"
              className={`block text-sm w-full text-left px-2 py-1 rounded ${filters.type === st.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => update({ type: st.value })}
            >
              {t(st.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {manufacturers.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-3 block">{t('filter.manufacturer')}</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <button
              type="button"
              className={`block text-sm w-full text-left px-2 py-1 rounded ${!filters.manufacturer ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => update({ manufacturer: undefined })}
            >
              {t('switch.all')}
            </button>
            {manufacturers.map((m) => (
              <button
                key={m}
                type="button"
                className={`block text-sm w-full text-left px-2 py-1 rounded ${filters.manufacturer === m ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => update({ manufacturer: m })}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-3 block">{t('filter.mountPins')}</Label>
        <div className="space-y-2">
          <button
            type="button"
            className={`block text-sm w-full text-left px-2 py-1 rounded ${filters.mountPins === undefined ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => update({ mountPins: undefined })}
          >
            {t('switch.all')}
          </button>
          {mountPinOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`block text-sm w-full text-left px-2 py-1 rounded ${filters.mountPins === opt.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => update({ mountPins: opt.value })}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-3 block">{t('filter.factoryLubed')}</Label>
        <div className="space-y-2">
          {[
            { value: undefined, label: t('switch.all') },
            { value: true, label: t('switch.yes') },
            { value: false, label: t('switch.no') },
          ].map((opt, i) => (
            <button
              key={i}
              type="button"
              className={`block text-sm w-full text-left px-2 py-1 rounded ${filters.factoryLubed === opt.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => update({ factoryLubed: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-3 block">
          {t('filter.actuationForceRange')} ({filters.actuationMin ?? 0}~
          {filters.actuationMax ?? 100}
          {t('switch.g')})
        </Label>
        <Slider
          min={0}
          max={100}
          step={5}
          value={[filters.actuationMin ?? 0, filters.actuationMax ?? 100]}
          onValueChange={(value) => {
            const v = value as number[];
            update({
              actuationMin: v[0] > 0 ? v[0] : undefined,
              actuationMax: v[1] < 100 ? v[1] : undefined,
            });
          }}
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">
          {t('filter.travelRange')} ({filters.travelMin ?? 0}~{filters.travelMax ?? 5}
          {t('switch.mm')})
        </Label>
        <Slider
          min={0}
          max={5}
          step={0.1}
          value={[filters.travelMin ?? 0, filters.travelMax ?? 5]}
          onValueChange={(value) => {
            const v = value as number[];
            update({
              travelMin: v[0] > 0 ? v[0] : undefined,
              travelMax: v[1] < 5 ? v[1] : undefined,
            });
          }}
        />
      </div>

      <Button variant="outline" className="w-full" onClick={reset}>
        {t('filter.reset')}
      </Button>
    </div>
  );
};

export default SwitchFilter;
