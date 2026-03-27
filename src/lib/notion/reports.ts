import type { SubmitSwitchData } from '@/types/switch';

import { REPORTS_DB_ID, getNotionClient } from './client';

export const submitReport = async (data: SubmitSwitchData): Promise<string> => {
  const notion = getNotionClient();

  const properties: Record<string, unknown> = {
    '스위치 이름': { title: [{ text: { content: data.name } }] },
  };

  if (data.source) {
    properties['출처'] = { rich_text: [{ text: { content: data.source } }] };
  }

  const page = await notion.pages.create({
    parent: { database_id: REPORTS_DB_ID },
    properties: properties as never,
  });

  return page.id;
};
