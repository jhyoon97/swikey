'use client';

import Image from 'next/image';

import SoundPlayer from '@/components/sound/SoundPlayer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import { switchTypeColor, switchTypeLabelKey } from '@/lib/utils';
import type { KeyboardSwitch } from '@/types/switch';

const SwitchDetail = ({ sw }: { sw: KeyboardSwitch }) => {
  const { t, locale } = useTranslation();
  const displayName = locale === 'ko' && sw.nameKo ? sw.nameKo : sw.name;
  const typeLabel = t(switchTypeLabelKey[sw.type]);

  const na = t('common.noInfo');

  const pinLabel =
    sw.mountPins === 5
      ? t('switch.pin5')
      : sw.mountPins === 3
        ? t('switch.pin3')
        : t('switch.pinNone');

  const specs = [
    {
      label: t('switch.silent'),
      value: sw.silent ? t('switch.yes') : t('switch.no'),
    },
    { label: t('switch.manufacturer'), value: sw.manufacturer },
    { label: t('switch.upperHousing'), value: sw.upperHousingMaterial },
    { label: t('switch.lowerHousing'), value: sw.lowerHousingMaterial },
    { label: t('switch.stemMaterial'), value: sw.stemMaterial },
    {
      label: t('switch.factoryLubed'),
      value: sw.factoryLubed ? t('switch.yes') : t('switch.no'),
    },
    {
      label: t('switch.springLength'),
      value:
        sw.springLength !== undefined
          ? `${sw.springLength}${t('switch.mm')}`
          : undefined,
    },
    { label: t('switch.mountPins'), value: pinLabel },
    {
      label: t('switch.travel'),
      value:
        sw.travel !== undefined ? `${sw.travel}${t('switch.mm')}` : undefined,
    },
    {
      label: t('switch.actuationPoint'),
      value:
        sw.actuationPoint !== undefined
          ? `${sw.actuationPoint}${t('switch.mm')}`
          : undefined,
    },
    {
      label: t('switch.actuationForce'),
      value:
        sw.pressure.actuation !== undefined
          ? `${sw.pressure.actuation}${t('switch.g')}`
          : undefined,
    },
    {
      label: t('switch.initialForce'),
      value:
        sw.pressure.initial !== undefined
          ? `${sw.pressure.initial}${t('switch.g')}`
          : undefined,
    },
    {
      label: t('switch.bottomForce'),
      value:
        sw.pressure.bottom !== undefined
          ? `${sw.pressure.bottom}${t('switch.g')}`
          : undefined,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-80 shrink-0">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            {sw.image ? (
              <Image
                src={sw.image}
                alt={sw.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No Image
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{displayName}</h1>
              <Badge className={switchTypeColor[sw.type]}>{typeLabel}</Badge>
            </div>
          </div>

          {sw.manufacturer && (
            <p className="text-muted-foreground mb-6">{sw.manufacturer}</p>
          )}

          {sw.soundUrl && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">
                {t('comment.typingSound')}
              </h3>
              <SoundPlayer src={sw.soundUrl} />
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('switch.specs')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-sm text-muted-foreground">
                  {spec.label}
                </span>
                <span className="text-sm font-medium">{spec.value ?? na}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SwitchDetail;
