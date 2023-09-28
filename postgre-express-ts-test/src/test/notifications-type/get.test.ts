import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { createGetResponseBody } from '../../notifications-type/get';
import { connectDB } from '../../notifications-type/db';

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

describe('正常系', () => {
  test('お知らせ種別の取得', async () => {
    const response = await createGetResponseBody(db);
    expect(response.statusCode).toBe(200);
    expect(response.body.types!).toEqual([
      { id: 1, name: '重要' },
      { id: 2, name: '周知' },
      { id: 3, name: 'その他' }
    ]);
  });
});
