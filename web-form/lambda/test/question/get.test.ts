import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { fetchQuestions } from '../../question/get';
import { connectDB } from '../../answer/db';
import { GetResponse } from '../../question/interface/Question';

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

test('削除されていない質問のみを取得する場合', async () => {
  const questions: GetResponse = await fetchQuestions(db, 1, false);
  expect(questions[0]).toEqual({
    id: 1,
    question: '対象のアプリ・システム名を選択してください。',
    type: 'select',
    required: true,
    headline: 'システム名',
    items: [
      { id: 1, name: 'システムA', isDiscription: false, isDeleted: false },
      { id: 2, name: 'システムB', isDiscription: false, isDeleted: false },
      { id: 3, name: 'システムC', isDiscription: false, isDeleted: false }
    ],
    isDeleted: false,
    priority: 1
  });
  expect(questions[1]).toEqual({
    groupId: 1,
    group: '開発環境',
    questions: [
      {
        id: 2,
        question: '対象システムの開発手法を選択してください。',
        type: 'radio',
        required: true,
        headline: '開発手法',
        items: [
          { id: 4, name: 'アジャイル', isDiscription: false, isDeleted: false },
          {
            id: 5,
            name: 'ウォーターフォール',
            isDiscription: false,
            isDeleted: false
          }
        ],
        isDeleted: false,
        priority: 2
      },
      {
        id: 3,
        question: '対象システムのサーバ基盤を選択してください。',
        type: 'check',
        required: false,
        headline: 'サーバーの土台',
        items: [
          { id: 6, name: 'AWS', isDiscription: false, isDeleted: false },
          { id: 7, name: 'GCP', isDiscription: false, isDeleted: false },
          { id: 8, name: 'Azure', isDiscription: false, isDeleted: false },
          {
            id: 9,
            name: 'ドコモ内オンプレ',
            isDiscription: false,
            isDeleted: false
          },
          { id: 10, name: 'その他', isDiscription: true, isDeleted: false }
        ],
        isDeleted: false,
        priority: 3
      }
    ]
  });
  expect(questions.length).toBe(3);
});

test('削除されている質問を含めて取得する場合', async () => {
  const questions: GetResponse = await fetchQuestions(db, 1, true);

  expect(questions.length).toBe(4);
});