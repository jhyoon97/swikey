'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { SwitchCardProperty } from '@/hooks/useSwitchCardSettings';
import { useTranslation } from '@/i18n/useTranslation';
import { switchTypeColor, switchTypeLabelKey } from '@/lib/utils';
import type { KeyboardSwitch } from '@/types/switch';

function renderProperty(
  sw: KeyboardSwitch,
  key: string,
  t: (k: string) => string,
): string | null {
  switch (key) {
    case 'type':
      return t(switchTypeLabelKey[sw.type]);
    case 'manufacturer':
      return sw.manufacturer || null;
    case 'collaborator':
      return sw.collaborator || null;
    case 'upperHousingMaterial':
      return sw.upperHousingMaterial
        ? `${t('switch.upperHousing')}: ${sw.upperHousingMaterial}`
        : null;
    case 'lowerHousingMaterial':
      return sw.lowerHousingMaterial
        ? `${t('switch.lowerHousing')}: ${sw.lowerHousingMaterial}`
        : null;
    case 'stemMaterial':
      return sw.stemMaterial
        ? `${t('switch.stemMaterial')}: ${sw.stemMaterial}`
        : null;
    case 'silent':
      return `${t('switch.silent')}: ${sw.silent ? t('switch.yes') : t('switch.no')}`;
    case 'factoryLubed':
      return `${t('switch.factoryLubed')}: ${sw.factoryLubed ? t('switch.yes') : t('switch.no')}`;
    case 'springLength':
      return sw.springLength !== undefined
        ? `${t('switch.springLength')}: ${sw.springLength}${t('switch.mm')}`
        : null;
    case 'mountPins': {
      const pinLabel =
        sw.mountPins === 5
          ? t('switch.pin5')
          : sw.mountPins === 3
            ? t('switch.pin3')
            : t('switch.pinNone');
      return `${t('switch.mountPins')}: ${pinLabel}`;
    }
    case 'travel':
      return sw.travel !== undefined
        ? `${t('switch.travel')}: ${sw.travel}${t('switch.mm')}`
        : null;
    case 'actuationPoint':
      return sw.actuationPoint !== undefined
        ? `${t('switch.actuationPoint')}: ${sw.actuationPoint}${t('switch.mm')}`
        : null;
    case 'pressure.actuation':
      return sw.pressure.actuation !== undefined
        ? `${t('switch.actuationForce')}: ${sw.pressure.actuation}${t('switch.g')}`
        : null;
    case 'pressure.initial':
      return sw.pressure.initial !== undefined
        ? `${t('switch.initialForce')}: ${sw.pressure.initial}${t('switch.g')}`
        : null;
    case 'pressure.bottom':
      return sw.pressure.bottom !== undefined
        ? `${t('switch.bottomForce')}: ${sw.pressure.bottom}${t('switch.g')}`
        : null;
    default:
      return null;
  }
}

interface SwitchCardProps {
  sw: KeyboardSwitch;
  properties?: SwitchCardProperty[];
}

const SwitchCard = ({ sw, properties }: SwitchCardProps) => {
  const { t, locale } = useTranslation();
  const displayName = locale === 'ko' && sw.nameKo ? sw.nameKo : sw.name;

  const enabledProperties = properties
    ? properties.filter((p) => p.enabled)
    : [];

  return (
    <Link href={`/switches/${sw.slug}`} prefetch={false}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg cursor-pointer h-full">
        <div className="relative aspect-square bg-muted overflow-hidden">
          {sw.image ? (
            <Image
              src={sw.image}
              alt={sw.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No Image
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">
            {displayName}
          </h3>
          {enabledProperties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {enabledProperties.map((prop) => {
                const value = renderProperty(sw, prop.key, t);
                if (!value) return null;
                return prop.key === 'type' ? (
                  <Badge key={prop.key} className={switchTypeColor[sw.type]}>
                    {value}
                  </Badge>
                ) : (
                  <Badge
                    key={prop.key}
                    variant="secondary"
                    className="font-normal"
                  >
                    {value}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default SwitchCard;
