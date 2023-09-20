import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import {
  FetchedQuestion,
  Question,
  QuestionItem,
  QuestionGroupByItem,
  GroupedQuestion,
  GetResponse
} from './interface/Question';

export const fetchQuestions = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  questionnairId: number,
  isAll: boolean
): Promise<GetResponse> => {
  const query: string =
    'SELECT q.id, q.question, q.required, q.headline, q.questionnair_id, q.can_inherit, i.item_name AS item, i.id AS item_id, i.is_discription, t.question_type AS type, g.name AS group, q.group_id, q.is_deleted AS is_question_deleted, i.is_deleted AS is_item_deleted, q.priority ' +
    'FROM questions AS q INNER JOIN question_items AS i ON q.id = i.question_id ' +
    'INNER JOIN question_types AS t ON q.question_type_id = t.id LEFT JOIN question_groups AS g ON q.group_id = g.id ' +
    `WHERE q.questionnair_id = $1 ${
      isAll ? '' : 'AND NOT q.is_deleted AND NOT i.is_deleted'
    } ` +
    'ORDER BY q.priority, i.priority;';

  const questions: GetResponse = await db
    .any(query, [questionnairId])
    .then((data) => {
      return formData(data);
    })
    .catch((error) => {
      throw error;
    });

  return questions;
};

const formData = (fetchedQuestions: FetchedQuestion[]): GetResponse => {
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
    // id毎に選択肢をまとめる
    const items: QuestionItem[] = fetchedQuestions
      .filter((fetched: FetchedQuestion) => fetched.id === id)
      .map((fetched: FetchedQuestion) => ({
        id: fetched.item_id,
        name: fetched.item,
        isDiscription: fetched.is_discription,
        isDeleted: fetched.is_item_deleted
      }));

    // 共通データの代表値として、0番目のデータを取得
    const representative: FetchedQuestion = fetchedQuestions.filter(
      (fetched: FetchedQuestion) => fetched.id === id
    )[0];

    return {
      id,
      question: representative.question,
      type: representative.type,
      required: representative.required,
      headline: representative.headline,
      items,
      group: representative.group !== undefined ? representative.group : '',
      groupId: representative.group_id,
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
      isDeleted: question.isDeleted,
      priority: question.priority
    })
  );
};

const sortQuestionsById = (response: GetResponse): GetResponse => {
  return [...response].sort((a, b) => {
    const idA = 'groupId' in a ? a.questions[0].priority : a.priority;
    const idB = 'groupId' in b ? b.questions[0].priority : b.priority;

    return idA - idB;
  });
};

const groupByGroup = (
  questionsGroupByItem: QuestionGroupByItem[]
): GetResponse => {
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
