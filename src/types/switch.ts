export type SwitchType = '리니어' | '택타일' | 'hall effect';
export type MountPins = 5 | 3 | 0;
export type SwitchStatus = '게시됨' | '제보(대기중)' | '검토중';

export interface KeyboardSwitch {
  id: string;
  slug: string;
  name: string;
  manufacturer?: string;
  collaborator?: string;
  image?: string;
  type: SwitchType;
  upperHousingMaterial?: string;
  lowerHousingMaterial?: string;
  stemMaterial?: string;
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
  soundUrl?: string;
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
  soundUrl?: string;
  createdAt: string;
}

export interface SwitchFilters {
  query?: string;
  type?: SwitchType;
  manufacturer?: string;
  mountPins?: MountPins;
  factoryLubed?: boolean;
  actuationMin?: number;
  actuationMax?: number;
  travelMin?: number;
  travelMax?: number;
}

export interface SubmitSwitchData {
  name: string;
  manufacturer?: string;
  collaborator?: string;
  type?: SwitchType;
  upperHousingMaterial?: string;
  lowerHousingMaterial?: string;
  stemMaterial?: string;
  factoryLubed?: boolean;
  springLength?: number;
  mountPins?: MountPins;
  travel?: number;
  actuationPoint?: number;
  actuationForce?: number;
  initialForce?: number;
  bottomForce?: number;
  imageUrl?: string;
  soundUrl?: string;
  source?: string;
}
