import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { connectDB } from '../../answer/db';
import { Questionnair } from '../../questionnair/interface/Questionnair';
import { createGetOneResponseBody } from '../../questionnair/get-one';

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

describe('正常系', () => {
  test('正常にデータが取得できること', async () => {
    const questionnairId: number = 1;

    const response = await createGetOneResponseBody(questionnairId, db);
    const body = response.body as {
      message: string;
      questionnair: Questionnair;
    };
    expect(response.statusCode).toBe(200);
    expect(body.message).toBe('success');
    expect(body.questionnair).toEqual({
      id: 1,
      name: 'PJ健康診断アンケート',
      createdDate: '2023-07-21',
      updatedDate: '2023-07-21',
      isDeleted: false,
      userId: 'test'
    });
  });
});

describe('準正常系', () => {
  test('questionnairIdが数値ではない場合', async () => {
    const questionnairId: number = Number('aaa');
    const response = await createGetOneResponseBody(questionnairId, db);
    const body = response.body as { message: string };

    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('IDには数字を指定してください。');
  });
});
