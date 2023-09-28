import { connectDB } from '../../answer/db';
import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { createDeleteResponseBody } from '../../answer/delete';
import { DeleteEventBody } from '../../answer/interface/EventBody';

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

describe('正常系', () => {
  test('データを正常に消去する', async () => {
    const eventBody: DeleteEventBody = {
      metadataIds: [11, 12],
      userId: 'test',
      questionnairId: 1
    };
    const response = await createDeleteResponseBody(eventBody, db);
    expect(response.statusCode).toBe(200);
    expect(
      (response.body as { message: string; deleted: number[] }).deleted
    ).toEqual([11, 12]);
  });
});

describe('準正常系', () => {
  test('違うアンケートのデータを指定しようとする', async () => {
    const eventBody: DeleteEventBody = {
      metadataIds: [13],
      userId: 'test',
      questionnairId: 1
    };
    const response = await createDeleteResponseBody(eventBody, db);
    expect(response.statusCode).toBe(400);
    expect((response.body as { message: string }).message).toBe(
      '異なるアンケートの回答データを消去しようとしています。'
    );
  });
});
