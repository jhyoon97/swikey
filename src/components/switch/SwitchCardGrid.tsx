'use client';

import { useEffect, useRef } from 'react';

import { Loader2 } from 'lucide-react';

import { useSwitchCardSettings } from '@/hooks/useSwitchCardSettings';
import type { KeyboardSwitch } from '@/types/switch';

import SwitchCard from './SwitchCard';

interface SwitchCardGridProps {
  switches: KeyboardSwitch[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

const SwitchCardGrid = ({
  switches,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: SwitchCardGridProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const cardProperties = useSwitchCardSettings();

  useEffect(() => {
    if (!hasNextPage || !onLoadMore) return undefined;

    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (switches.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>No switches found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {switches.map((sw) => (
          <SwitchCard key={sw.id} sw={sw} properties={cardProperties} />
        ))}
      </div>

      <div ref={sentinelRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
      </div>
    </>
  );
};

export default SwitchCardGrid;
