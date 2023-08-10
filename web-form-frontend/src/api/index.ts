import axios from 'axios';
import { QuestionResponse } from '../interface/Question';
import { AnswerMaster, AnswerPostResponse } from '../interface/Answer';

const API_BASE_URL =
  'https://w57zbenh6e.execute-api.ap-northeast-1.amazonaws.com/prod/';

export const fetchQuestions = async (
  questionnairId: number,
  isAll: boolean
): Promise<QuestionResponse> => {
  const response = await axios.get(`${API_BASE_URL}/question`, {
    params: { questionnairId, isAll }
  });

  return response.data.questions;
};

export const submitAnswers = async (
  answerMaster: AnswerMaster
): Promise<AnswerPostResponse> => {
  const response = await axios.post(`${API_BASE_URL}/answer`, answerMaster);

  if (response.status >= 400) {
    throw new Error(response.data.message);
  }

  return response.data;
};
