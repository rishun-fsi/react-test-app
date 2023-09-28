export interface PostResponse {
  userId: string;
  questionnairId: number;
  metadataId: number;
  createdDate: Date;
}

export interface GetResponseItem {
  id: number;
  name: string;
}

export interface GetResponseHeader {
  id: number;
  items?: GetResponseItem[];
  name: string;
}

export interface GetResponseAnswer {
  answer: GetResponseAnswerPerQuestion[];
  metadataId: number;
  answeredDate: string;
  userId: string;
  updateUser: string;
  updatedDate: string;
}

export interface GetResponseAnswerPerQuestion {
  id: number;
  itemId?: number;
  itemName?: string;
  textAnswer?: string;
}

export interface GetResponse {
  headers: GetResponseHeader[];
  answers: GetResponseAnswer[];
  totalCount: number;
}

export interface PutResponse {
  userId: string;
  questionnairId: number;
  metadataId: number;
  updatedDate: string;
  deleteIds: number[];
}

export interface DeleteResponse {
  deleted: number[];
}

export interface ChunkPutResponse {
  message: string;
  edited?: number[];
  inserted?: number[];
}

export interface ChunkPostAnswerPerQuestion {
  answerId: number;
  questionId: number;
  itemId?: number;
  textAnswer?: string;
}

export interface ChunkPostAnswerMetadata {
  metadataId: number;
  questionnairId: number;
  userId: string;
  createdDate: string;
  updatedDate: string;
  updateUser?: string;
}

export type ChunkPostAnswer = {
  answers: ChunkPostAnswerPerQuestion[];
} & ChunkPostAnswerMetadata;

export interface ChunkPostResponse {
  message: string;
  answers: ChunkPostAnswer[];
}
