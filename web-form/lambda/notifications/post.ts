import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { checkNumberFormat, isStringLengthValid, isTimestamp } from './common';
import { PostEventBody } from './interface/EventBody';
import { DbNotification } from './interface/Notification';
import { PostResponse } from './interface/Response';

const pgp = pgPromise({});

const validateEventBody = (eventBody: PostEventBody): boolean => {
  try {
    checkNumberFormat(eventBody.typeId, 1);
  } catch (e) {
    return false;
  }

  return (
    isStringLengthValid(eventBody.title, 200) &&
    isStringLengthValid(eventBody.content, 1000) &&
    (eventBody.publishTimestamp === undefined ||
      (eventBody.publishTimestamp !== undefined &&
        isTimestamp(eventBody.publishTimestamp))) &&
    (eventBody.expireTimestamp === undefined ||
      (eventBody.expireTimestamp !== undefined &&
        isTimestamp(eventBody.expireTimestamp)))
  );
};

const createNotification = async (
  notification: DbNotification,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ id: number; title: string }> => {
  const columnSet = new pgp.helpers.ColumnSet([
    'title',
    'content',
    'type_id',
    'user_id',
    'created_date',
    'publish_timestamp',
    'expire_timestamp'
  ]);

  const query = pgp.helpers.insert(notification, columnSet, 'notifications');

  return await db
    .one(query + 'RETURNING id')
    .then((data) => ({ id: data.id, title: notification.title }));
};

export const createPostResponseBody = async (
  eventBody: PostEventBody,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: PostResponse }> => {
  if (!validateEventBody(eventBody)) {
    return { statusCode: 400, body: { message: '無効なリクエストです。' } };
  }

  const date = new Date();

  const notification: DbNotification = {
    title: eventBody.title,
    content: eventBody.content,
    type_id: eventBody.typeId,
    user_id: eventBody.userId,
    created_date: date,
    publish_timestamp: eventBody.publishTimestamp
      ? new Date(eventBody.publishTimestamp)
      : undefined,
    expire_timestamp: eventBody.expireTimestamp
      ? new Date(eventBody.expireTimestamp)
      : undefined
  };

  const response = await createNotification(notification, db);
  const body = { message: 'success', ...response };
  return { statusCode: 200, body };
};
