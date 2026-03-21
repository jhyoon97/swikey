'use client';

import { useQuery } from '@tanstack/react-query';
import api from '../axios';
import type { KeyboardSwitch, SwitchFilters } from '@/types/switch';

export const useSwitches = () => {
  return useQuery<KeyboardSwitch[]>({
    queryKey: ['switches'],
    queryFn: async () => {
      const { data } = await api.get('/switches');
      return data;
    },
  });
};

export const useManufacturers = () => {
  return useQuery<string[]>({
    queryKey: ['switches', 'manufacturers'],
    queryFn: async () => {
      const { data } = await api.get('/switches/manufacturers');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchSwitches = (filters: SwitchFilters) => {
  const params = new URLSearchParams();
  if (filters.query) params.set('q', filters.query);
  if (filters.type) params.set('type', filters.type);
  if (filters.manufacturer) params.set('manufacturer', filters.manufacturer);
  if (filters.mountPins !== undefined) params.set('mountPins', String(filters.mountPins));
  if (filters.factoryLubed !== undefined) params.set('factoryLubed', String(filters.factoryLubed));
  if (filters.actuationMin !== undefined) params.set('actuationMin', String(filters.actuationMin));
  if (filters.actuationMax !== undefined) params.set('actuationMax', String(filters.actuationMax));
  if (filters.travelMin !== undefined) params.set('travelMin', String(filters.travelMin));
  if (filters.travelMax !== undefined) params.set('travelMax', String(filters.travelMax));

  const queryString = params.toString();

  return useQuery<KeyboardSwitch[]>({
    queryKey: ['switches', 'search', queryString],
    queryFn: async () => {
      const { data } = await api.get(`/switches/search?${queryString}`);
      return data;
    },
  });
};
