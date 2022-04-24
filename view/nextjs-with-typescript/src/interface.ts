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
  limit: Array<LimitList>
}

export interface LimitList {
  choiceTitle: string;
  Limit: number
}