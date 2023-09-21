import { connectDB } from '../../answer/db';
import { PutEventBody } from '../../answer/interface/EventBody';
import { createPutResponseBody } from '../../answer/put';

describe('createPutResponseBodyのテスト', () => {
  const password: string = process.env['PASSWORD']!;
  const db = connectDB(password);

  test('既存の回答の編集と新規の回答の挿入ができること', async () => {
    const eventBody: PutEventBody = {
      answers: {
        existing: [
          {
            answerId: 13,
            itemId: 5
          }
        ],
        new: [{ questionId: 3, itemId: 9 }],
        delete: [14]
      },
      userId: 'test',
      questionnairId: 1,
      metadataId: 3
    };
    const response = await createPutResponseBody(eventBody, db);
    expect(response.statusCode).toBe(200);
  });

  test('existingとnewが両方ない場合はエラー扱いになること', async () => {
    const eventBody: PutEventBody = {
      answers: {},
      userId: 'test',
      questionnairId: 1,
      metadataId: 3
    };

    const response = await createPutResponseBody(eventBody, db);
    expect(response.statusCode).toBe(400);
  });
});
