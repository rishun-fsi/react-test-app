import { createChunkPutResponseBody } from '../../answer/chunk-put';
import { connectDB } from '../../answer/db';
import { ChunkPutEventBody } from '../../answer/interface/EventBody';

const password: string = process.env['PASSWORD']!;
const db = connectDB(password);

describe('createChunkPutResponseBodyのテスト - 正常系', () => {
  test('複数の質問の同時編集', async () => {
    const eventBody: ChunkPutEventBody = {
      answers: [
        {
          metadataId: 5,
          existing: [
            { answerId: 24, itemId: 11 },
            { answerId: 25, textAnswer: '18' }
          ],
          delete: [23]
        },
        { new: [{ questionId: 2, itemId: 4 }] }
      ],
      userId: 'test',
      questionnairId: 1
    };

    const response = await createChunkPutResponseBody(eventBody, db);
    expect(response.statusCode).toBe(200);
    expect(response.body.edited![0]).toBe(5);
    expect(response.body.inserted!.length).toBe(1);
  });
});

describe('createChunkPutResponseBodyのテスト - 準正常系', () => {
  test('existingとnewとdeleteの全てがundefinedのデータを含む入力の場合、400を返すこと', async () => {
    const eventBody: ChunkPutEventBody = {
      answers: [{ metadataId: 1 }],
      userId: 'test',
      questionnairId: 1
    };

    const response = await createChunkPutResponseBody(eventBody, db);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('不正なデータです。');
  });

  test('metadataIdとnewがundefinedのデータを含む入力の場合、400を返すこと', async () => {
    const eventBody: ChunkPutEventBody = {
      answers: [{ delete: [1] }],
      userId: 'test',
      questionnairId: 1
    };

    const response = await createChunkPutResponseBody(eventBody, db);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('不正なデータです。');
  });
});
