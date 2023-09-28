import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import {
  FetchedQuestion,
  Question,
  QuestionItem,
  QuestionGroupByItem,
  GroupedQuestion
} from './interface/Question';
import { FetchedInheritance } from './interface/Inheritance';
import {
  GetInheritanceResponse,
  GetQuestionResponse,
  GetResponse
} from './interface/Response';

const isInt = (x: any): boolean => {
  return typeof x === 'number' && x % 1 === 0;
};

const convertStringToNumber = (
  numberString: string,
  min: number,
  max?: number
): number => {
  const number = Number(numberString);
  if (number < min || !isInt(number) || (max !== undefined && number > max)) {
    throw new Error('不正なパラメータが指定されました。');
  }

  return number;
};

const convertStringToBoolean = (boolString?: string): boolean => {
  if (boolString === undefined || boolString === 'false') {
    return false;
  } else if (boolString === 'true') {
    return true;
  } else {
    throw new Error('不正なパラメータが指定されました。');
  }
};

export const fetchQuestions = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  questionnairId: number,
  isAll: boolean
): Promise<GetQuestionResponse> => {
  const query: string =
    'SELECT q.id, q.question, q.required, q.headline, q.questionnair_id, q.can_inherit, i.item_name AS item, i.id AS item_id, i.is_description, t.question_type AS type, g.name AS group, q.group_id, q.is_deleted AS is_question_deleted, i.is_deleted AS is_item_deleted, q.priority FROM questions AS q ' +
    'LEFT JOIN question_items AS i ON q.id = i.question_id ' +
    'INNER JOIN question_types AS t ON q.question_type_id = t.id ' +
    'LEFT JOIN question_groups AS g ON q.group_id = g.id ' +
    `WHERE q.questionnair_id = $1 ${
      isAll
        ? ''
        : 'AND NOT q.is_deleted AND (i.is_deleted IS NULL or i.is_deleted IS FALSE)'
    } ` +
    'ORDER BY q.priority, i.priority;';

  const questions: GetQuestionResponse = await db
    .any(query, [questionnairId])
    .then((data) => {
      return formData(data);
    })
    .catch((error) => {
      throw error;
    });

  return questions;
};

export const fetchInheritance = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  questionnairId: number
): Promise<GetInheritanceResponse | undefined> => {
  const query: string =
    'SELECT is_same_user, question_id FROM inheritances WHERE questionnair_id = $1';

  const inheritance: GetInheritanceResponse | undefined = await db
    .any(query, [questionnairId])
    .then((data) => {
      return formInheritance(data);
    })
    .catch((error) => {
      throw error;
    });

  return inheritance;
};

export const formInheritance = (
  inheritance: FetchedInheritance[]
): GetInheritanceResponse | undefined => {
  return inheritance.length === 0
    ? undefined
    : {
        isSameUser: inheritance[0].is_same_user,
        questionId:
          inheritance[0].question_id === null
            ? undefined
            : inheritance[0].question_id
      };
};

const formData = (fetchedQuestions: FetchedQuestion[]): GetQuestionResponse => {
  // 質問idの重複なしリストを作成
  const ids: number[] = [
    ...new Set(fetchedQuestions.map((fetched: FetchedQuestion) => fetched.id))
  ];

  const questionsGroupByItem: QuestionGroupByItem[] = groupByItem(
    ids,
    fetchedQuestions
  );

  return groupByGroup(questionsGroupByItem);
};

