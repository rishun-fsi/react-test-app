import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { createPutResponseBody } from '../../question/put';
import { connectDB } from '../../question/db';
import {
  extractItems,
  insertQuestionItems,
  insertQuestions
} from '../../question/common';
import {
  DBNewQuestion,
  DBNewQuestionItem,
  DBQuestionnairMetadata
} from '../../question/interface/Question';
import { insertQuestionnairMetadata } from '../../question/post';

const password: string = process.env['PASSWORD']!;
const db: pgPromise.IDatabase<Record<string, never>, pg.IClient> = connectDB(
  password
);

let questionnairId: number = 0;
let questionIds: number[] = [];
let itemIds: number[] = [];
beforeAll(async () => {
  const metadata: DBQuestionnairMetadata = {
    user_id: 'test',
    created_date: new Date(),
    updated_date: new Date(),
    name: 'テスト用アンケート'
  };

  await db.tx(async (t) => {
    questionnairId = await insertQuestionnairMetadata(metadata, t);
    const questions: DBNewQuestion[] = [
      {
        question: 'aaa',
        question_type_id: 1,
        required: true,
        headline: 'aaa',
        questionnair_id: questionnairId,
        can_inherit: true,
        priority: 1,
        items: [
          { item_name: 'item1', is_description: false, priority: 1 },
          { item_name: 'item2', is_description: false, priority: 2 }
        ]
      },
      {
        question: 'bbb',
        question_type_id: 4,
        required: true,
        headline: 'aaa',
        questionnair_id: questionnairId,
        can_inherit: true,
        priority: 1
      }
    ];

    questionIds = await insertQuestions(questions, t);
    const items: DBNewQuestionItem[] = extractItems(questions, questionIds);
    itemIds = await insertQuestionItems(items, t);
  });
});

test('updateQuestionnairに正常な入力を与える場合', async () => {
  const input = {
    existing: [
      {
        id: questionIds[0],
        type: 'radio',
        question: 'test',
        required: false,
        headline: 'システム名改',
        canInherit: false,
        isDeleted: false,
        priority: 4,
        items: {
          existing: [
            {
              id: itemIds[0],
              name: 'システムA',
              isDescription: true,
              priority: 1,
              isDeleted: true
            },
            {
              id: itemIds[1],
              name: 'システムB',
              isDescription: true,
              priority: 2,
              isDeleted: true
            }
          ],
          new: [
            {
              name: 'システムD',
              isDescription: false,
              priority: 3
            },
            {
              name: 'システムE',
              isDescription: false,
              priority: 1
            }
          ]
        }
      }
    ],
    new: [
      {
        type: 'select',
        question: 'AはBですか',
        required: true,
        headline: '見出し',
        canInherit: true,
        priority: 6,
        items: [
          {
            name: '選択肢X',
            isDescription: false,
            priority: 2
          },
          {
            name: '選択肢Y',
            isDescription: false,
            priority: 1
          },
          {
            name: '選択肢Z',
            isDescription: false,
            priority: 3
          }
        ]
      }
    ],
    inheritance: {
      isSameUser: false,
      questionId: 1
    },
    questionnairName: 'PJ健康診断アンケート改',
    questionnairId
  };

  const response = await createPutResponseBody(input, db);
  expect(response.statusCode).toBe(200);
});

test('existingのみでも正常に更新できること', async () => {
  const input = {
    existing: [
      {
        id: questionIds[0],
        type: 'radio',
        question: 'test',
        required: false,
        headline: 'システム名改',
        canInherit: false,
        isDeleted: false,
        priority: 4,
        items: {
          existing: [
            {
              id: itemIds[0],
              name: 'システムA',
              isDescription: true,
              priority: 1,
              isDeleted: true
            },
            {
              id: itemIds[1],
              name: 'システムB',
              isDescription: true,
              priority: 2,
              isDeleted: true
            }
          ],
          new: [
            {
              name: 'システムD',
              isDescription: false,
              priority: 3
            },
            {
              name: 'システムE',
              isDescription: false,
              priority: 1
            }
          ]
        }
      }
    ],
    questionnairName: 'PJ健康診断アンケート改',
    questionnairId
  };

  const response = await createPutResponseBody(input, db);
  expect(response.statusCode).toBe(200);
});

