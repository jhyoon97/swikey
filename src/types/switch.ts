export type SwitchType = '리니어' | '택타일' | '클릭키' | 'hall effect';
export type MountPins = 5 | 3 | 0;
export type SwitchStatus = '게시됨' | '검토중';

export interface KeyboardSwitch {
  id: string;
  slug: string;
  name: string;
  nameKo?: string;
  manufacturer?: string;
  collaborator?: string;
  type: SwitchType;
  upperHousingMaterial?: string;
  lowerHousingMaterial?: string;
  stemMaterial?: string;
  silent: boolean;
  lowProfile: boolean;
  factoryLubed: boolean;
  springLength?: number;
  mountPins: MountPins;
  travel?: number;
  actuationPoint?: number;
  pressure: {
    actuation?: number;
    initial?: number;
    bottom?: number;
  };
  status: SwitchStatus;
  source?: string;
  createdAt: string;
}

export type CommentType = '한줄평' | '빌드공유';

export interface SwitchComment {
  id: string;
  content: string;
  author: string;
  switchId: string;
  type: CommentType;
  createdAt: string;
}

export type SortBy = '이름' | '입력압' | '초기압' | '바닥압';
export type SortDirection = 'ascending' | 'descending';

export interface SwitchFilters {
  query?: string;
  type?: SwitchType;
  manufacturer?: string;
  mountPins?: MountPins;
  silent?: boolean;
  lowProfile?: boolean;
  factoryLubed?: boolean;
  actuationMin?: number;
  actuationMax?: number;
  initialMin?: number;
  initialMax?: number;
  bottomMin?: number;
  bottomMax?: number;
  travelMin?: number;
  travelMax?: number;
  sortBy?: SortBy;
  sortDirection?: SortDirection;
}

