'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '../axios';
import type { KeyboardSwitch, SwitchFilters } from '@/types/switch';
import type { PaginatedSwitches } from '@/lib/notion/switches';

export const useSwitches = () => {
  return useQuery<KeyboardSwitch[]>({
    queryKey: ['switches'],
    queryFn: async () => {
      const { data } = await api.get('/switches');
      return data;
    },
  });
};


export const useSearchSwitches = (filters: SwitchFilters) => {
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

  const filterString = params.toString();

  return useInfiniteQuery<PaginatedSwitches>({
    queryKey: ['switches', 'search', filterString],
    queryFn: async ({ pageParam }) => {
      const sep = filterString ? '&' : '';
      const cursorParam = pageParam ? `${sep}cursor=${pageParam}` : '';
      const { data } = await api.get(`/switches/search?${filterString}${cursorParam}`);
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  });
};
