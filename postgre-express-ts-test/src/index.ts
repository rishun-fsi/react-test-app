import { db } from './db';
import { fetchQuestions } from './question/get';
import { GetResponse } from './question/interface/Question';

import { insertAnswers } from './answer/post';
import { Answer, DbAnswer } from './answer/interface/Answer';
import { PostEventBody, PostedAnswer } from './answer/interface/EventBody';

import express, { NextFunction, Request, Response } from "express";
const app = express();

app.use(express.json());

const isInt = (x: any): boolean => {
  return typeof x === 'number' && x % 1 === 0;
};

app.get("/question", async (req: Request, res: Response, next: NextFunction) => {


  let questionnairId: number = 0;
  let isAll: boolean = false;
  if (req.query!.questionnairId === undefined) {
    const body = { message: 'アンケートのIDが指定されていません。' };
    //return createResponse(400, body);
    return res.status(400).json(body);
  }

  try {
    questionnairId = Number(req.query!.questionnairId);
    if (questionnairId < 1 || !isInt(questionnairId)) {
      throw new Error('不正なパラメータが指定されました。');
    }

    if (
      req.query!.isAll === undefined ||
      req.query!.isAll === 'false'
    ) {
      isAll = false;
    } else if (req.query!.isAll === 'true') {
      isAll = true;
    } else {
      throw new Error('不正なパラメータが指定されました。');
    }
  } catch (e) {
    console.error(e);
    const body = { message: '不正なパラメータが指定されました。' };
    //return createResponse(400, body);
    return res.status(400).json(body);
  }


  try {
    const questions: GetResponse = await fetchQuestions(
      db,
      questionnairId,
      isAll
    );
    const body = { message: 'success', questions };
   // return createResponse(200, body);
   return res.status(200).json(body);
  } catch (error) {
    console.error(error);
    const body = { message: 'error' };
    //return createResponse(500, body);
    return res.status(500).json(body);
  }

});



app.post("/answer", async (req: Request, res: Response, next: NextFunction) => {

  const eventBody: PostEventBody = JSON.parse(req.body);
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
    const response = await insertAnswers(db, answer);
    const body = { message: 'success', ...response };
    //return createResponse(200, body);
    return res.status(200).json(body);
  } catch (error) {
    console.error(error);
    const body = { message: 'error' };
    //return createResponse(400, body);
    return res.status(400).json(body);
  }

});


app.listen("3000", (): void => {
  console.log("Server Running!");
});