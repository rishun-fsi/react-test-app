import * as pgPromise from 'pg-promise';
import { DbAnswer, UpdatingDbAnswer, AnswerMetadata } from './interface/Answer';

const pgp = pgPromise({});

export const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${(
    '0' + date.getDate()
  ).slice(-2)}`;
};

export const insertAnswerMetadata = async (
  metadata: AnswerMetadata,
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
): Promise<number> => {
  const answerMetadataColumnSet = new pgp.helpers.ColumnSet([
    'created_date',
    'updated_date',
    'user_id',
    'questionnair_id'
  ]);

  const metadataInsertquery = pgp.helpers.insert(
    metadata,
    answerMetadataColumnSet,
    'answer_metadata'
  );

  return await t
    .one(metadataInsertquery + 'RETURNING id')
    .then((data) => {
      return data.id;
    })
    .catch((error) => {
      throw error;
    });
};

export const insertAnswersPerQuestion = async (
  answers: DbAnswer[],
  metadataId: number,
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
) => {
  const answersColumnSet = new pgp.helpers.ColumnSet([
    'question_id',
    'item_id',
    'text_answer',
    'metadata_id'
  ]);

  const answersAddedMetadataId: DbAnswer[] = answers.map(
    (dbAnswer: DbAnswer): DbAnswer => ({
      ...dbAnswer,
      metadata_id: metadataId
    })
  );

  const answerInsertquery = pgp.helpers.insert(
    answersAddedMetadataId,
    answersColumnSet,
    'answers'
  );

  await t.any(answerInsertquery);
};

export const updateMetadata = async (
  userId: string,
  metadataId: number,
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
): Promise<Date> => {
  const date: Date = new Date();

  const metadataColumnSet = new pgp.helpers.ColumnSet([
    'updated_date',
    'update_user'
  ]);

  const condition = pgp.as.format(' where id=$1 ', metadataId);

  const metadataUpdateQuery =
    pgp.helpers.update(
      { updated_date: date, update_user: userId },
      metadataColumnSet,
      'answer_metadata'
    ) + condition;

  const updatedDate = await t
    .one(metadataUpdateQuery + 'RETURNING updated_date')
    .then((data) => {
      return data.updated_date;
    })
    .catch((error) => {
      throw error;
    });

  return updatedDate;
};

export const updateAnswersPerQuestion = async (
  existing: UpdatingDbAnswer[],
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
) => {
  const columnSet = new pgp.helpers.ColumnSet(['item_id', 'text_answer']);

  await Promise.all(
    existing.map(async (answer: UpdatingDbAnswer) => {
      const condition = pgp.as.format(' where id=$1', answer.id);
      const query =
        pgp.helpers.update(answer, columnSet, 'answers') + condition;

      await t.any(query);
    })
  );
};

export const deleteAnswersPerQuestion = async (
  answerIds: number[],
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
): Promise<number[]> => {
  const deleteIds = await Promise.all(
    answerIds.map(async (id: number): Promise<number> => {
      const deleteQuery = 'DELETE FROM answers WHERE id = $1';
      const deleteId = await t
        .one(deleteQuery + ' RETURNING id', [id])
        .then((data) => data)
        .catch((error) => {
          throw error;
        });
      return deleteId.id;
    })
  );
  return deleteIds;
};
