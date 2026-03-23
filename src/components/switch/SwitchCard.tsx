'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import type { KeyboardSwitch } from '@/types/switch';

const typeColorMap = {
  '리니어': 'bg-[var(--color-switch-linear)] text-white',
  '택타일': 'bg-[var(--color-switch-tactile)] text-white',
  'hall effect': 'bg-[var(--color-switch-hall)] text-white',
} as const;

const SwitchCard = ({ sw }: { sw: KeyboardSwitch }) => {
  const { t, locale } = useTranslation();
  const displayName = locale === 'ko' && sw.nameKo ? sw.nameKo : sw.name;

  const typeLabel =
    sw.type === '리니어'
      ? t('switch.linear')
      : sw.type === '택타일'
        ? t('switch.tactile')
        : t('switch.hallEffect');

  return (
    <Link href={`/switches/${sw.slug}`}>
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
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge className={typeColorMap[sw.type]}>{typeLabel}</Badge>
          </div>
          {sw.manufacturer && (
            <p className="text-xs text-muted-foreground mb-1">{sw.manufacturer}</p>
          )}
          <h3 className="font-semibold text-sm line-clamp-2 mb-1">{displayName}</h3>
          <div className="flex gap-3 text-xs text-muted-foreground">
            {sw.pressure.actuation !== undefined && (
              <span>
                {t('switch.actuationForce')}: {sw.pressure.actuation}
                {t('switch.g')}
              </span>
            )}
            {sw.travel !== undefined && (
              <span>
                {t('switch.travel')}: {sw.travel}
                {t('switch.mm')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SwitchCard;
