import { Answer } from '../../answer/interface/Answer';
import { insertAnswers } from '../../answer/post';
import { connectDB } from '../../answer/db';
import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';

const date = new Date();

const userId: string = 'test';
const input: Answer = {
  metadata: {
    created_date: date,
    updated_date: date,
    user_id: userId,
    questionnair_id: 1
  },
  answers: [
    {
      question_id: 1,
      item_id: 1,
      other: ''
    },
    {
      question_id: 1,
      item_id: 1,
      other: ''
    }
  ]
};

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

test('insetAnswersに正常な入力を与える場合', async () => {
  const response = await insertAnswers(db, input);
  expect(typeof response.metadataId).toBe('number');
  expect(response.questionnairId).toBe(1);
  expect(response.userId).toBe('test');
});
