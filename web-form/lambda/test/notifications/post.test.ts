import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { createPostResponseBody } from '../../notifications/post';
import { connectDB } from '../../notifications/db';

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

describe('正常系', () => {
  test('お知らせ種別の新規登録', async () => {
    const response = await createPostResponseBody(
      {
        title: '新規お知らせ',
        content: 'お知らせです。',
        typeId: 1,
        userId: 'hideaki.azuma.ra@nttcom.co.jp'
      },
      db
    );
    expect(response.statusCode).toBe(200);
    expect(typeof response.body.id).toBe('number');
    expect(response.body.title).toBe('新規お知らせ');
  });

  test('publishTimestampが設定できること', async () => {
    const response = await createPostResponseBody(
      {
        title: '新規お知らせ2',
        content: 'お知らせです。',
        typeId: 1,
        userId: 'hideaki.azuma.ra@nttcom.co.jp',
        publishTimestamp: '2023/09/25 10:10:10'
      },
      db
    );
    expect(response.statusCode).toBe(200);
    expect(typeof response.body.id).toBe('number');
    expect(response.body.title).toBe('新規お知らせ2');
  });

  test('expireTimestampが設定できること', async () => {
    const response = await createPostResponseBody(
      {
        title: '新規お知らせ3',
        content: 'お知らせです。',
        typeId: 1,
        userId: 'hideaki.azuma.ra@nttcom.co.jp',
        expireTimestamp: '2023/09/30 10:10:10'
      },
      db
    );
    expect(response.statusCode).toBe(200);
    expect(typeof response.body.id).toBe('number');
    expect(response.body.title).toBe('新規お知らせ3');
  });
});

describe('準正常系', () => {
  test('typeIdに0以下の数値が代入された場合', async () => {
    const response = await createPostResponseBody(
      {
        title: '新規お知らせ3',
        content: 'お知らせです。',
        typeId: 0,
        userId: 'hideaki.azuma.ra@nttcom.co.jp',
        expireTimestamp: '2023/09/30 10:10:10'
      },
      db
    );
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('無効なリクエストです。');
  });

  test('タイトルに200文字以上の文字列が入力された場合', async () => {
    const response = await createPostResponseBody(
      {
        title: [...Array(201)].map((_) => 'a').join(''),
        content: 'お知らせです。',
        typeId: 0,
        userId: 'hideaki.azuma.ra@nttcom.co.jp',
        expireTimestamp: '2023/09/30 10:10:10'
      },
      db
    );
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('無効なリクエストです。');
  });

  test('contentに1000文字以上の文字列が入力された場合', async () => {
    const response = await createPostResponseBody(
      {
        title: '新規お知らせ3',
        content: [...Array(1001)].map((_) => 'a').join(''),
        typeId: 0,
        userId: 'hideaki.azuma.ra@nttcom.co.jp',
        expireTimestamp: '2023/09/30 10:10:10'
      },
      db
    );
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('無効なリクエストです。');
  });

  test('publishTimestampの形式が仕様がである場合', async () => {
    const response = await createPostResponseBody(
      {
        title: '新規お知らせ3',
        content: 'お知らせです。',
        typeId: 0,
        userId: 'hideaki.azuma.ra@nttcom.co.jp',
        publishTimestamp: 'aaaa'
      },
      db
    );
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('無効なリクエストです。');
  });

  test('publishTimestampが日時として不適切な文字列である場合', async () => {
    const response = await createPostResponseBody(
      {
        title: '新規お知らせ3',
        content: 'お知らせです。',
        typeId: 0,
        userId: 'hideaki.azuma.ra@nttcom.co.jp',
        publishTimestamp: '2023/13/30 10:10:10'
      },
      db
    );
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('無効なリクエストです。');
  });

  test('expireTimestampの形式が仕様がである場合', async () => {
    const response = await createPostResponseBody(
      {
        title: '新規お知らせ3',
        content: 'お知らせです。',
        typeId: 0,
        userId: 'hideaki.azuma.ra@nttcom.co.jp',
        expireTimestamp: 'aaa'
      },
      db
    );
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('無効なリクエストです。');
  });

  test('expireTimestampが日時として不適切な文字列である場合', async () => {
    const response = await createPostResponseBody(
      {
        title: '新規お知らせ3',
        content: 'お知らせです。',
        typeId: 0,
        userId: 'hideaki.azuma.ra@nttcom.co.jp',
        expireTimestamp: '2023/09/31 10:10:10'
      },
      db
    );
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('無効なリクエストです。');
  });
});
