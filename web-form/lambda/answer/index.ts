import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { connectDB } from './db';
import { insertAnswers } from './post';
import { Answer, DbAnswer } from './interface/Answer';
import { PostEventBody, PostedAnswer } from './interface/EventBody';

export const lambdaHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'POST') {
    throw new Error('request is not post.');
  }

  const password = process.env['PASSWORD'];
  if (!event.body) {
    throw new Error('event body is not found.');
  }
  if (!password) {
    throw new Error('password is not found.');
  }

  const eventBody: PostEventBody = JSON.parse(event.body);
  const date = new Date();
  const answersPerQuestion: DbAnswer[] = eventBody.answers.map(
    (answer: PostedAnswer): DbAnswer => ({
      question_id: answer.questionId,
      item_id: answer.itemId,
      other: answer.other !== undefined ? answer.other : ''
    })
  );
  const answer: Answer = {
    metadata: {
      created_date: date,
      updated_date: date,
      user_id: eventBody.userId,
      questionnair_id: eventBody.questionnairId
    },
    answers: answersPerQuestion
  };

  try {
    const db = connectDB(password);
    const response = await insertAnswers(db, answer);
    const body = { message: 'success', ...response };
    return createResponse(200, body);
  } catch (error) {
    console.error(error);
    const body = { message: 'error' };
    return createResponse(400, body);
  }
};

const createResponse = (
  statusCode: number,
  body: object
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS'
    },
    body: JSON.stringify(body)
  };
};