test('newのみでも正常に更新できること', async () => {
  const input = {
    new: [
      {
        type: 'select',
        question: 'AはBですか',
        required: true,
        headline: '見出し',
        canInherit: true,
        priority: 6,
        items: [
          {
            name: '選択肢X',
            isDescription: false,
            priority: 2
          },
          {
            name: '選択肢Y',
            isDescription: false,
            priority: 1
          },
          {
            name: '選択肢Z',
            isDescription: false,
            priority: 3
          }
        ]
      }
    ],
    inheritance: {
      isSameUser: false,
      questionId: 1
    },
    questionnairName: 'PJ健康診断アンケート改',
    questionnairId
  };

  const response = await createPutResponseBody(input, db);
  expect(response.statusCode).toBe(200);
});

test('inheritanceを指定しなくても正常に更新できること', async () => {
  const input = {
    existing: [
      {
        id: questionIds[0],
        type: 'radio',
        question: 'test',
        required: false,
        headline: 'システム名改',
        canInherit: false,
        isDeleted: false,
        priority: 4,
        items: {
          existing: [
            {
              id: itemIds[0],
              name: 'システムA',
              isDescription: true,
              priority: 1,
              isDeleted: true
            },
            {
              id: itemIds[1],
              name: 'システムB',
              isDescription: true,
              priority: 2,
              isDeleted: true
            }
          ],
          new: [
            {
              name: 'システムD',
              isDescription: false,
              priority: 3
            },
            {
              name: 'システムE',
              isDescription: false,
              priority: 1
            }
          ]
        }
      }
    ],
    questionnairName: 'PJ健康診断アンケート改',
    questionnairId
  };

  const response = await createPutResponseBody(input, db);
  expect(response.statusCode).toBe(200);
});

test('existingのitemがexistingのみでも正常に更新できること', async () => {
  const input = {
    existing: [
      {
        id: questionIds[0],
        type: 'radio',
        question: 'test',
        required: false,
        headline: 'システム名改',
        canInherit: false,
        isDeleted: false,
        priority: 4,
        items: {
          existing: [
            {
              id: itemIds[0],
              name: 'システムA',
              isDescription: true,
              priority: 1,
              isDeleted: true
            },
            {
              id: itemIds[1],
              name: 'システムB',
              isDescription: true,
              priority: 2,
              isDeleted: true
            }
          ]
        }
      }
    ],
    questionnairName: 'PJ健康診断アンケート改',
    questionnairId
  };

  const response = await createPutResponseBody(input, db);
  expect(response.statusCode).toBe(200);
});

test('existingのitemがnewのみでも正常に更新できること', async () => {
  const input = {
    existing: [
      {
        id: questionIds[0],
        type: 'radio',
        question: 'test',
        required: false,
        headline: 'システム名改',
        canInherit: false,
        isDeleted: false,
        priority: 4,
        items: {
          new: [
            {
              name: 'システムD',
              isDescription: false,
              priority: 3
            },
            {
              name: 'システムE',
              isDescription: false,
              priority: 1
            }
          ]
        }
      }
    ],
    questionnairName: 'PJ健康診断アンケート改',
    questionnairId
  };

  const response = await createPutResponseBody(input, db);
  expect(response.statusCode).toBe(200);
});

test('existingにitemが指定されていなくても正常に更新できること', async () => {
  const input = {
    existing: [
      {
        id: questionIds[0],
        type: 'radio',
        question: 'test',
        required: false,
        headline: 'システム名改',
        canInherit: false,
        isDeleted: false,
        priority: 4
      }
    ],
    questionnairName: 'PJ健康診断アンケート改',
    questionnairId
  };

  const response = await createPutResponseBody(input, db);
  expect(response.statusCode).toBe(200);
});

test('newにitemが指定されていなくても正常に更新できること', async () => {
  const input = {
    new: [
      {
        type: 'select',
        question: 'AはBですか',
        required: true,
        headline: '見出し',
        canInherit: true,
        priority: 6
      }
    ],
    questionnairName: 'PJ健康診断アンケート改',
    questionnairId
  };

  const response = await createPutResponseBody(input, db);
  expect(response.statusCode).toBe(200);
});
