import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import {
  DBNewQuestion,
  DBNewQuestionItem,
  FetchedQuestionType
} from './interface/Question';
import { DBInheritance } from './interface/Inheritance';

const pgp = pgPromise({});

// question_typeテーブルからquestion_type_idを取ってくる
export const fetchQuestionTypeId = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<FetchedQuestionType[]> => {
  const getQuestionTypeIdQuery: string =
    'SELECT id, question_type AS type FROM question_types';
  const questionTypes: FetchedQuestionType[] = await db
    .any(getQuestionTypeIdQuery)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
  return questionTypes;
};

export const extractItems = (
  questions: DBNewQuestion[],
  questionIds: number[]
): DBNewQuestionItem[] => {
  return questions
    .filter((question: DBNewQuestion) => question.items !== undefined)
    .map((question: DBNewQuestion, index: number) => {
      const itemsPerQuestion: DBNewQuestionItem[] = question.items!.map(
        (item: DBNewQuestionItem) => ({
          question_id: questionIds[index],
          ...item
        })
      );
      return itemsPerQuestion;
    })
    .flat();
};

export const insertQuestionItems = async (
  questionItems: DBNewQuestionItem[],
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
): Promise<number[]> => {
  const questionItemsColumnSet = new pgp.helpers.ColumnSet([
    'question_id',
    'item_name',
    'is_description',
    'priority'
  ]);

  const questionItemsInsertquery = pgp.helpers.insert(
    questionItems,
    questionItemsColumnSet,
    'question_items'
  );

  const itemIds = await t
    .any(questionItemsInsertquery + 'RETURNING id')
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });

  return itemIds.map((id) => id.id);
};

export const insertQuestions = async (
  questions: DBNewQuestion[],
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
): Promise<number[]> => {
  const questionsColumnSet = new pgp.helpers.ColumnSet([
    'question',
    'question_type_id',
    'required',
    'headline',
    'questionnair_id',
    'can_inherit',
    'priority'
  ]);

  const questionsInsertquery = pgp.helpers.insert(
    questions,
    questionsColumnSet,
    'questions'
  );

  const questionIds = await t
    .any(questionsInsertquery + 'RETURNING id')
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });

  return questionIds.map((id) => id.id);
};

export const insertInheritance = async (
  inheritance: DBInheritance,
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
) => {
  const inheritanceColumnSet = new pgp.helpers.ColumnSet([
    'questionnair_id',
    'is_same_user',
    'question_id'
  ]);

  const inheritanceInsertquery = pgp.helpers.insert(
    inheritance,
    inheritanceColumnSet,
    'inheritances'
  );

  await t
    .any(inheritanceInsertquery)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};
