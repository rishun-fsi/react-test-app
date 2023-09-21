import {
  extractItems,
  fetchQuestionTypeId,
  insertQuestions
} from '../../question/common';
import { connectDB } from '../../question/db';
import {
  DBNewQuestion,
  DBNewQuestionItem,
  FetchedQuestionType
} from '../../question/interface/Question';

const password = process.env['PASSWORD'];
const db = connectDB(password!);

describe('fetchQuestionTypeIdのテスト', () => {
  test('正常にidとtypeの組を取得できること', async () => {
    const response: FetchedQuestionType[] = await fetchQuestionTypeId(db);

    expect(response[0].id).toBe(1);
    expect(response[0].type).toBe('select');
  });
});

describe('extractItemsのテスト', () => {
  test('正常にitemを整形できること', () => {
    const questions: DBNewQuestion[] = [
      {
        question: 'aaa',
        question_type_id: 1,
        required: true,
        headline: 'aaa',
        questionnair_id: 2,
        can_inherit: true,
        priority: 1,
        items: [
          { item_name: 'item1', is_description: false, priority: 1 },
          { item_name: 'item2', is_description: false, priority: 2 }
        ]
      },
      {
        question: 'bbb',
        question_type_id: 1,
        required: true,
        headline: 'aaa',
        questionnair_id: 2,
        can_inherit: true,
        priority: 1,
        items: [{ item_name: 'item3', is_description: true, priority: 1 }]
      }
    ];
    const questionIds: number[] = [1, 2];

    const items: DBNewQuestionItem[] = extractItems(questions, questionIds);
    expect(items).toEqual([
      {
        item_name: 'item1',
        is_description: false,
        priority: 1,
        question_id: 1
      },
      {
        item_name: 'item2',
        is_description: false,
        priority: 2,
        question_id: 1
      },
      {
        item_name: 'item3',
        is_description: true,
        priority: 1,
        question_id: 2
      }
    ]);
  });

  test('選択肢を持たない質問がある場合でも正常にitemを整形できること', () => {
    const questions: DBNewQuestion[] = [
      {
        question: 'aaa',
        question_type_id: 1,
        required: true,
        headline: 'aaa',
        questionnair_id: 2,
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
        questionnair_id: 2,
        can_inherit: true,
        priority: 1
      }
    ];
    const questionIds: number[] = [1, 2];

    const items: DBNewQuestionItem[] = extractItems(questions, questionIds);
    expect(items).toEqual([
      {
        item_name: 'item1',
        is_description: false,
        priority: 1,
        question_id: 1
      },
      {
        item_name: 'item2',
        is_description: false,
        priority: 2,
        question_id: 1
      }
    ]);
  });

  test('選択肢をもたない質問のみの場合は空の配列を返すこと', () => {
    const questions: DBNewQuestion[] = [
      {
        question: 'aaa',
        question_type_id: 4,
        required: true,
        headline: 'aaa',
        questionnair_id: 2,
        can_inherit: true,
        priority: 1
      }
    ];
    const questionIds: number[] = [1];

    const items: DBNewQuestionItem[] = extractItems(questions, questionIds);
    expect(items).toEqual([]);
  });
});

describe('insertQuestionItemsのテスト', () => {
  test('正常にinsertし、質問のIDのリストが返ってくること', async () => {
    await db.tx(async (t) => {
      const questions: DBNewQuestion[] = [
        {
          question: 'aaa',
          question_type_id: 1,
          required: true,
          headline: 'aaa',
          questionnair_id: 2,
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
          questionnair_id: 2,
          can_inherit: true,
          priority: 1
        }
      ];
      const ids: number[] = await insertQuestions(questions, t);
      expect(ids.length).toBe(2);
    });
  });
});
