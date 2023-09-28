import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { createGetResponseBody } from '../../answer-inheritance/get';
import { connectDB } from '../../answer-inheritance/db';

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

describe('正常系', () => {
  test('userIdのみ指定する場合', async () => {
    const response = await createGetResponseBody(db, 1, 'inheritance-user');

    expect(response.statusCode).toBe(200);
    expect(response.body.answers!).toEqual([
      { questionId: 2, itemId: 4 },
      { questionId: 3, itemId: 9 }
    ]);
  });

  test('itemIdのみ指定する場合', async () => {
    const response = await createGetResponseBody(db, 1, undefined, {
      questionId: 1,
      itemId: 1
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.answers!).toEqual([
      { questionId: 2, itemId: 5 },
      { questionId: 3, itemId: 8 }
    ]);
  });

  test('textAnswerのみ指定する場合', async () => {
    const response = await createGetResponseBody(db, 1, undefined, {
      questionId: 5,
      textAnswer: '15'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.answers!).toEqual([
      { questionId: 2, itemId: 5 },
      { questionId: 3, itemId: 8 }
    ]);
  });

  test('userIdとitemIdを指定する場合', async () => {
    const response = await createGetResponseBody(db, 1, 'inheritance-user', {
      questionId: 1,
      itemId: 2
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.answers!).toEqual([
      { questionId: 2, itemId: 4 },
      { questionId: 3, itemId: 6 }
    ]);
  });

  test('userIdとtextAnswerを指定する場合', async () => {
    const response = await createGetResponseBody(db, 1, 'inheritance-user', {
      questionId: 5,
      textAnswer: '5'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.answers!).toEqual([
      { questionId: 2, itemId: 4 },
      { questionId: 3, itemId: 6 }
    ]);
  });
});

describe('準正常系', () => {
  test('存在しない場合は404を返すこと', async () => {
    const response = await createGetResponseBody(db, 1, 'notExistUser');

    expect(response.statusCode).toBe(404);
  });
});
