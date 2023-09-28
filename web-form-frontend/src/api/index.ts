import axios, { AxiosRequestConfig } from 'axios';
import { QuestionResponse } from '../interface/Question';
import {
  Answer,
  AnswerMaster,
  AnswerMasterForEdit,
  AnswerPostResponse,
  ChunkUpsertAnswerRequest,
  ValidatingAnswer
} from '../interface/Answer';
import { AnswersTableResponse } from '../interface/AnswersTable';
import {
  EditedQuestionnair,
  Questionnair,
  QuestionnairGetResponse,
  QuestionnairMetaData
} from '../interface/Questionnair';
import { eventHeaders } from '../common/auth';
import { removeTempAnswers } from '../common/answer';
import { NotificationType } from '../interface/Notification';

const API_BASE_URL =
  'http://localhost:5000';

export const fetchQuestions = async (
  questionnairId: number,
  isAll: boolean
): Promise<QuestionResponse> => {
  const headers: AxiosRequestConfig = await eventHeaders();

  console.log("fetchQuestions", JSON.stringify({"questionnairId": questionnairId, "isAll": isAll}));
  const response = await axios.get(`${API_BASE_URL}/question`, {
    params: { questionnairId, isAll },
    ...headers
  });

  return response.data;
};

export const submitNewAnswers = async (
  answerMaster: AnswerMaster
): Promise<AnswerPostResponse> => {
  const headers: AxiosRequestConfig = await eventHeaders();

  console.log("submitNewAnswers", JSON.stringify(answerMaster));
  const response = await axios.post(
    `${API_BASE_URL}/answer`,
    answerMaster,
    headers
  );

  if (response.status >= 400) {
    throw new Error(response.data.message);
  }

  removeTempAnswers(`tempAnswer${answerMaster.questionnairId}`);
  return response.data;
};

export const updateAnswers = async (
  answerMasterForEdit: AnswerMasterForEdit
): Promise<AnswerPostResponse> => {
  const headers: AxiosRequestConfig = await eventHeaders();

  console.log("updateAnswers", JSON.stringify(answerMasterForEdit));
  const response = await axios.put(
    `${API_BASE_URL}/answer`,
    answerMasterForEdit,
    headers
  );

  if (response.status >= 400) {
    throw new Error(response.data.message);
  }

  removeTempAnswers(
    `tempAnswer${answerMasterForEdit.questionnairId}-${answerMasterForEdit.metadataId}`
  );
  return response.data;
};

export const fetchAnswersByMetadataId = async (
  metadataId: number
): Promise<Answer[]> => {
  const headers: AxiosRequestConfig = await eventHeaders();

  console.log("fetchAnswersByMetadataId", metadataId);
  const response = await axios.get(`${API_BASE_URL}/answer/${metadataId}`, {
    ...headers
  });
  return response.data.answers;
};

export const fetchAnswers = async (
  questionnairId: number,
  limit: number,
  offset: number
): Promise<AnswersTableResponse> => {
  const headers: AxiosRequestConfig = await eventHeaders();

  console.log("fetchAnswers", JSON.stringify({"limit": limit, "offset": offset, "questionnairId": questionnairId}));
  const response = await axios.get(`${API_BASE_URL}/answer`, {
    params: { questionnairId, limit, offset },
    ...headers
  });

  return {
    headers: response.data.headers,
    answers: response.data.answers,
    totalCount: response.data.totalCount
  };
};

export const fetchAnswersByMetadataIds = async (
  metadataIds: number[]
): Promise<ValidatingAnswer[]> => {
  const headers: AxiosRequestConfig = await eventHeaders();

  console.log("fetchAnswersByMetadataIds", JSON.stringify({"metadataIds": metadataIds}));
  const response = await axios.post(
    `${API_BASE_URL}/answer/chunk`,
    { metadataIds },
    headers
  );

  if (response.status >= 400) {
    throw new Error(response.data.message);
  }

  return response.data.answers;
};

export const chunkUpsertAnswers = async (
  request: ChunkUpsertAnswerRequest
): Promise<string> => {
  const headers: AxiosRequestConfig = await eventHeaders();

  console.log("chunkUpsertAnswers", JSON.stringify(request));
  const response = await axios.put(
    `${API_BASE_URL}/answer/chunk`,
    request,
    headers
  );

  if (response.status >= 400) {
    throw new Error(response.data.message);
  }

  return response.data.message;
};

export const postQuestionnair = async (questionnair: Questionnair) => {
  const headers: AxiosRequestConfig = await eventHeaders();

  console.log("postQuestionnair", JSON.stringify(questionnair));
  const response = await axios.post(
    `${API_BASE_URL}/question`,
    questionnair,
    headers
  );

  if (response.status >= 400) {
    throw new Error(response.data.message);
  }
};

export const fetchQuestionnairs = async (
  limit: number,
  offset: number,
  isAll?: boolean
): Promise<QuestionnairGetResponse> => {
  const headers: AxiosRequestConfig = await eventHeaders();
  console.log("fetchQuestionnairs", JSON.stringify({"limit": limit, "offset": offset, "isAll": isAll}));
  
  const response = await axios.get(`${API_BASE_URL}/questionnair`, {
    params: { limit, offset, isAll },
    ...headers
  });

  return {
    questionnairs: response.data.questionnairs,
    totalCount: response.data.totalCount
  };
};

export const fetchQuestionnairById = async (
  questionnairId: number
): Promise<QuestionnairMetaData> => {
  const headers: AxiosRequestConfig = await eventHeaders();
  console.log("fetchQuestionnairById", questionnairId);
  
  const response = await axios.get(
    `${API_BASE_URL}/questionnair/${questionnairId}`,
    { ...headers }
  );

  return response.data.questionnair;
};

export const updateQuestionnair = async (questionnair: EditedQuestionnair) => {
  const headers: AxiosRequestConfig = await eventHeaders();
  console.log("updateQuestionnair", JSON.stringify(questionnair));
  
  const response = await axios.put(
    `${API_BASE_URL}/question`,
    questionnair,
    headers
  );

  if (response.status >= 400) {
    throw new Error(response.data.message);
  }
};


export const fetchNotificationTypes = async (): Promise<NotificationType[]> => {
  const headers: AxiosRequestConfig = await eventHeaders();

  console.log("fetchNotificationTypes");
  const response = await axios.get(`${API_BASE_URL}/notifications/type`, {
    ...headers
  });
  return response.data.types;
};