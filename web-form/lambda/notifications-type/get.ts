import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { GetResponse } from './interface/Response';
import { NotificationType } from './interface/Notification';

const fetchNotificationTypes = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<NotificationType[]> => {
  const query: string =
    'SELECT id, name FROM notification_types ORDER BY severity DESC;';

  return await db.any(query);
};

export const createGetResponseBody = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: GetResponse }> => {
  try {
    const response: NotificationType[] = await fetchNotificationTypes(db);
    const body = { message: 'success', types: response };
    return { statusCode: 200, body };
  } catch (e) {
    if (
      e instanceof Error &&
      e.message === '不正なパラメータが指定されました。'
    ) {
      const body = { message: e.message };
      return { statusCode: 400, body };
    }

    console.error(e);
    return {
      statusCode: 500,
      body: { message: '予期せぬエラーが発生しました。' }
    };
  }
};
