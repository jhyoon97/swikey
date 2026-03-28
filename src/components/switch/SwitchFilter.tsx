'use client';

import { useState } from 'react';

import { ChevronDown, X } from 'lucide-react';

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

type FilterCategory =
  | 'type'
  | 'mountPins'
  | 'silent'
  | 'lowProfile'
  | 'factoryLubed'
  | 'manufacturer'
  | 'actuation'
  | 'initial'
  | 'bottom'
  | 'travel';

const SwitchFilter = ({
  filters: appliedFilters,
  onSubmit,
  onReset,
  manufacturers = [],
}: SwitchFilterProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<SwitchFilters>(appliedFilters);
  const [openCategory, setOpenCategory] = useState<FilterCategory | null>(null);

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
    draft.lowProfile !== undefined ||
    draft.factoryLubed !== undefined ||
    draft.actuationMin ||
    draft.actuationMax ||
    draft.initialMin ||
    draft.initialMax ||
    draft.bottomMin ||
    draft.bottomMax ||
    draft.travelMin ||
    draft.travelMax;

  const toggleCategory = (cat: FilterCategory) => {
    setOpenCategory((prev) => (prev === cat ? null : cat));
  };

  const hasFilterValue = (cat: FilterCategory): boolean => {
    switch (cat) {
      case 'type':
        return !!draft.type;
      case 'mountPins':
        return draft.mountPins !== undefined;
      case 'silent':
        return draft.silent !== undefined;
      case 'lowProfile':
        return draft.lowProfile !== undefined;
      case 'factoryLubed':
        return draft.factoryLubed !== undefined;
      case 'manufacturer':
        return !!draft.manufacturer;
      case 'actuation':
        return !!draft.actuationMin || !!draft.actuationMax;
      case 'initial':
        return !!draft.initialMin || !!draft.initialMax;
      case 'bottom':
        return !!draft.bottomMin || !!draft.bottomMax;
      case 'travel':
        return !!draft.travelMin || !!draft.travelMax;
      default:
        return false;
    }
  };

  const getFilterLabel = (cat: FilterCategory): string => {
    switch (cat) {
      case 'type':
        return t('filter.type');
      case 'mountPins':
        return t('filter.mountPins');
      case 'silent':
        return t('filter.silent');
      case 'lowProfile':
        return t('filter.lowProfile');
      case 'factoryLubed':
        return t('filter.factoryLubed');
      case 'manufacturer':
        return t('filter.manufacturer');
      case 'actuation':
        return t('filter.actuationForceRange');
      case 'initial':
        return t('filter.initialForceRange');
      case 'bottom':
        return t('filter.bottomForceRange');
      case 'travel':
        return t('filter.travelRange');
      default:
        return '';
    }
  };

  const categories: FilterCategory[] = [
    'type',
    'mountPins',
    'silent',
    'lowProfile',
    'factoryLubed',
    ...(manufacturers.length > 0 ? (['manufacturer'] as const) : []),
    'actuation',
    'initial',
    'bottom',
    'travel',
  ];

  const renderMobilePanelContent = (cat: FilterCategory) => {
    switch (cat) {
      case 'type':
        return (
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
        );
      case 'mountPins':
        return (
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
        );
      case 'silent':
        return (
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
        );
      case 'lowProfile':
        return (
          <div className="flex flex-wrap gap-1.5">
            {([undefined, true, false] as const).map((value, i) => (
              <Tag
                key={i}
                selected={draft.lowProfile === value}
                onClick={() => update({ lowProfile: value })}
              >
                {value === undefined
                  ? t('switch.all')
                  : value
                    ? t('switch.yes')
                    : t('switch.no')}
              </Tag>
            ))}
          </div>
        );
      case 'factoryLubed':
        return (
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
        );
      case 'manufacturer':
        return (
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
                    manufacturer: draft.manufacturer === m ? undefined : m,
                  })
                }
              >
                {m}
              </Tag>
            ))}
          </div>
        );
      case 'actuation':
        return (
          <div className="flex items-center gap-3">
            <div className="flex-1">
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
            <span className="text-sm text-muted-foreground shrink-0">
              {draft.actuationMin ?? 0}~{draft.actuationMax ?? 100}
              {t('switch.g')}
            </span>
          </div>
        );
      case 'initial':
        return (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Slider
                min={0}
                max={100}
                step={5}
                value={[draft.initialMin ?? 0, draft.initialMax ?? 100]}
                onValueChange={(value) => {
                  const v = value as number[];
                  update({
                    initialMin: v[0] > 0 ? v[0] : undefined,
                    initialMax: v[1] < 100 ? v[1] : undefined,
                  });
                }}
              />
            </div>
            <span className="text-sm text-muted-foreground shrink-0">
              {draft.initialMin ?? 0}~{draft.initialMax ?? 100}
              {t('switch.g')}
            </span>
          </div>
        );
      case 'bottom':
        return (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Slider
                min={0}
                max={100}
                step={5}
                value={[draft.bottomMin ?? 0, draft.bottomMax ?? 100]}
                onValueChange={(value) => {
                  const v = value as number[];
                  update({
                    bottomMin: v[0] > 0 ? v[0] : undefined,
                    bottomMax: v[1] < 100 ? v[1] : undefined,
                  });
                }}
              />
            </div>
            <span className="text-sm text-muted-foreground shrink-0">
              {draft.bottomMin ?? 0}~{draft.bottomMax ?? 100}
              {t('switch.g')}
            </span>
          </div>
        );
      case 'travel':
        return (
          <div className="flex items-center gap-3">
            <div className="flex-1">
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
            <span className="text-sm text-muted-foreground shrink-0">
              {draft.travelMin ?? 0}~{draft.travelMax ?? 5}
              {t('switch.mm')}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder={t('filter.searchPlaceholder')}
        value={draft.query ?? ''}
        onChange={(e) => update({ query: e.target.value || undefined })}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
      />

      {/* 모바일: 카테고리 칩 + 패널 */}
      <div className="md:hidden space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={cn(
                'shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer',
                openCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : hasFilterValue(cat)
                    ? 'bg-background text-foreground border-primary'
                    : 'bg-background text-foreground border-border',
              )}
            >
              {getFilterLabel(cat)}
              {hasFilterValue(cat) && openCategory !== cat && (
                <span className="size-1.5 rounded-full bg-primary" />
              )}
              <ChevronDown
                className={cn(
                  'h-3 w-3 transition-transform',
                  openCategory === cat && 'rotate-180',
                )}
              />
            </button>
          ))}
        </div>
        {openCategory && (
          <div className="rounded-lg border bg-card p-3">
            {renderMobilePanelContent(openCategory)}
          </div>
        )}
      </div>

      {/* 데스크톱: 테이블 레이아웃 */}
      <table className="hidden md:table w-full border-collapse">
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

          {/* 로우프로파일 */}
          <tr>
            <td className="text-sm font-medium text-muted-foreground py-2 pr-4 align-top whitespace-nowrap">
              {t('filter.lowProfile')}
            </td>
            <td className="py-2">
              <div className="flex flex-wrap gap-1.5">
                {([undefined, true, false] as const).map((value, i) => (
                  <Tag
                    key={i}
                    selected={draft.lowProfile === value}
                    onClick={() => update({ lowProfile: value })}
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

          {/* 초기압 범위 */}
          <tr>
            <td className="text-sm font-medium text-muted-foreground py-2 pr-4 align-top whitespace-nowrap">
              {t('filter.initialForceRange')}
            </td>
            <td className="py-2">
              <div className="flex items-center gap-3">
                <div className="w-48">
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[draft.initialMin ?? 0, draft.initialMax ?? 100]}
                    onValueChange={(value) => {
                      const v = value as number[];
                      update({
                        initialMin: v[0] > 0 ? v[0] : undefined,
                        initialMax: v[1] < 100 ? v[1] : undefined,
                      });
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {draft.initialMin ?? 0}~{draft.initialMax ?? 100}
                  {t('switch.g')}
                </span>
              </div>
            </td>
          </tr>

          {/* 바닥압 범위 */}
          <tr>
            <td className="text-sm font-medium text-muted-foreground py-2 pr-4 align-top whitespace-nowrap">
              {t('filter.bottomForceRange')}
            </td>
            <td className="py-2">
              <div className="flex items-center gap-3">
                <div className="w-48">
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[draft.bottomMin ?? 0, draft.bottomMax ?? 100]}
                    onValueChange={(value) => {
                      const v = value as number[];
                      update({
                        bottomMin: v[0] > 0 ? v[0] : undefined,
                        bottomMax: v[1] < 100 ? v[1] : undefined,
                      });
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {draft.bottomMin ?? 0}~{draft.bottomMax ?? 100}
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