const groupByItem = (
  ids: number[],
  fetchedQuestions: FetchedQuestion[]
): QuestionGroupByItem[] => {
  return ids.map((id: number): QuestionGroupByItem => {
    // 共通データの代表値として、0番目のデータを取得
    const representative: FetchedQuestion = fetchedQuestions.filter(
      (fetched: FetchedQuestion) => fetched.id === id
    )[0];

    // id毎に選択肢をまとめる
    const items: QuestionItem[] | undefined =
      representative.type === 'text' || representative.type === 'number'
        ? undefined
        : fetchedQuestions
            .filter((fetched: FetchedQuestion) => fetched.id === id)
            .map((fetched: FetchedQuestion) => ({
              id: fetched.item_id!,
              name: fetched.item!,
              isDescription: fetched.is_description!,
              isDeleted: fetched.is_item_deleted!
            }));

    return {
      id,
      question: representative.question,
      type: representative.type,
      required: representative.required,
      headline: representative.headline,
      items,
      group: representative.group !== undefined ? representative.group : '',
      groupId: representative.group_id,
      canInherit: representative.can_inherit,
      isDeleted: representative.is_question_deleted,
      priority: representative.priority
    };
  });
};

const deleteGroup = (
  questionsGroupByItem: QuestionGroupByItem[]
): Question[] => {
  return questionsGroupByItem.map(
    (question: QuestionGroupByItem): Question => ({
      id: question.id,
      question: question.question,
      type: question.type,
      required: question.required,
      headline: question.headline,
      items: question.items,
      canInherit: question.canInherit,
      isDeleted: question.isDeleted,
      priority: question.priority
    })
  );
};

const sortQuestionsById = (
  response: GetQuestionResponse
): GetQuestionResponse => {
  return [...response].sort((a, b) => {
    const idA = 'groupId' in a ? a.questions[0].priority : a.priority;
    const idB = 'groupId' in b ? b.questions[0].priority : b.priority;

    return idA - idB;
  });
};

const groupByGroup = (
  questionsGroupByItem: QuestionGroupByItem[]
): GetQuestionResponse => {
  // グループを持った設問を抽出
  const questionHasGroup: QuestionGroupByItem[] = questionsGroupByItem.filter(
    (question: QuestionGroupByItem) => question.group!
  );
  // グループを持たない設問を抽出
  const questionNotHaveGroup: QuestionGroupByItem[] =
    questionsGroupByItem.filter(
      (question: QuestionGroupByItem) => !question.group!
    );

  // グループIDの重複なしリストを作成
  const groupIds: number[] = [
    ...new Set(
      questionHasGroup.map((question: QuestionGroupByItem) => question.groupId!)
    )
  ];

  const groupedQuestions: GroupedQuestion[] = groupIds.map(
    (groupId: number): GroupedQuestion => {
      const targetQuestions: QuestionGroupByItem[] = questionHasGroup.filter(
        (question: QuestionGroupByItem) => question.groupId === groupId
      );
      const questions: Question[] = deleteGroup(questionHasGroup);

      return { groupId, group: targetQuestions[0].group!, questions };
    }
  );

  const questions: Question[] = deleteGroup(questionNotHaveGroup);

  return sortQuestionsById([...groupedQuestions, ...questions]);
};

export const createGetResponseBody = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<{ statusCode: number; body: object }> => {
  if (queryStringParameters!.questionnairId === undefined) {
    const body = { message: 'アンケートのIDが指定されていません。' };
    return { statusCode: 400, body };
  }

  try {
    const questionnairId: number = convertStringToNumber(
      queryStringParameters.questionnairId,
      1
    );
    const isAll: boolean = convertStringToBoolean(queryStringParameters.isAll);

    const questions: GetQuestionResponse = await fetchQuestions(
      db,
      questionnairId,
      isAll
    );

    const inheritance: GetInheritanceResponse | undefined =
      await fetchInheritance(db, questionnairId);

    const response: GetResponse = { questions, inheritance };

    const body = { message: 'success', ...response };
    return { statusCode: 200, body };
  } catch (e) {
    if (
      e instanceof Error &&
      e.message === '不正なパラメータが指定されました。'
    ) {
      const body = { message: e.message };
      return { statusCode: 400, body };
    }

    console.error(e);
    return {
      statusCode: 500,
      body: { message: '予期せぬエラーが発生しました。' }
    };
  }
};
