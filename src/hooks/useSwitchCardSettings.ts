import { useEffect, useState } from 'react';

export interface SwitchCardProperty {
  key: string;
  enabled: boolean;
}

export const SWITCH_CARD_PROPERTY_OPTIONS = [
  'type',
  'manufacturer',
  'collaborator',
  'upperHousingMaterial',
  'lowerHousingMaterial',
  'stemMaterial',
  'silent',
  'factoryLubed',
  'springLength',
  'mountPins',
  'travel',
  'actuationPoint',
  'pressure.actuation',
  'pressure.initial',
  'pressure.bottom',
] as const;

export const PROPERTY_LABEL_KEYS: Record<string, string> = {
  type: 'switch.type',
  manufacturer: 'switch.manufacturer',
  collaborator: 'switch.collaborator',
  upperHousingMaterial: 'switch.upperHousing',
  lowerHousingMaterial: 'switch.lowerHousing',
  stemMaterial: 'switch.stemMaterial',
  silent: 'switch.silent',
  factoryLubed: 'switch.factoryLubed',
  springLength: 'switch.springLength',
  mountPins: 'switch.mountPins',
  travel: 'switch.travel',
  actuationPoint: 'switch.actuationPoint',
  'pressure.actuation': 'switch.actuationForce',
  'pressure.initial': 'switch.initialForce',
  'pressure.bottom': 'switch.bottomForce',
};

const STORAGE_KEY = 'switchCardProperties';
const SETTINGS_CHANGE_EVENT = 'switchCardSettingsChange';

const DEFAULT_ENABLED = [
  'type',
  'manufacturer',
  'pressure.actuation',
  'travel',
];

const DEFAULT_PROPERTIES: SwitchCardProperty[] =
  SWITCH_CARD_PROPERTY_OPTIONS.map((key) => ({
    key,
    enabled: DEFAULT_ENABLED.includes(key),
  }));

export function getSettings(): SwitchCardProperty[] {
  if (typeof window === 'undefined') return DEFAULT_PROPERTIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROPERTIES;
    const parsed = JSON.parse(raw) as { properties: SwitchCardProperty[] };
    const validKeys = new Set<string>(SWITCH_CARD_PROPERTY_OPTIONS);
    const storedKeys = new Set(parsed.properties.map((p) => p.key));
    return [
      ...parsed.properties.filter((p) => validKeys.has(p.key)),
      ...DEFAULT_PROPERTIES.filter((p) => !storedKeys.has(p.key)),
    ];
  } catch {
    return DEFAULT_PROPERTIES;
  }
}

export function saveSettings(properties: SwitchCardProperty[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ properties }));
  window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
}

export function useSwitchCardSettings() {
  const [properties, setProperties] =
    useState<SwitchCardProperty[]>(DEFAULT_PROPERTIES);

  useEffect(() => {
    setProperties(getSettings());
    const handler = () => setProperties(getSettings());
    window.addEventListener(SETTINGS_CHANGE_EVENT, handler);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, handler);
  }, []);

  return properties;
}
