import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { formatDate } from './common';
import { Questionnair } from './interface/Questionnair';

const fetchQuestionnairById = async (
  questionnairId: number,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<Questionnair> => {
  const query = 'SELECT * FROM questionnairs WHERE id = $1';

  return await db.one(query, [questionnairId]).then((data) => ({
    id: data.id,
    userId: data.user_id,
    createdDate: formatDate(data.created_date),
    updatedDate: formatDate(data.updated_date),
    name: data.name,
    isDeleted: data.is_deleted
  }));
};

export const createGetOneResponseBody = async (
  questionnairId: number,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: object }> => {
  if (isNaN(questionnairId)) {
    return {
      statusCode: 400,
      body: { message: 'IDには数字を指定してください。' }
    };
  }

  const questionnair: Questionnair = await fetchQuestionnairById(
    questionnairId,
    db
  );

  return { statusCode: 200, body: { message: 'success', questionnair } };
};
