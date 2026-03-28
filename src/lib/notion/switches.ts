import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import type { KeyboardSwitch, SwitchFilters } from '@/types/switch';

import { SWITCHES_DB_ID, getNotionClient } from './client';
import { mapPageToSwitch } from './types';

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

export const getSwitchById = async (
  id: string,
): Promise<KeyboardSwitch | null> => {
  const notion = getNotionClient();
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    if (!('properties' in page)) return null;
    return mapPageToSwitch(page as PageObjectResponse);
  } catch {
    return null;
  }
};

export const getSwitchBySlug = async (
  slug: string,
): Promise<KeyboardSwitch | null> => {
  const notion = getNotionClient();
  const decodedSlug = decodeURIComponent(slug);

  // slug 프로퍼티로 직접 검색
  const response = await notion.databases.query({
    database_id: SWITCHES_DB_ID,
    filter: {
      and: [
        { property: '상태', status: { equals: '게시됨' } },
        { property: 'slug', rich_text: { equals: decodedSlug } },
      ],
    },
    page_size: 1,
  });

  const pages = response.results.filter(
    (page): page is PageObjectResponse => 'properties' in page,
  );

  if (pages.length > 0) {
    return mapPageToSwitch(pages[0]);
  }

  // fallback: slug 프로퍼티가 없는 기존 데이터 호환
  const allSwitches = await getSwitches(100);
  return allSwitches.find((sw) => sw.slug === decodedSlug) ?? null;
};

export interface PaginatedSwitches {
  switches: KeyboardSwitch[];
  nextCursor: string | null;
  hasMore: boolean;
}

export const searchSwitches = async (
  filters: SwitchFilters,
  cursor?: string,
  pageSize = 20,
): Promise<PaginatedSwitches> => {
  const notion = getNotionClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions: any[] = [
    { property: '상태', status: { equals: '게시됨' } },
  ];

  if (filters.query) {
    conditions.push({
      or: [
        { property: '이름', title: { contains: filters.query } },
        { property: '한글이름', rich_text: { contains: filters.query } },
      ],
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
    const pinValue =
      filters.mountPins === 0 ? '없음' : String(filters.mountPins);
    conditions.push({
      property: '마운트핀',
      select: { equals: pinValue },
    });
  }

  if (filters.silent !== undefined) {
    conditions.push({
      property: '저소음',
      checkbox: { equals: filters.silent },
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

  if (filters.initialMin !== undefined) {
    conditions.push({
      property: '초기압',
      number: { greater_than_or_equal_to: filters.initialMin },
    });
  }

  if (filters.initialMax !== undefined) {
    conditions.push({
      property: '초기압',
      number: { less_than_or_equal_to: filters.initialMax },
    });
  }

  if (filters.bottomMin !== undefined) {
    conditions.push({
      property: '바닥압',
      number: { greater_than_or_equal_to: filters.bottomMin },
    });
  }

  if (filters.bottomMax !== undefined) {
    conditions.push({
      property: '바닥압',
      number: { less_than_or_equal_to: filters.bottomMax },
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
    filter: (conditions.length > 1
      ? { and: conditions }
      : conditions[0]) as any,
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: pageSize,
    ...(cursor ? { start_cursor: cursor } : {}),
  });

  const switches = response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(mapPageToSwitch);

  return {
    switches,
    nextCursor: response.next_cursor ?? null,
    hasMore: response.has_more,
  };
};
