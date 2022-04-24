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