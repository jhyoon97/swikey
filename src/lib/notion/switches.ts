import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { getNotionClient, SWITCHES_DB_ID } from './client';
import { mapPageToSwitch } from './types';
import type { KeyboardSwitch, SwitchFilters, SubmitSwitchData } from '@/types/switch';
import { nameToSlug } from '@/lib/utils';

export const getSwitches = async (pageSize = 50): Promise<KeyboardSwitch[]> => {
  const notion = getNotionClient();
  const response = await notion.databases.query({
    database_id: SWITCHES_DB_ID,
    filter: {
      property: '상태',
      status: { equals: '게시됨' },
    },
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: pageSize,
  });

  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(mapPageToSwitch);
};

export const getSwitchById = async (id: string): Promise<KeyboardSwitch | null> => {
  const notion = getNotionClient();
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    if (!('properties' in page)) return null;
    return mapPageToSwitch(page as PageObjectResponse);
  } catch {
    return null;
  }
};

export const getSwitchBySlug = async (slug: string): Promise<KeyboardSwitch | null> => {
  const notion = getNotionClient();

  // slug에서 대략적인 검색어 추출 (하이픈→공백)하여 Notion 필터로 후보 축소
  const searchHint = decodeURIComponent(slug).replace(/-/g, ' ').slice(0, 20);

  const response = await notion.databases.query({
    database_id: SWITCHES_DB_ID,
    filter: {
      and: [
        { property: '상태', status: { equals: '게시됨' } },
        { property: '이름', title: { contains: searchHint.split(' ')[0] } },
      ],
    },
    page_size: 100,
  });

  const pages = response.results.filter(
    (page): page is PageObjectResponse => 'properties' in page,
  );

  for (const page of pages) {
    const sw = mapPageToSwitch(page);
    if (sw.slug === decodeURIComponent(slug)) return sw;
  }

  // 힌트 검색으로 못 찾은 경우 전체 조회 fallback
  const allSwitches = await getSwitches(100);
  return allSwitches.find((sw) => sw.slug === decodeURIComponent(slug)) ?? null;
};

export const searchSwitches = async (filters: SwitchFilters): Promise<KeyboardSwitch[]> => {
  const notion = getNotionClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions: any[] = [
    { property: '상태', status: { equals: '게시됨' } },
  ];

  if (filters.query) {
    conditions.push({
      property: '이름',
      title: { contains: filters.query },
    });
  }

  if (filters.manufacturer) {
    conditions.push({
      property: '제조사',
      rich_text: { equals: filters.manufacturer },
    });
  }

  if (filters.type) {
    conditions.push({
      property: '스위치타입',
      select: { equals: filters.type },
    });
  }

  if (filters.mountPins !== undefined) {
    const pinValue = filters.mountPins === 0 ? '없음' : String(filters.mountPins);
    conditions.push({
      property: '마운트핀',
      select: { equals: pinValue },
    });
  }

  if (filters.factoryLubed !== undefined) {
    conditions.push({
      property: '공장윤활',
      checkbox: { equals: filters.factoryLubed },
    });
  }

  if (filters.actuationMin !== undefined) {
    conditions.push({
      property: '입력압',
      number: { greater_than_or_equal_to: filters.actuationMin },
    });
  }

  if (filters.actuationMax !== undefined) {
    conditions.push({
      property: '입력압',
      number: { less_than_or_equal_to: filters.actuationMax },
    });
  }

  if (filters.travelMin !== undefined) {
    conditions.push({
      property: '트래블',
      number: { greater_than_or_equal_to: filters.travelMin },
    });
  }

  if (filters.travelMax !== undefined) {
    conditions.push({
      property: '트래블',
      number: { less_than_or_equal_to: filters.travelMax },
    });
  }

  const response = await notion.databases.query({
    database_id: SWITCHES_DB_ID,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter: (conditions.length > 1 ? { and: conditions } : conditions[0]) as any,
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: 100,
  });

  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(mapPageToSwitch);
};

export const getManufacturers = async (): Promise<string[]> => {
  const switches = await getSwitches(100);
  const manufacturers = new Set<string>();
  for (const sw of switches) {
    if (sw.manufacturer) {
      manufacturers.add(sw.manufacturer);
    }
  }
  return Array.from(manufacturers).sort();
};

export const submitSwitch = async (data: SubmitSwitchData): Promise<string> => {
  const notion = getNotionClient();

  const properties: Record<string, unknown> = {
    '이름': { title: [{ text: { content: data.name } }] },
    '상태': { status: { name: '제보(대기중)' } },
  };

  if (data.manufacturer) {
    properties['제조사'] = { rich_text: [{ text: { content: data.manufacturer } }] };
  }
  if (data.collaborator) {
    properties['콜라보업체'] = { rich_text: [{ text: { content: data.collaborator } }] };
  }
  if (data.type) {
    properties['스위치타입'] = { select: { name: data.type } };
  }
  if (data.upperHousingMaterial) {
    properties['상부하우징재질'] = { rich_text: [{ text: { content: data.upperHousingMaterial } }] };
  }
  if (data.lowerHousingMaterial) {
    properties['하부하우징재질'] = { rich_text: [{ text: { content: data.lowerHousingMaterial } }] };
  }
  if (data.stemMaterial) {
    properties['스템재질'] = { rich_text: [{ text: { content: data.stemMaterial } }] };
  }
  if (data.factoryLubed !== undefined) {
    properties['공장윤활'] = { checkbox: data.factoryLubed };
  }
  if (data.springLength !== undefined) {
    properties['스프링길이'] = { number: data.springLength };
  }
  if (data.mountPins !== undefined) {
    const pinValue = data.mountPins === 0 ? '없음' : String(data.mountPins);
    properties['마운트핀'] = { select: { name: pinValue } };
  }
  if (data.travel !== undefined) {
    properties['트래블'] = { number: data.travel };
  }
  if (data.actuationPoint !== undefined) {
    properties['입력지점'] = { number: data.actuationPoint };
  }
  if (data.actuationForce !== undefined) {
    properties['입력압'] = { number: data.actuationForce };
  }
  if (data.initialForce !== undefined) {
    properties['초기압'] = { number: data.initialForce };
  }
  if (data.bottomForce !== undefined) {
    properties['바닥압'] = { number: data.bottomForce };
  }
  if (data.imageUrl) {
    properties['이미지'] = {
      files: [{ type: 'external', name: 'switch-image', external: { url: data.imageUrl } }],
    };
  }
  if (data.soundUrl) {
    properties['타건음URL'] = { url: data.soundUrl };
  }
  if (data.source) {
    properties['출처'] = { url: data.source };
  }

  const page = await notion.pages.create({
    parent: { database_id: SWITCHES_DB_ID },
    properties: properties as never,
  });

  return page.id;
};
