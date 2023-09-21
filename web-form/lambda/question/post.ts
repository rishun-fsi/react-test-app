import * as pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import {
  fetchQuestionTypeId,
  insertQuestions,
  insertQuestionItems,
  insertInheritance,
  extractItems
} from './common';
import {
  DBQuestionnair,
  DBNewQuestion,
  DBNewQuestionItem,
  FetchedQuestionType,
  DBQuestionnairMetadata
} from './interface/Question';
import { DBInheritance } from './interface/Inheritance';
import { PostResponse } from './interface/Response';
import {
  PostEventBody,
  PostedQuestion,
  PostedQuestionItem
} from './interface/EventBody';

const pgp = pgPromise({});

export const insertQuestionnairMetadata = async (
  metadata: DBQuestionnairMetadata,
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
): Promise<number> => {
  const questionnairMetadataColumnSet = new pgp.helpers.ColumnSet([
    'user_id',
    'created_date',
    'updated_date',
    'name'
  ]);

  const questionnairInsertQuery = pgp.helpers.insert(
    metadata,
    questionnairMetadataColumnSet,
    'questionnairs'
  );

  const metadataId = await t
    .one(questionnairInsertQuery + 'RETURNING id')
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });

  return metadataId.id;
};

const insertQuestionnair = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  questionnair: DBQuestionnair
): Promise<PostResponse> => {
  const questionnairId = await db
    .tx(async (t) => {
      // questionnairsテーブルに挿入
      const metadataId: number = await insertQuestionnairMetadata(
        questionnair.metadata,
        t
      );

      // questionsテーブルに挿入
      const questions: DBNewQuestion[] = questionnair.questions.map(
        (question: DBNewQuestion): DBNewQuestion => ({
          ...question,
          questionnair_id: metadataId
        })
      );
      const questionIds: number[] = await insertQuestions(questions, t);

      // question_itemsテーブルに挿入
      const questionItems: DBNewQuestionItem[] = extractItems(
        questions,
        questionIds
      );
      if (questionItems.length !== 0) {
        await insertQuestionItems(questionItems, t);
      }

      // inheritancesテーブルに挿入
      if (questionnair.inheritance !== undefined) {
        const inheritance: DBInheritance = {
          is_same_user: questionnair.inheritance.is_same_user,
          questionnair_id: metadataId,
          question_id:
            questionnair.inheritance.question_index !== undefined &&
            questionnair.inheritance.question_index >= 0 &&
            questionnair.inheritance.question_index < questionIds.length
              ? questionIds[questionnair.inheritance.question_index]
              : undefined
        };
        await insertInheritance(inheritance, t);
      }

      return metadataId;
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });

  return {
    questionnairId,
    userId: questionnair.metadata.user_id,
    name: questionnair.metadata.name,
    createdDate: questionnair.metadata.created_date
  };
};

export const createPostResponseBody = async (
  eventBody: PostEventBody,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
) => {
  const date = new Date();

  const questions: DBNewQuestion[] = await createNewQuestion(eventBody, db);

  const questionnair: DBQuestionnair = {
    metadata: {
      user_id: eventBody.userId,
      created_date: date,
      updated_date: date,
      name: eventBody.name
    },
    inheritance:
      eventBody.inheritance !== undefined
        ? {
            is_same_user: eventBody.inheritance.isSameUser,
            question_index: eventBody.inheritance.questionIndex
          }
        : undefined,
    questions: questions
  };

  const response = await insertQuestionnair(db, questionnair);
  const body = { message: 'success', ...response };
  return { statusCode: 200, body };
};

const createNewQuestion = async (
  eventBody: PostEventBody,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
) => {
  const questionTypes: FetchedQuestionType[] = await fetchQuestionTypeId(db);

  const questions: DBNewQuestion[] = eventBody.questions.map(
    (postedQuestion: PostedQuestion, index: number): DBNewQuestion => {
      const items: DBNewQuestionItem[] | undefined =
        postedQuestion.items === undefined
          ? undefined
          : postedQuestion.items.map(
              (
                postedQuestionItem: PostedQuestionItem,
                itemIndex: number
              ): DBNewQuestionItem => ({
                item_name: postedQuestionItem.name,
                is_description: postedQuestionItem.isDescription,
                priority: itemIndex + 1
              })
            );

      // question_type_idを検索
      const questionTypeIdIndex = questionTypes.findIndex(
        (questionType: FetchedQuestionType) =>
          questionType.type === postedQuestion.type
      );

      return {
        question: postedQuestion.question,
        question_type_id: questionTypes[questionTypeIdIndex].id,
        required: postedQuestion.required,
        headline: postedQuestion.headline,
        can_inherit: postedQuestion.canInherit,
        priority: index + 1,
        items
      };
    }
  );
  return questions;
};
