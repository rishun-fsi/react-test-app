export interface HeaderItems {
  id: number;
  name: string;
}

export interface AnswersTableHeader {
  id: number;
  items?: HeaderItems[];
  name: string;
  itemId?: number;
}

export interface AnswerPerQuestion {
  id: number;
  itemId?: number;
  itemName?: string;
  textAnswer?: string;
}

export interface AnswersTableMetaData {
  answer: AnswerPerQuestion[];
  metadataId: number;
  answeredDate: string;
  userId: string;
  updateUser: string;
  updatedDate: string;
}

export interface AnswersTableResponse {
  headers: AnswersTableHeader[];
  answers: AnswersTableMetaData[];
  totalCount: number;
}
