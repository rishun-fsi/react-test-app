import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { connectDB } from '../../answer/db';
import { NotificationDetail } from '../../notifications/interface/Notification';
import { createGetOneResponseBody } from '../../notifications/get-one';

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

describe('正常系', () => {
  test('更新日がある場合のデータが正常に取得できること', async () => {
    const notificationId: number = 1;

    const response = await createGetOneResponseBody(notificationId, db);
    const body = response.body as {
      message: string;
      notificationDetail: NotificationDetail;
    };
    expect(response.statusCode).toBe(200);
    expect(body.message).toBe('success');
    expect(body.notificationDetail).toEqual({
      content: 'test1_content',
      date: '2023-10-06'
    });
  });
  test('更新日がない場合のデータが正常に取得できること', async () => {
    const notificationId: number = 2;

    const response = await createGetOneResponseBody(notificationId, db);
    const body = response.body as {
      message: string;
      notificationDetail: NotificationDetail;
    };
    expect(response.statusCode).toBe(200);
    expect(body.message).toBe('success');
    expect(body.notificationDetail).toEqual({
      content: 'test2_content',
      date: undefined
    });
  });
});

describe('準正常系', () => {
  test('notificationIdが数値ではない場合', async () => {
    const notificationId: number = Number('aaa');
    const response = await createGetOneResponseBody(notificationId, db);
    const body = response.body as { message: string };

    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('IDには数字を指定してください。');
  });
});
