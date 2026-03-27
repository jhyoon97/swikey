/**
 * Notion 스위치 DB에서 전체 스위치를 조회하여 이미지 다운로드 체크리스트를 생성합니다.
 * 사용법: node scripts/export-switch-image-checklist.mjs
 * 출력:   docs/switch-image-checklist.md
 */

import { Client } from '@notionhq/client';
import { writeFileSync } from 'fs';
import 'dotenv/config';

const notion = new Client({ auth: process.env.NOTION_AUTH_KEY });
const DB_ID = process.env.NOTION_SWITCHES_DB_ID;

function getTextProperty(page, name) {
  const prop = page.properties[name];
  if (!prop) return '';
  if (prop.type === 'title') return prop.title.map(t => t.plain_text).join('');
  if (prop.type === 'rich_text') return prop.rich_text.map(t => t.plain_text).join('');
  if (prop.type === 'url') return prop.url || '';
  return '';
}

async function fetchAllSwitches() {
  const switches = [];
  let cursor = undefined;

  while (true) {
    const response = await notion.databases.query({
      database_id: DB_ID,
      filter: { property: '상태', status: { equals: '게시됨' } },
      sorts: [{ property: '제조사', direction: 'ascending' }],
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });

    for (const page of response.results) {
      if (!('properties' in page)) continue;
      switches.push({
        name: getTextProperty(page, '이름'),
        slug: getTextProperty(page, 'slug'),
        manufacturer: getTextProperty(page, '제조사'),
        source: getTextProperty(page, '출처'),
      });
    }

    if (!response.has_more) break;
    cursor = response.next_cursor;
  }

  return switches;
}

function buildMarkdown(switches) {
  const grouped = {};
  for (const sw of switches) {
    const key = sw.manufacturer || '기타';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(sw);
  }

  let md = '# 스위치 이미지 다운로드 체크리스트\n\n';
  md += `> 생성일: ${new Date().toISOString().split('T')[0]}\n`;
  md += `> 총 ${switches.length}개 스위치\n\n`;

  const sortedManufacturers = Object.keys(grouped).sort();
  for (const manufacturer of sortedManufacturers) {
    const items = grouped[manufacturer];
    md += `## ${manufacturer} (${items.length})\n\n`;
    for (const sw of items) {
      md += `- [ ] ${sw.slug} | ${sw.name} | ${sw.source}\n`;
    }
    md += '\n';
  }

  return md;
}

async function main() {
  console.log('Notion DB에서 스위치 조회 중...');
  const switches = await fetchAllSwitches();
  console.log(`총 ${switches.length}개 스위치 조회 완료`);

  const md = buildMarkdown(switches);
  const outPath = 'docs/switch-image-checklist.md';
  writeFileSync(outPath, md, 'utf-8');
  console.log(`체크리스트 생성 완료: ${outPath}`);
}

main().catch(console.error);
