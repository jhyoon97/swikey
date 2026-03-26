import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { SwitchType } from '@/types/switch';

export const switchTypeColor: Record<SwitchType, string> = {
  '리니어': 'bg-switch-linear text-white',
  '택타일': 'bg-switch-tactile text-white',
  '클릭키': 'bg-switch-clicky text-white',
  'hall effect': 'bg-switch-hall text-white',
};

export const switchTypeLabelKey: Record<SwitchType, string> = {
  '리니어': 'switch.linear',
  '택타일': 'switch.tactile',
  '클릭키': 'switch.clicky',
  'hall effect': 'switch.hallEffect',
};

export const MANUFACTURERS = [
  'AEBoards',
  'BSUN',
  'Cherry',
  'DrunkDeer',
  'Gateron',
  'Glorious',
  'GravaStar',
  'HMX',
  'Huano',
  'Jerrzi',
  'JWK',
  'Kailh',
  'Keygeek',
  'KTT',
  'MMD',
  'Outemu',
  'SWK',
  'Tecsee',
  'TTC',
  'WEKT',
  'Wingtree',
  'Wooting',
  'Wuque Studio',
] as const;

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ()\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
