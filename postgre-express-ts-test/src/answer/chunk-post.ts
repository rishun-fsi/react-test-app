import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import {
  ChunkPostAnswerMetadata,
  ChunkPostAnswerPerQuestion,
  ChunkPostAnswer,
  ChunkPostResponse
} from './interface/Response';
import { formatDate } from './common';

const formatMetadata = (record: any): ChunkPostAnswerMetadata => ({
  metadataId: record.metadata_id,
  questionnairId: record.questionnair_id,
  createdDate: formatDate(record.created_date),
  userId: record.user_id,
  updatedDate: formatDate(record.updated_date),
  updateUser: record.update_user ? record.update_user : undefined
});

const formatAnswerPerQuestion = (record: any): ChunkPostAnswerPerQuestion => ({
  answerId: record.answer_id,
  questionId: record.question_id,
  itemId: record.item_id ? record.item_id : undefined,
  textAnswer: record.text_answer ? record.text_answer : undefined
});

const fetchAnswers = async (
  metadataIds: number[],
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<ChunkPostResponse> => {
  const selectClause: string =
    'SELECT am.id AS metadata_id, am.questionnair_id, am.created_date, am.user_id, am.update_user, am.updated_date, a.id AS answer_id, a.question_id, a.item_id, a.text_answer FROM answer_metadata AS am ' +
    'INNER JOIN answers AS a ON am.id = a.metadata_id';
  const conditions: string[] = metadataIds.map(
    (_, index: number) => `$${index + 1}`
  );
  const query: string = `${selectClause} WHERE am.id IN (${conditions.join(
    ','
  )}) ORDER BY am.id, a.id;`;

  const answers: ChunkPostAnswer[] = await db
    .any(query, metadataIds)
    .then((data) => {
      const fetchedMetadataIds: number[] = [
        ...new Set(data.map((datum) => datum.metadata_id))
      ];

      return fetchedMetadataIds.map((metadataId: number) => {
        const representativeRecord: ChunkPostAnswerMetadata = formatMetadata(
          data.find((record) => record.metadata_id === metadataId)
        );
        const answers: ChunkPostAnswerPerQuestion[] = data
          .filter((record) => record.metadata_id === metadataId)
          .map(formatAnswerPerQuestion);

        return { ...representativeRecord, answers };
      });
    });

  return { message: 'success', answers };
};

export const createChunkPostResponseBody = async (
  metadataIds: number[],
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: ChunkPostResponse }> => {
  const response: ChunkPostResponse = await fetchAnswers(metadataIds, db);
  return { statusCode: 200, body: response };
};
