import axios, { AxiosRequestConfig } from 'axios';
import { Auth } from 'aws-amplify';
import { QuestionResponse } from '../interface/Question';
import {
  Answer,
  AnswerMaster,
  AnswerMasterForEdit,
  AnswerPostResponse,
  ChunkUpsertAnswerRequest,
  PreviousAnswerQueryParam,
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
import {
  NotificationCreationRequest,
  NotificationDetail,
  NotificationType,
  Notification
} from '../interface/Notification';

const API_BASE_URL =
  'http://localhost:5000';

export const fetchQuestions = async (
  questionnairId: number,
  isAll: boolean
): Promise<QuestionResponse> => {
  const headers: AxiosRequestConfig = await eventHeaders();
  const response = await axios.get(`${API_BASE_URL}/question`, {
    params: { questionnairId, isAll },
    ...headers
  });

  return response.data;
};

export const fetchPreviousAnswers = async (
  queryParameter: PreviousAnswerQueryParam,
  isSameUser: boolean
): Promise<Answer[] | undefined> => {
  const user = await Auth.currentAuthenticatedUser();
  const userId = user.attributes.email;
  const headers: AxiosRequestConfig = await eventHeaders();

  try {
    const response = isSameUser
      ? await axios.get(`${API_BASE_URL}/answer/inheritance/${userId}`, {
          ...headers,
          params: queryParameter
        })
      : await axios.get(`${API_BASE_URL}/answer/inheritance`, {
          ...headers,
          params: queryParameter
        });
    return response.data.answers;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response && e.response.status === 404) {
      return undefined;
    } else if (
      axios.isAxiosError(e) &&
      e.response &&
      e.response.status >= 400
    ) {
      throw new Error(e.message);
    }
  }
};

export const submitNewAnswers = async (
  answerMaster: AnswerMaster
): Promise<AnswerPostResponse> => {
  const headers: AxiosRequestConfig = await eventHeaders();
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

export const deleteAnswers = async (
  metadataIds: number[],
  userId: string,
  questionnairId: number
): Promise<number[]> => {
  const headers: AxiosRequestConfig = await eventHeaders();
  const response = await axios.delete(`${API_BASE_URL}/answer`, {
    ...headers,
    data: { metadataIds, userId, questionnairId }
  });

  return response.data.deleted;
};

export const postQuestionnair = async (questionnair: Questionnair) => {
  const headers: AxiosRequestConfig = await eventHeaders();
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

  const response = await axios.get(
    `${API_BASE_URL}/questionnair/${questionnairId}`,
    { ...headers }
  );

  return response.data.questionnair;
};

export const updateQuestionnair = async (questionnair: EditedQuestionnair) => {
  const headers: AxiosRequestConfig = await eventHeaders();
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

  const response = await axios.get(`${API_BASE_URL}/notifications/type`, {
    ...headers
  });

  return response.data.types;
};

export const postNotification = async (
  request: NotificationCreationRequest
): Promise<number> => {
  const headers: AxiosRequestConfig = await eventHeaders();
  const response = await axios.post(
    `${API_BASE_URL}/notifications`,
    request,
    headers
  );

  if (response.status >= 400) {
    throw new Error(response.data.message);
  }

  return response.data.id;
};

export const fetchNotifications = async (
  limit: number,
  offset: number
): Promise<Notification[]> => {
  return [
    {
      id: 1,
      createdDate: '2023-10-01',
      title: 'お知らせ1',
      userId: '山田太郎',
      type: '重要'
    },
    {
      id: 2,
      createdDate: '2023-10-01',
      title: 'お知らせ2',
      userId: '山田次郎',
      type: '重要'
    },
    {
      id: 3,
      createdDate: '2023-10-01',
      title: 'お知らせ3',
      userId: '山田三郎',
      type: '重要'
    },
    {
      id: 4,
      createdDate: '2023-10-01',
      title: 'お知らせ4',
      userId: '山田三郎',
      type: '重要'
    }
  ];
};

export const fetchNotificationDetail = async (
  id: number
): Promise<NotificationDetail> => {
  return { content: 'aaa', date: '2023-10-10' };
};
