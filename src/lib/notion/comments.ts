import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import type { CommentType, SwitchComment } from '@/types/switch';

import { COMMENTS_DB_ID, getNotionClient } from './client';
import { mapPageToComment } from './types';

export const getCommentsBySwitch = async (
  switchId: string,
): Promise<SwitchComment[]> => {
  const notion = getNotionClient();
  const response = await notion.databases.query({
    database_id: COMMENTS_DB_ID,
    filter: {
      property: '스위치',
      relation: { contains: switchId },
    },
    sorts: [{ property: '작성일', direction: 'descending' }],
  });

  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(mapPageToComment);
};

export const createComment = async (
  switchId: string,
  content: string,
  author: string,
  type: CommentType,
  soundUrl?: string,
): Promise<string> => {
  const notion = getNotionClient();

  const properties: Record<string, unknown> = {
    내용: { title: [{ text: { content } }] },
    작성자: { rich_text: [{ text: { content: author || '익명' } }] },
    스위치: { relation: [{ id: switchId }] },
    타입: { select: { name: type } },
    작성일: { date: { start: new Date().toISOString() } },
  };

  if (soundUrl) {
    properties['타건음URL'] = { url: soundUrl };
  }

  const page = await notion.pages.create({
    parent: { database_id: COMMENTS_DB_ID },
    properties: properties as never,
  });

  return page.id;
};
