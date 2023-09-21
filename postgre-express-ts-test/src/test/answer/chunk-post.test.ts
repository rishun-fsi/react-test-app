import { createChunkPostResponseBody } from '../../answer/chunk-post';
import { connectDB } from '../../answer/db';

const password: string = process.env['PASSWORD']!;
const db = connectDB(password);

describe('createChunkPostResponseBodyのテスト', () => {
  test('複数の回答の取得', async () => {
    const metadataIds: number[] = [1, 2, 4];

    const response = await createChunkPostResponseBody(metadataIds, db);
    expect(response.statusCode).toBe(200);
    expect(response.body.answers.length).toBe(3);
    expect(response.body.answers[2]).toEqual({
      metadataId: 4,
      questionnairId: 1,
      userId: 'userC',
      createdDate: '2023-07-30',
      updatedDate: '2023-08-30',
      updateUser: 'userD',
      answers: [
        { answerId: 17, questionId: 1, itemId: 1 },
        { answerId: 18, questionId: 2, itemId: 4 },
        { answerId: 19, questionId: 4, itemId: 13 },
        { answerId: 20, questionId: 5, textAnswer: '1' }
      ]
    });
  });

  test('回答が存在しないメタデータIDを指定したとき', async () => {
    const metadataIds: number[] = [1000];

    const response = await createChunkPostResponseBody(metadataIds, db);
    expect(response.statusCode).toBe(200);
    expect(response.body.answers.length).toBe(0);
  });
});
