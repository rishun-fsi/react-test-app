// import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
// import { connectDB } from './db';
// import { fetchQuestions } from './get';
// import { GetResponse } from './interface/Question';

// const isInt = (x: any): boolean => {
//   return typeof x === 'number' && x % 1 === 0;
// };

// export const lambdaHandler = async (
//   event: APIGatewayEvent,
//   context: Context
// ): Promise<APIGatewayProxyResult> => {
//   if (event.httpMethod !== 'GET') {
//     throw new Error('request is not get.');
//   }

//   const password = process.env['PASSWORD'];
//   if (!password) {
//     throw new Error('password is not found.');
//   }

//   let questionnairId: number = 0;
//   let isAll: boolean = false;
//   if (event.queryStringParameters!.questionnairId === undefined) {
//     const body = { message: 'アンケートのIDが指定されていません。' };
//     return createResponse(400, body);
//   }

//   try {
//     questionnairId = Number(event.queryStringParameters!.questionnairId);
//     if (questionnairId < 1 || !isInt(questionnairId)) {
//       throw new Error('不正なパラメータが指定されました。');
//     }

//     if (
//       event.queryStringParameters!.isAll === undefined ||
//       event.queryStringParameters!.isAll === 'false'
//     ) {
//       isAll = false;
//     } else if (event.queryStringParameters!.isAll === 'true') {
//       isAll = true;
//     } else {
//       throw new Error('不正なパラメータが指定されました。');
//     }
//   } catch (e) {
//     console.error(e);
//     const body = { message: '不正なパラメータが指定されました。' };
//     return createResponse(400, body);
//   }

//   try {
//     const db = connectDB(password);
//     const questions: GetResponse = await fetchQuestions(
//       db,
//       questionnairId,
//       isAll
//     );
//     const body = { message: 'success', questions };
//     return createResponse(200, body);
//   } catch (error) {
//     console.error(error);
//     const body = { message: 'error' };
//     return createResponse(500, body);
//   }
// };

// const createResponse = (
//   statusCode: number,
//   body: object
// ): APIGatewayProxyResult => {
//   return {
//     statusCode,
//     headers: {
//       'Access-Control-Allow-Headers': 'Content-Type',
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST,OPTIONS'
//     },
//     body: JSON.stringify(body)
//   };
// };
