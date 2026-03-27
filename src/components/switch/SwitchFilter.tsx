'use client';

import { useState } from 'react';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';
import type { MountPins, SwitchFilters, SwitchType } from '@/types/switch';

interface SwitchFilterProps {
  filters: SwitchFilters;
  onSubmit: (filters: SwitchFilters) => void;
  onReset: () => void;
  manufacturers?: string[];
}

const switchTypes: { value: SwitchType; labelKey: string }[] = [
  { value: '리니어', labelKey: 'switch.linear' },
  { value: '택타일', labelKey: 'switch.tactile' },
  { value: '클릭키', labelKey: 'switch.clicky' },
  { value: 'hall effect', labelKey: 'switch.hallEffect' },
];

const mountPinOptions: { value: MountPins; labelKey: string }[] = [
  { value: 5, labelKey: 'switch.pin5' },
  { value: 3, labelKey: 'switch.pin3' },
  { value: 0, labelKey: 'switch.pinNone' },
];

const Tag = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'inline-flex items-center px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer',
      selected
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-background text-foreground border-border hover:bg-muted',
    )}
  >
    {children}
  </button>
);

const SwitchFilter = ({
  filters: appliedFilters,
  onSubmit,
  onReset,
  manufacturers = [],
}: SwitchFilterProps) => {
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

  const hasActiveFilters =
    draft.type ||
    draft.manufacturer ||
    draft.mountPins !== undefined ||
    draft.silent !== undefined ||
    draft.factoryLubed !== undefined ||
    draft.actuationMin ||
    draft.actuationMax ||
    draft.travelMin ||
    draft.travelMax;

  return (
    <div className="space-y-4">
      <Input
        placeholder={t('hero.searchPlaceholder')}
        value={draft.query ?? ''}
        onChange={(e) => update({ query: e.target.value || undefined })}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
      />

      <table className="w-full border-collapse">
        <tbody>
          {/* 스위치 타입 */}
          <tr>
            <td className="text-sm font-medium text-muted-foreground py-2 pr-4 align-top whitespace-nowrap w-0">
              {t('filter.type')}
            </td>
            <td className="py-2">
              <div className="flex flex-wrap gap-1.5">
                <Tag
                  selected={!draft.type}
                  onClick={() => update({ type: undefined })}
                >
                  {t('switch.all')}
                </Tag>
                {switchTypes.map((st) => (
                  <Tag
                    key={st.value}
                    selected={draft.type === st.value}
                    onClick={() =>
                      update({
                        type: draft.type === st.value ? undefined : st.value,
                      })
                    }
                  >
                    {t(st.labelKey)}
                  </Tag>
                ))}
              </div>
            </td>
          </tr>

          {/* 마운트 핀 */}
          <tr>
            <td className="text-sm font-medium text-muted-foreground py-2 pr-4 align-top whitespace-nowrap">
              {t('filter.mountPins')}
            </td>
            <td className="py-2">
              <div className="flex flex-wrap gap-1.5">
                <Tag
                  selected={draft.mountPins === undefined}
                  onClick={() => update({ mountPins: undefined })}
                >
                  {t('switch.all')}
                </Tag>
                {mountPinOptions.map((opt) => (
                  <Tag
                    key={opt.value}
                    selected={draft.mountPins === opt.value}
                    onClick={() =>
                      update({
                        mountPins:
                          draft.mountPins === opt.value ? undefined : opt.value,
                      })
                    }
                  >
                    {t(opt.labelKey)}
                  </Tag>
                ))}
              </div>
            </td>
          </tr>

          {/* 저소음 */}
          <tr>
            <td className="text-sm font-medium text-muted-foreground py-2 pr-4 align-top whitespace-nowrap">
              {t('filter.silent')}
            </td>
            <td className="py-2">
              <div className="flex flex-wrap gap-1.5">
                {([undefined, true, false] as const).map((value, i) => (
                  <Tag
                    key={i}
                    selected={draft.silent === value}
                    onClick={() => update({ silent: value })}
                  >
                    {value === undefined
                      ? t('switch.all')
                      : value
                        ? t('switch.yes')
                        : t('switch.no')}
                  </Tag>
                ))}
              </div>
            </td>
          </tr>

          {/* 공장 윤활 */}
          <tr>
            <td className="text-sm font-medium text-muted-foreground py-2 pr-4 align-top whitespace-nowrap">
              {t('filter.factoryLubed')}
            </td>
            <td className="py-2">
              <div className="flex flex-wrap gap-1.5">
                {([undefined, true, false] as const).map((value, i) => (
                  <Tag
                    key={i}
                    selected={draft.factoryLubed === value}
                    onClick={() => update({ factoryLubed: value })}
                  >
                    {value === undefined
                      ? t('switch.all')
                      : value
                        ? t('switch.yes')
                        : t('switch.no')}
                  </Tag>
                ))}
              </div>
            </td>
          </tr>

          {/* 제조사 */}
          {manufacturers.length > 0 && (
            <tr>
              <td className="text-sm font-medium text-muted-foreground py-2 pr-4 align-top whitespace-nowrap">
                {t('filter.manufacturer')}
              </td>
              <td className="py-2">
                <div className="flex flex-wrap gap-1.5">
                  <Tag
                    selected={!draft.manufacturer}
                    onClick={() => update({ manufacturer: undefined })}
                  >
                    {t('switch.all')}
                  </Tag>
                  {manufacturers.map((m) => (
                    <Tag
                      key={m}
                      selected={draft.manufacturer === m}
                      onClick={() =>
                        update({
                          manufacturer:
                            draft.manufacturer === m ? undefined : m,
                        })
                      }
                    >
                      {m}
                    </Tag>
                  ))}
                </div>
              </td>
            </tr>
          )}

          {/* 입력압 범위 */}
          <tr>
            <td className="text-sm font-medium text-muted-foreground py-2 pr-4 align-top whitespace-nowrap">
              {t('filter.actuationForceRange')}
            </td>
            <td className="py-2">
              <div className="flex items-center gap-3">
                <div className="w-48">
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
                <span className="text-sm text-muted-foreground">
                  {draft.actuationMin ?? 0}~{draft.actuationMax ?? 100}
                  {t('switch.g')}
                </span>
              </div>
            </td>
          </tr>

          {/* 트래블 범위 */}
          <tr>
            <td className="text-sm font-medium text-muted-foreground py-2 pr-4 align-top whitespace-nowrap">
              {t('filter.travelRange')}
            </td>
            <td className="py-2">
              <div className="flex items-center gap-3">
                <div className="w-48">
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
                <span className="text-sm text-muted-foreground">
                  {draft.travelMin ?? 0}~{draft.travelMax ?? 5}
                  {t('switch.mm')}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex gap-2">
        <Button size="sm" onClick={handleSubmit}>
          {t('common.search')}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            {t('filter.reset')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SwitchFilter;
