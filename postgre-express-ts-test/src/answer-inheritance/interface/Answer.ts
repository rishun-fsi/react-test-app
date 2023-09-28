export interface Answer {
  questionId: number;
  itemId?: number;
  textAnswer?: string;
}

export interface FetchedAnswer {
  answer_id: number;
  question_id: number;
  item_id: number;
  text_answer: string;
}
