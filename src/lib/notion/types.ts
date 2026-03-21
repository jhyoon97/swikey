import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { KeyboardSwitch, MountPins, SwitchComment, SwitchType, CommentType } from '@/types/switch';
import { nameToSlug } from '@/lib/utils';

type Properties = PageObjectResponse['properties'];
type PropertyValue = Properties[string];

const getRichText = (prop: PropertyValue): string | undefined => {
  if (prop.type === 'rich_text' && prop.rich_text.length > 0) {
    return prop.rich_text.map((t) => t.plain_text).join('');
  }
  return undefined;
};

const getTitle = (prop: PropertyValue): string => {
  if (prop.type === 'title' && prop.title.length > 0) {
    return prop.title.map((t) => t.plain_text).join('');
  }
  return '';
};

const getNumber = (prop: PropertyValue): number | undefined => {
  if (prop.type === 'number' && prop.number !== null) {
    return prop.number;
  }
  return undefined;
};

const getCheckbox = (prop: PropertyValue): boolean => {
  if (prop.type === 'checkbox') {
    return prop.checkbox;
  }
  return false;
};

const getSelect = (prop: PropertyValue): string | undefined => {
  if (prop.type === 'select' && prop.select) {
    return prop.select.name;
  }
  return undefined;
};

const getStatus = (prop: PropertyValue): string | undefined => {
  if (prop.type === 'status' && prop.status) {
    return prop.status.name;
  }
  return undefined;
};

const getUrl = (prop: PropertyValue): string | undefined => {
  if (prop.type === 'url') {
    return prop.url ?? undefined;
  }
  return undefined;
};

const getFiles = (prop: PropertyValue): string | undefined => {
  if (prop.type === 'files' && prop.files.length > 0) {
    const file = prop.files[0];
    if (file.type === 'external') return file.external.url;
    if (file.type === 'file') return file.file.url;
  }
  return undefined;
};

const getDate = (prop: PropertyValue): string | undefined => {
  if (prop.type === 'date' && prop.date) {
    return prop.date.start;
  }
  return undefined;
};

const getRelation = (prop: PropertyValue): string | undefined => {
  if (prop.type === 'relation' && prop.relation.length > 0) {
    return prop.relation[0].id;
  }
  return undefined;
};

export const mapPageToSwitch = (page: PageObjectResponse): KeyboardSwitch => {
  const props = page.properties;

  const mountPinsRaw = getSelect(props['마운트핀']);
  let mountPins: MountPins = 0;
  if (mountPinsRaw === '5') mountPins = 5;
  else if (mountPinsRaw === '3') mountPins = 3;

  const typeRaw = getSelect(props['스위치타입']);
  let type: SwitchType = '리니어';
  if (typeRaw === '택타일') type = '택타일';
  else if (typeRaw === 'hall effect') type = 'hall effect';

  const name = getTitle(props['이름']);

  return {
    id: page.id,
    slug: nameToSlug(name),
    name,
    manufacturer: getRichText(props['제조사']),
    collaborator: getRichText(props['콜라보업체']),
    image: getFiles(props['이미지']),
    type,
    upperHousingMaterial: getRichText(props['상부하우징재질']),
    lowerHousingMaterial: getRichText(props['하부하우징재질']),
    stemMaterial: getRichText(props['스템재질']),
    factoryLubed: getCheckbox(props['공장윤활']),
    springLength: getNumber(props['스프링길이']),
    mountPins,
    travel: getNumber(props['트래블']),
    actuationPoint: getNumber(props['입력지점']),
    pressure: {
      actuation: getNumber(props['입력압']),
      initial: getNumber(props['초기압']),
      bottom: getNumber(props['바닥압']),
    },
    status: (getStatus(props['상태']) as KeyboardSwitch['status']) ?? '게시됨',
    soundUrl: getUrl(props['타건음URL']),
    source: getUrl(props['출처']),
    createdAt: page.created_time,
  };
};

export const mapPageToComment = (page: PageObjectResponse): SwitchComment => {
  const props = page.properties;

  return {
    id: page.id,
    content: getTitle(props['내용']),
    author: getRichText(props['작성자']) ?? '익명',
    switchId: getRelation(props['스위치']) ?? '',
    type: (getSelect(props['타입']) as CommentType) ?? '한줄평',
    soundUrl: getUrl(props['타건음URL']),
    createdAt: getDate(props['작성일']) ?? page.created_time,
  };
};
