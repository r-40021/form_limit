export interface QuestionList {
  id: string;
  items: [];
}

export interface QuestionListItems {
  id: number;
  title: string
  type: string;
  choices: string[] | []
}

export interface SaveData {
  id: number;
  display: string;
  limit: LimitList;
}

export interface LimitList {
  [key: string]: number
}

export interface TmpLimitData {
  [key: number]: LimitList;
}