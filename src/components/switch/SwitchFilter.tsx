'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/i18n/useTranslation';
import type { SwitchType, MountPins, SwitchFilters } from '@/types/switch';

interface SwitchFilterProps {
  filters: SwitchFilters;
  onSubmit: (filters: SwitchFilters) => void;
  onReset: () => void;
  manufacturers?: string[];
}

const switchTypes: { value: SwitchType; labelKey: string }[] = [
  { value: '리니어', labelKey: 'switch.linear' },
  { value: '택타일', labelKey: 'switch.tactile' },
  { value: '클릭', labelKey: 'switch.clicky' },
  { value: 'hall effect', labelKey: 'switch.hallEffect' },
];

const mountPinOptions: { value: MountPins; labelKey: string }[] = [
  { value: 5, labelKey: 'switch.pin5' },
  { value: 3, labelKey: 'switch.pin3' },
  { value: 0, labelKey: 'switch.pinNone' },
];

const SwitchFilter = ({ filters: appliedFilters, onSubmit, onReset, manufacturers = [] }: SwitchFilterProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<SwitchFilters>(appliedFilters);

  const update = (partial: Partial<SwitchFilters>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  const handleSubmit = () => {
    onSubmit(draft);
  };

  const handleReset = () => {
    setDraft({});
    onReset();
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('common.search')}</Label>
        <Input
          placeholder={t('hero.searchPlaceholder')}
          value={draft.query ?? ''}
          onChange={(e) => update({ query: e.target.value || undefined })}
        />
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-3 block">{t('filter.type')}</Label>
        <div className="space-y-2">
          <button
            type="button"
            className={`block text-sm w-full text-left px-2 py-1 rounded ${!draft.type ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => update({ type: undefined })}
          >
            {t('switch.all')}
          </button>
          {switchTypes.map((st) => (
            <button
              key={st.value}
              type="button"
              className={`block text-sm w-full text-left px-2 py-1 rounded ${draft.type === st.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
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
              className={`block text-sm w-full text-left px-2 py-1 rounded ${!draft.manufacturer ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => update({ manufacturer: undefined })}
            >
              {t('switch.all')}
            </button>
            {manufacturers.map((m) => (
              <button
                key={m}
                type="button"
                className={`block text-sm w-full text-left px-2 py-1 rounded ${draft.manufacturer === m ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
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
            className={`block text-sm w-full text-left px-2 py-1 rounded ${draft.mountPins === undefined ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => update({ mountPins: undefined })}
          >
            {t('switch.all')}
          </button>
          {mountPinOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`block text-sm w-full text-left px-2 py-1 rounded ${draft.mountPins === opt.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => update({ mountPins: opt.value })}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-3 block">{t('filter.silent')}</Label>
        <div className="space-y-2">
          {[
            { value: undefined, label: t('switch.all') },
            { value: true, label: t('switch.yes') },
            { value: false, label: t('switch.no') },
          ].map((opt, i) => (
            <button
              key={i}
              type="button"
              className={`block text-sm w-full text-left px-2 py-1 rounded ${draft.silent === opt.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => update({ silent: opt.value })}
            >
              {opt.label}
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
              className={`block text-sm w-full text-left px-2 py-1 rounded ${draft.factoryLubed === opt.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
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
          {t('filter.actuationForceRange')} ({draft.actuationMin ?? 0}~
          {draft.actuationMax ?? 100}
          {t('switch.g')})
        </Label>
        <Slider
          min={0}
          max={100}
          step={5}
          value={[draft.actuationMin ?? 0, draft.actuationMax ?? 100]}
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
          {t('filter.travelRange')} ({draft.travelMin ?? 0}~{draft.travelMax ?? 5}
          {t('switch.mm')})
        </Label>
        <Slider
          min={0}
          max={5}
          step={0.1}
          value={[draft.travelMin ?? 0, draft.travelMax ?? 5]}
          onValueChange={(value) => {
            const v = value as number[];
            update({
              travelMin: v[0] > 0 ? v[0] : undefined,
              travelMax: v[1] < 5 ? v[1] : undefined,
            });
          }}
        />
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleSubmit}>
          {t('common.search')}
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleReset}>
          {t('filter.reset')}
        </Button>
      </div>
    </div>
  );
};

export default SwitchFilter;
