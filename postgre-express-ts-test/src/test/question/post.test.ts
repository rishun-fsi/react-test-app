import { DBQuestionnair } from '../../question/interface/Question';
import { createPostResponseBody } from '../../question/post';
import { connectDB } from '../../question/db';
import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

test('insetAnswersに正常な入力を与える場合', async () => {
  const input = {
    userId: 'userB',
    name: 'アンケートB',
    inheritance: {
      isSameUser: false,
      questionIndex: 0
    },
    questions: [
      {
        question: 'test',
        type: 'radio',
        required: true,
        headline: 'test',
        canInherit: true,
        items: [
          {
            name: '選択肢E',
            isDescription: true
          },
          {
            name: '選択肢F',
            isDescription: true
          },
          {
            name: '選択肢G',
            isDescription: true
          }
        ]
      },
      {
        question: 'text test',
        type: 'text',
        required: true,
        headline: 'test',
        canInherit: true
      }
    ]
  };
  const response = await createPostResponseBody(input, db);
  expect(typeof response.body.questionnairId).toBe('number');
  expect(response.body.userId).toBe('userB');
  expect(response.statusCode).toBe(200);
});

test('inheritanceにquestionIndexを指定しなくても挿入できること', async () => {
  const input = {
    userId: 'userB',
    name: 'アンケートB',
    inheritance: {
      isSameUser: true
    },
    questions: [
      {
        question: 'test',
        type: 'radio',
        required: true,
        headline: 'test',
        canInherit: true,
        items: [
          {
            name: '選択肢E',
            isDescription: true
          },
          {
            name: '選択肢F',
            isDescription: true
          },
          {
            name: '選択肢G',
            isDescription: true
          }
        ]
      }
    ]
  };
  const response = await createPostResponseBody(input, db);
  expect(response.statusCode).toBe(200);
});

test('inheritanceが指定されていない場合でも挿入できること', async () => {
  const input = {
    userId: 'userB',
    name: 'アンケートB',
    questions: [
      {
        question: 'test',
        type: 'radio',
        required: true,
        headline: 'test',
        canInherit: true,
        items: [
          {
            name: '選択肢E',
            isDescription: true
          },
          {
            name: '選択肢F',
            isDescription: true
          },
          {
            name: '選択肢G',
            isDescription: true
          }
        ]
      }
    ]
  };
  const response = await createPostResponseBody(input, db);
  expect(response.statusCode).toBe(200);
});
