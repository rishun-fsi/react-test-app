import * as pg from 'pg-promise/typescript/pg-subset';
import { Answer, DbAnswer } from './interface/Answer';
import { PostResponse } from './interface/Response';
import pgPromise from 'pg-promise';

const pgp = pgPromise({});

export const insertAnswers = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  answer: Answer
): Promise<PostResponse> => {
  const answerMetadataColumnSet = new pgp.helpers.ColumnSet([
    'created_date',
    'updated_date',
    'user_id',
    'questionnair_id'
  ]);

  const answersColumnSet = new pgp.helpers.ColumnSet([
    'question_id',
    'item_id',
    'other',
    'metadata_id'
  ]);

  const metadataInsertquery = pgp.helpers.insert(
    answer.metadata,
    answerMetadataColumnSet,
    'answer_metadata'
  );

  const id = await db
    .tx(async (t) => {
      const metadataId = await t
        .one(metadataInsertquery + 'RETURNING id')
        .then((data) => {
          return data;
        })
        .catch((error) => {
          throw error;
        });

      const answers: DbAnswer[] = answer.answers.map(
        (dbAnswer: DbAnswer): DbAnswer => ({
          ...dbAnswer,
          metadata_id: metadataId.id
        })
      );

      const answerInsertquery = pgp.helpers.insert(
        answers,
        answersColumnSet,
        'answers'
      );

      await t.any(answerInsertquery);

      return metadataId;
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });

  return {
    userId: answer.metadata.user_id,
    questionnairId: answer.metadata.questionnair_id,
    createdDate: answer.metadata.created_date,
    metadataId: id.id
  };
};
