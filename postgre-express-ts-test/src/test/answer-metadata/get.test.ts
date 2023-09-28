import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { fetchAnswers, createGetResponseBody } from '../../answer-metadata/get';
import { connectDB } from '../../answer-metadata/db';
import { Answer } from '../../answer-metadata/interface/Response';

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

describe('正常系', () => {
  test('対象の回答メタデータの回答情報を正常に取得する場合', async () => {
    const response: Answer[] = await fetchAnswers(db, 1);
    expect(response.find((answer: Answer) => answer.answerId === 1)).toEqual({
      answerId: 1,
      questionId: 1,
      itemId: 1
    });
    expect(response.find((answer: Answer) => answer.answerId === 2)).toEqual({
      answerId: 2,
      questionId: 2,
      itemId: 4
    });
    expect(response.find((answer: Answer) => answer.answerId === 3)).toEqual({
      answerId: 3,
      questionId: 3,
      itemId: 6
    });
    expect(response.find((answer: Answer) => answer.answerId === 4)).toEqual({
      answerId: 4,
      questionId: 4,
      itemId: 11
    });
    expect(response.find((answer: Answer) => answer.answerId === 5)).toEqual({
      answerId: 5,
      questionId: 5,
      textAnswer: '10'
    });
    expect(response.length).toBe(5);
  });
});

describe('準正常系', () => {
  test('metadataIdが0以下の場合は不正なパラメータであると判定されること', async () => {
    const response = await createGetResponseBody(0, db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });
  test('metadataIdが数字以外の場合は不正なパラメータであると判定されること', async () => {
    const response = await createGetResponseBody(Number('aaa'), db);
    const body = response.body as { message: string };
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('不正なパラメータが指定されました。');
  });
});
