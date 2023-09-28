import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { DeleteEventBody } from './interface/EventBody';
import { DeleteResponse } from './interface/Response';

const validateMetadataIds = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  metadataIds: number[],
  questionnairId: number
): Promise<boolean> => {
  const query = `SELECT questionnair_id FROM answer_metadata WHERE id IN (${[
    ...Array(metadataIds.length)
  ]
    .map((_, index: number) => `$${index + 1}`)
    .join(',')});`;

  const isValidMetadataId: boolean = await db
    .any(query, metadataIds)
    .then((data) =>
      data.every((record) => record.questionnair_id === questionnairId)
    );

  return isValidMetadataId;
};

const deleteAnswers = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  metadataIds: number[]
): Promise<DeleteResponse> => {
  const placeHolder: string = `(${[...Array(metadataIds.length)]
    .map((_, index: number) => `$${index + 1}`)
    .join(',')})`;
  const answerDeleteQuery: string = `DELETE FROM answers WHERE metadata_id IN ${placeHolder};`;
  const metadataDeleteQuery: string = `DELETE FROM answer_metadata WHERE id IN ${placeHolder} RETURNING id;`;

  const ids: number[] = await db.tx(async (t) => {
    await t.any(answerDeleteQuery, metadataIds);
    const deleted: number[] = await t
      .any(metadataDeleteQuery, metadataIds)
      .then((data) => data.map((record) => record.id));

    return deleted;
  });
  return { deleted: ids };
};

export const createDeleteResponseBody = async (
  eventBody: DeleteEventBody,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: object }> => {
  const isValidMetadataId: boolean = await validateMetadataIds(
    db,
    eventBody.metadataIds,
    eventBody.questionnairId
  );
  if (!isValidMetadataId)
    return {
      statusCode: 400,
      body: {
        message: '異なるアンケートの回答データを消去しようとしています。'
      }
    };

  const response = await deleteAnswers(db, eventBody.metadataIds);
  const body = { message: 'success', ...response };

  return { statusCode: 200, body };
};
