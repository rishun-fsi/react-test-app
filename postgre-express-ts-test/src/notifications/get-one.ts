import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { NotificationDetail } from './interface/Notification';
import { formatDate } from './common';

const fetchNotificationDetailById = async (
  notificationId: number,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<NotificationDetail> => {
  const query =
    'SELECT content,created_date,updated_date FROM notifications WHERE id = $1';

  return await db.one(query, [notificationId]).then((data) => ({
    content: data.content,
    date: data.updated_date === null ? undefined : formatDate(data.updated_date)
  }));
};

export const createGetOneResponseBody = async (
  notificationId: number,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: object }> => {
  if (isNaN(notificationId)) {
    return {
      statusCode: 400,
      body: { message: 'IDには数字を指定してください。' }
    };
  }

  const notificationDetail: NotificationDetail =
    await fetchNotificationDetailById(notificationId, db);

  return { statusCode: 200, body: { message: 'success', notificationDetail } };
};
