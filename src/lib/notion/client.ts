import { Client } from '@notionhq/client';

let notionClient: Client | null = null;

export const getNotionClient = (): Client => {
  if (!notionClient) {
    notionClient = new Client({
      auth: process.env.NOTION_AUTH_KEY,
    });
  }
  return notionClient;
};

export const SWITCHES_DB_ID = process.env.NOTION_SWITCHES_DB_ID!;
export const COMMENTS_DB_ID = process.env.NOTION_COMMENTS_DB_ID!;
