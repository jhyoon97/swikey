/**
 * 스위치 리서치 데이터를 Notion DB에 업로드하는 범용 스크립트
 * 사용법: node scripts/upload-switches.mjs <markdown-file-path>
 * 예시:   node scripts/upload-switches.mjs docs/hmx-switches-research.md
 */

import { Client } from '@notionhq/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import 'dotenv/config';

const notion = new Client({ auth: process.env.NOTION_AUTH_KEY });
const DB_ID = process.env.NOTION_SWITCHES_DB_ID;

function parseNumber(val) {
  if (!val || val.trim() === '-') return undefined;
  const cleaned = val.trim().split('/')[0].trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

function parseBoolean(val) {
  if (!val) return undefined;
  const v = val.trim().toLowerCase();
  if (v === 'yes') return true;
  if (v === 'no') return false;
  if (v === 'partial') return true;
  return undefined;
}

function parseMountPins(val) {
  const num = parseNumber(val);
  if (num === 5 || num === 3) return String(num);
  return '없음';
}

function parseSwitchType(val) {
  if (!val) return '리니어';
  const v = val.trim();
  if (v.includes('택타일')) return '택타일';
  if (v.includes('리니어')) return '리니어';
  if (v.includes('hall effect')) return 'hall effect';
  return '리니어';
}

function parseString(val) {
  if (!val || val.trim() === '-') return undefined;
  return val.trim();
}

function parseMarkdownTables(content) {
  const switches = [];
  const lines = content.split('\n');

  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect table header row (새 포맷: 콜라보업체 포함)
    if (trimmed.startsWith('| 이름 |')) {
      inTable = true;
      continue;
    }

    // Skip separator row
    if (inTable && trimmed.match(/^\|[\s-|]+\|$/)) {
      continue;
    }

    // Parse data row
    if (inTable && trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length);

      if (cells.length >= 15) {
        // 새 포맷: 이름 | 제조사 | 콜라보업체 | 스위치타입 | ... | 출처
        switches.push({
          name: cells[0],
          manufacturer: cells[1],
          collaborator: cells[2],
          type: cells[3],
          upperHousingMaterial: cells[4],
          lowerHousingMaterial: cells[5],
          stemMaterial: cells[6],
          factoryLubed: cells[7],
          springLength: cells[8],
          mountPins: cells[9],
          travel: cells[10],
          actuationPoint: cells[11],
          actuationForce: cells[12],
          initialForce: cells[13],
          bottomForce: cells[14],
          source: cells[15],
        });
      }
    }

    // End of table
    if (inTable && !trimmed.startsWith('|') && trimmed !== '') {
      inTable = false;
    }
  }

  return switches;
}

function buildProperties(sw) {
  const props = {
    '이름': { title: [{ text: { content: sw.name } }] },
    '상태': { status: { name: '게시됨' } },
  };

  const manufacturer = parseString(sw.manufacturer);
  if (manufacturer) {
    props['제조사'] = { rich_text: [{ text: { content: manufacturer } }] };
  }

  const collaborator = parseString(sw.collaborator);
  if (collaborator) {
    props['콜라보업체'] = { rich_text: [{ text: { content: collaborator } }] };
  }

  props['스위치타입'] = { select: { name: parseSwitchType(sw.type) } };

  const upperHousing = parseString(sw.upperHousingMaterial);
  if (upperHousing) {
    props['상부하우징재질'] = { rich_text: [{ text: { content: upperHousing } }] };
  }

  const lowerHousing = parseString(sw.lowerHousingMaterial);
  if (lowerHousing) {
    props['하부하우징재질'] = { rich_text: [{ text: { content: lowerHousing } }] };
  }

  const stem = parseString(sw.stemMaterial);
  if (stem) {
    props['스템재질'] = { rich_text: [{ text: { content: stem } }] };
  }

  const lubed = parseBoolean(sw.factoryLubed);
  if (lubed !== undefined) {
    props['공장윤활'] = { checkbox: lubed };
  }

  const springLen = parseNumber(sw.springLength);
  if (springLen !== undefined) {
    props['스프링길이'] = { number: springLen };
  }

  props['마운트핀'] = { select: { name: parseMountPins(sw.mountPins) } };

  const travel = parseNumber(sw.travel);
  if (travel !== undefined) {
    props['트래블'] = { number: travel };
  }

  const actPoint = parseNumber(sw.actuationPoint);
  if (actPoint !== undefined) {
    props['입력지점'] = { number: actPoint };
  }

  const actForce = parseNumber(sw.actuationForce);
  if (actForce !== undefined) {
    props['입력압'] = { number: actForce };
  }

  const initForce = parseNumber(sw.initialForce);
  if (initForce !== undefined) {
    props['초기압'] = { number: initForce };
  }

  const bottomForce = parseNumber(sw.bottomForce);
  if (bottomForce !== undefined) {
    props['바닥압'] = { number: bottomForce };
  }

  const source = parseString(sw.source);
  if (source) {
    props['출처'] = { url: source };
  }

  return props;
}

async function uploadSwitch(sw, index, total) {
  const properties = buildProperties(sw);
  try {
    const page = await notion.pages.create({
      parent: { database_id: DB_ID },
      properties,
    });
    console.log(`[${index + 1}/${total}] ✅ ${sw.name} (${page.id})`);
    return { success: true, name: sw.name };
  } catch (err) {
    console.error(`[${index + 1}/${total}] ❌ ${sw.name}: ${err.message}`);
    return { success: false, name: sw.name, error: err.message };
  }
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node scripts/upload-switches.mjs <markdown-file-path>');
    console.error('Example: node scripts/upload-switches.mjs docs/hmx-switches-research.md');
    process.exit(1);
  }

  const resolvedPath = resolve(filePath);
  const content = readFileSync(resolvedPath, 'utf-8');
  const switches = parseMarkdownTables(content);

  if (switches.length === 0) {
    console.error('파싱된 스위치가 없습니다. 파일 포맷을 확인하세요.');
    process.exit(1);
  }

  console.log(`\n📋 총 ${switches.length}개의 스위치를 Notion DB에 업로드합니다.`);
  console.log(`📄 파일: ${resolvedPath}`);
  console.log(`🗄️  DB ID: ${DB_ID}\n`);

  const results = [];

  for (let i = 0; i < switches.length; i++) {
    const result = await uploadSwitch(switches[i], i, switches.length);
    results.push(result);

    // Rate limit: wait 350ms between requests
    if (i < switches.length - 1) {
      await new Promise(r => setTimeout(r, 350));
    }
  }

  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n📊 업로드 완료: 성공 ${succeeded}개, 실패 ${failed}개`);

  if (failed > 0) {
    console.log('\n실패한 스위치:');
    results.filter(r => !r.success).forEach(r => console.log(`  - ${r.name}: ${r.error}`));
    process.exit(1);
  }
}

main().catch(console.error);
