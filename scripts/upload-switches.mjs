/**
 * 스위치 리서치 데이터를 Notion DB에 업로드하는 범용 스크립트
 * 사용법: node scripts/upload-switches.mjs <markdown-file-path>
 * 예시:   node scripts/upload-switches.mjs docs/hmx-switches-research.md
 */

import { Client } from '@notionhq/client';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
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
  if (v.includes('클릭키')) return '클릭키';
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

      if (cells.length >= 18) {
        // 새 포맷: 이름 | 한글이름 | 제조사 | 콜라보업체 | 스위치타입 | 저소음 | 로우프로파일 | ... | 출처
        switches.push({
          name: cells[0],
          nameKo: cells[1],
          manufacturer: cells[2],
          collaborator: cells[3],
          type: cells[4],
          silent: cells[5],
          lowProfile: cells[6],
          upperHousingMaterial: cells[7],
          lowerHousingMaterial: cells[8],
          stemMaterial: cells[9],
          factoryLubed: cells[10],
          springLength: cells[11],
          mountPins: cells[12],
          travel: cells[13],
          actuationPoint: cells[14],
          actuationForce: cells[15],
          initialForce: cells[16],
          bottomForce: cells[17],
          source: cells[18],
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

function nameToSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ()\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildProperties(sw) {
  const props = {
    '이름': { title: [{ text: { content: sw.name } }] },
    '상태': { status: { name: '게시됨' } },
    'slug': { rich_text: [{ text: { content: nameToSlug(sw.name) } }] },
  };

  const nameKo = parseString(sw.nameKo);
  if (nameKo) {
    props['한글이름'] = { rich_text: [{ text: { content: nameKo } }] };
  }

  const manufacturer = parseString(sw.manufacturer);
  if (manufacturer) {
    props['제조사'] = { rich_text: [{ text: { content: manufacturer } }] };
  }

  const collaborator = parseString(sw.collaborator);
  if (collaborator) {
    props['콜라보업체'] = { rich_text: [{ text: { content: collaborator } }] };
  }

  props['스위치타입'] = { select: { name: parseSwitchType(sw.type) } };

  const silent = parseBoolean(sw.silent);
  if (silent !== undefined) {
    props['저소음'] = { checkbox: silent };
  }

  const lowProfile = parseBoolean(sw.lowProfile);
  if (lowProfile !== undefined) {
    props['로우프로파일'] = { checkbox: lowProfile };
  }

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

async function findExistingSwitch(name) {
  const response = await notion.databases.query({
    database_id: DB_ID,
    filter: { property: '이름', title: { equals: name } },
    page_size: 1,
  });
  return response.results.length > 0 ? response.results[0] : null;
}

async function uploadSwitch(sw, index, total, { upsert = false } = {}) {
  const properties = buildProperties(sw);
  try {
    if (upsert) {
      const existing = await findExistingSwitch(sw.name);
      if (existing) {
        await notion.pages.update({
          page_id: existing.id,
          properties,
        });
        console.log(`[${index + 1}/${total}] 🔄 ${sw.name} (updated: ${existing.id})`);
        return { success: true, name: sw.name, action: 'updated' };
      }
    }
    const page = await notion.pages.create({
      parent: { database_id: DB_ID },
      properties,
    });
    console.log(`[${index + 1}/${total}] ✅ ${sw.name} (created: ${page.id})`);
    return { success: true, name: sw.name, action: 'created' };
  } catch (err) {
    console.error(`[${index + 1}/${total}] ❌ ${sw.name}: ${err.message}`);
    return { success: false, name: sw.name, error: err.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const upsert = args.includes('--upsert');
  const filePath = args.find(a => !a.startsWith('--'));

  if (!filePath) {
    console.error('Usage: node scripts/upload-switches.mjs <markdown-file-path> [--upsert]');
    console.error('Example: node scripts/upload-switches.mjs docs/hmx-switches-research.md');
    console.error('         node scripts/upload-switches.mjs docs/hmx-switches-research.md --upsert');
    console.error('\n--upsert: 이름이 같은 스위치가 있으면 업데이트, 없으면 생성');
    process.exit(1);
  }

  const resolvedPath = resolve(filePath);
  const content = readFileSync(resolvedPath, 'utf-8');
  const switches = parseMarkdownTables(content);

  if (switches.length === 0) {
    console.error('파싱된 스위치가 없습니다. 파일 포맷을 확인하세요.');
    process.exit(1);
  }

  const mode = upsert ? 'UPSERT (업데이트 또는 생성)' : 'CREATE (생성만)';
  console.log(`\n📋 총 ${switches.length}개의 스위치를 Notion DB에 업로드합니다.`);
  console.log(`📄 파일: ${resolvedPath}`);
  console.log(`🗄️  DB ID: ${DB_ID}`);
  console.log(`📝 모드: ${mode}\n`);

  const results = [];

  for (let i = 0; i < switches.length; i++) {
    const result = await uploadSwitch(switches[i], i, switches.length, { upsert });
    results.push(result);

    // Rate limit: wait 350ms between requests (upsert는 2배 대기 — 조회+업데이트)
    const delay = upsert ? 700 : 350;
    if (i < switches.length - 1) {
      await new Promise(r => setTimeout(r, delay));
    }
  }

  const created = results.filter(r => r.success && r.action === 'created').length;
  const updated = results.filter(r => r.success && r.action === 'updated').length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n📊 완료: 생성 ${created}개, 업데이트 ${updated}개, 실패 ${failed}개`);

  if (failed > 0) {
    console.log('\n실패한 스위치:');
    results.filter(r => !r.success).forEach(r => console.log(`  - ${r.name}: ${r.error}`));
    process.exit(1);
  }

  // 새 제조사가 있으면 MANUFACTURERS 배열에 자동 추가
  await syncManufacturers(switches);
}

async function syncManufacturers(switches) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const utilsPath = resolve(__dirname, '../src/lib/utils.ts');
  const utilsContent = readFileSync(utilsPath, 'utf-8');

  // 현재 MANUFACTURERS 배열 파싱
  const match = utilsContent.match(/export const MANUFACTURERS = \[\n([\s\S]*?)\] as const;/);
  if (!match) return;

  const existing = new Set(
    match[1].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) ?? []
  );

  // 업로드한 스위치들에서 제조사 추출
  const newManufacturers = new Set();
  for (const sw of switches) {
    const m = sw.manufacturer?.trim();
    if (m && m !== '-' && !existing.has(m)) {
      newManufacturers.add(m);
    }
  }

  if (newManufacturers.size === 0) return;

  // 기존 + 신규 합쳐서 정렬 후 교체
  const all = [...existing, ...newManufacturers].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  const newArray = all.map(m => `  '${m}',`).join('\n');
  const newContent = utilsContent.replace(
    /export const MANUFACTURERS = \[\n[\s\S]*?\] as const;/,
    `export const MANUFACTURERS = [\n${newArray}\n] as const;`,
  );

  writeFileSync(utilsPath, newContent, 'utf-8');
  console.log(`\n🏭 새 제조사 추가: ${[...newManufacturers].join(', ')}`);
  console.log(`   MANUFACTURERS 배열 업데이트 완료 (총 ${all.length}개)`);
}

main().catch(console.error);
