import * as pgPromise from 'pg-promise';
import {
  PutEventBody,
  PutExistingQuestion,
  PutExistingQuestionItem,
  PutNewQuestion,
  PutNewQuestionItem
} from './interface/EventBody';
import * as pg from 'pg-promise/typescript/pg-subset';
import {
  fetchQuestionTypeId,
  insertQuestionItems,
  extractItems,
  insertQuestions,
  insertInheritance
} from './common';
import {
  DBUpdateQuestionnair,
  DBNewQuestion,
  DBNewQuestionItem,
  FetchedQuestionType,
  DBUpdateQuestionnairMetadata,
  DBExistingQuestion,
  DBExistingQuestionItem
} from './interface/Question';
import { DBInheritance } from './interface/Inheritance';
import { PutResponse } from './interface/Response';

const pgp = pgPromise({});

const updateQuestionnairMetadata = async (
  metadata: DBUpdateQuestionnairMetadata,
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
) => {
  const metadataUpdateColumnSet = new pgp.helpers.ColumnSet([
    'updated_date',
    'name'
  ]);

  const condition = pgp.as.format(' where id=$1', metadata.id);

  const metadataUpdateQuery =
    pgp.helpers.update(metadata, metadataUpdateColumnSet, 'questionnairs') +
    condition;
  await t
    .any(metadataUpdateQuery)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

const updateQuestions = async (
  existingQuestions: DBExistingQuestion[] | undefined,
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
) => {
  if (existingQuestions === undefined) {
    return;
  }
  const existingUpdateColumnSet = new pgp.helpers.ColumnSet([
    'question',
    'question_type_id',
    'required',
    'headline',
    'can_inherit',
    'is_deleted',
    'priority'
  ]);

  await Promise.all(
    existingQuestions.map(async (existingQuestion: DBExistingQuestion) => {
      const condition = pgp.as.format(' WHERE id = $1', existingQuestion.id);
      const existingUpdateQuery =
        pgp.helpers.update(
          existingQuestion,
          existingUpdateColumnSet,
          'questions'
        ) + condition;
      const questionId = await t
        .one(existingUpdateQuery + ' RETURNING id')
        .then((data) => {
          return data;
        })
        .catch((error) => {
          throw error;
        });

      return questionId.id;
    })
  );
};

const updateQuestionItems = async (
  items: DBExistingQuestionItem[],
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
) => {
  const questionItemsColumnSet = new pgp.helpers.ColumnSet([
    'item_name',
    'is_description',
    'is_deleted',
    'priority'
  ]);

  await Promise.all(
    items.map(async (item: DBExistingQuestionItem) => {
      const condition = pgp.as.format(` WHERE id = $1`, item.id);
      const existingUpdateQuery =
        pgp.helpers.update(item, questionItemsColumnSet, 'question_items') +
        condition;
      await t
        .any(existingUpdateQuery)
        .then((data) => {
          return data;
        })
        .catch((error) => {
          throw error;
        });
    })
  );
};

const upsertInheritance = async (
  inheritance: DBInheritance,
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
) => {
  const query = 'SELECT COUNT(*) FROM inheritances WHERE questionnair_id = $1';

  const existInheritance: boolean = await t
    .one(query, [inheritance.questionnair_id])
    .then((data) => Number(data.count) > 0)
    .catch((error) => {
      throw error;
    });

  if (existInheritance) {
    updateInheritance(inheritance, t);
  } else {
    insertInheritance(inheritance, t);
  }
};

const updateInheritance = async (
  inheritance: DBInheritance,
  t: pgPromise.ITask<Record<string, never>> & Record<string, never>
) => {
  const inheritanceUpdateColumnSet = new pgp.helpers.ColumnSet([
    'is_same_user',
    'question_id'
  ]);

  const condition = pgp.as.format(
    ' WHERE questionnair_id = $1',
    inheritance.questionnair_id
  );

  const inheritanceUpdatequery =
    pgp.helpers.update(
      inheritance,
      inheritanceUpdateColumnSet,
      'inheritances'
    ) + condition;

  await t
    .any(inheritanceUpdatequery)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

const getInheritanceQuestionId = (
  inheritance: DBInheritance,
  newQuestionIds?: number[]
): number | undefined => {
  if (
    inheritance.question_id === undefined &&
    inheritance.question_index === undefined
  )
    return undefined;

  if (inheritance.question_id !== undefined) return inheritance.question_id;

  if (
    newQuestionIds === undefined ||
    inheritance.question_index === undefined ||
    inheritance.question_index > newQuestionIds.length - 1
  )
    throw new Error('不正なパラメータが指定されています。');
  return newQuestionIds![inheritance.question_index];
};

export const updateQuestionnair = async (
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>,
  questionnair: DBUpdateQuestionnair
): Promise<PutResponse> => {
  await db.tx(async (t) => {
    // questionnairsテーブルを更新
    await updateQuestionnairMetadata(questionnair.metadata, t);

    // questionsテーブルを更新（existing)
    await updateQuestions(questionnair.existing, t);
    // question_itemsテーブルに対し更新および挿入
    if (questionnair.existing !== undefined) {
      await Promise.all(
        questionnair.existing.map(async (question: DBExistingQuestion) => {
          if (question.items === undefined) return;

          if (question.items.existing !== undefined)
            await updateQuestionItems(question.items.existing, t);
          if (question.items.new !== undefined)
            await insertQuestionItems(question.items.new, t);
        })
      );
    }

    const newQuestionIds: number[] | undefined =
      questionnair.new !== undefined
        ? await insertQuestions(questionnair.new, t)
        : undefined;

    // questionsテーブルに挿入（new）
    if (questionnair.new !== undefined) {
      const questionItems: DBNewQuestionItem[] = extractItems(
        questionnair.new,
        newQuestionIds!
      );
      // question_itemsテーブルに挿入（new）
      if (questionItems.length !== 0) {
        await insertQuestionItems(questionItems, t);
      }
    }

    // inheritancesテーブルを更新
    if (questionnair.inheritance !== undefined) {
      const inheritance: DBInheritance = {
        is_same_user: questionnair.inheritance.is_same_user,
        questionnair_id: questionnair.metadata.id,
        question_id: getInheritanceQuestionId(
          questionnair.inheritance,
          newQuestionIds
        )
      };
      await upsertInheritance(inheritance, t);
    }
  });

  return {
    questionnairId: questionnair.metadata.id,
    name: questionnair.metadata.name,
    updatedDate: questionnair.metadata.updated_date
  };
};

const createNewQuestions = (
  eventBody: PutEventBody,
  questionTypes: FetchedQuestionType[]
) => {
  const questions: DBNewQuestion[] | undefined = eventBody.new?.map(
    (putQuestion: PutNewQuestion): DBNewQuestion => {
      const items: DBNewQuestionItem[] | undefined =
        putQuestion.items === undefined
          ? undefined
          : putQuestion.items.map(
              (putQuestionItem: PutNewQuestionItem): DBNewQuestionItem => ({
                item_name: putQuestionItem.name,
                is_description: putQuestionItem.isDescription,
                priority: putQuestionItem.priority
              })
            );

      // question_type_idを検索
      const questionTypeIdIndex = questionTypes.findIndex(
        (questionType: FetchedQuestionType) =>
          questionType.type === putQuestion.type
      );

      return {
        question: putQuestion.question,
        question_type_id: questionTypes[questionTypeIdIndex].id,
        required: putQuestion.required,
        headline: putQuestion.headline,
        questionnair_id: eventBody.questionnairId,
        can_inherit: putQuestion.canInherit,
        priority: putQuestion.priority,
        items: items
      };
    }
  );
  return questions;
};

const createExistingQuestions = (
  eventBody: PutEventBody,
  questionTypes: FetchedQuestionType[]
) => {
  const questions: DBExistingQuestion[] | undefined = eventBody.existing?.map(
    (putExistingQuestion: PutExistingQuestion) => {
      const existingItems: DBExistingQuestionItem[] | undefined =
        putExistingQuestion.items?.existing?.map(
          (putExistingQuestionItem: PutExistingQuestionItem) => {
            return {
              id: putExistingQuestionItem.id,
              item_name: putExistingQuestionItem.name,
              is_description: putExistingQuestionItem.isDescription,
              priority: putExistingQuestionItem.priority,
              is_deleted: putExistingQuestionItem.isDeleted
            };
          }
        );
      const newItems: DBNewQuestionItem[] | undefined =
        putExistingQuestion.items?.new?.map(
          (putNewQuestionItem: PutNewQuestionItem) => {
            return {
              question_id: putExistingQuestion.id,
              item_name: putNewQuestionItem.name,
              is_description: putNewQuestionItem.isDescription,
              priority: putNewQuestionItem.priority
            };
          }
        );

      // question_type_idを検索
      const questionTypeIdIndex = questionTypes.findIndex(
        (questionType: FetchedQuestionType) =>
          questionType.type === putExistingQuestion.type
      );

      return {
        id: putExistingQuestion.id,
        question: putExistingQuestion.question,
        question_type_id: questionTypes[questionTypeIdIndex].id,
        required: putExistingQuestion.required,
        headline: putExistingQuestion.headline,
        can_inherit: putExistingQuestion.canInherit,
        is_deleted: putExistingQuestion.isDeleted,
        priority: putExistingQuestion.priority,
        items:
          existingItems === undefined && newItems === undefined
            ? undefined
            : {
                existing: existingItems,
                new: newItems
              }
      };
    }
  );
  return questions;
};

const formData = async (
  eventBody: PutEventBody,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
): Promise<DBUpdateQuestionnair> => {
  const updatedDate = new Date();
  const questionTypes: FetchedQuestionType[] = await fetchQuestionTypeId(db);

  const newQuestions: DBNewQuestion[] | undefined = createNewQuestions(
    eventBody,
    questionTypes
  );
  const existingQuestions: DBExistingQuestion[] | undefined =
    createExistingQuestions(eventBody, questionTypes);

  const questionnairMetaData: DBUpdateQuestionnairMetadata = {
    id: eventBody.questionnairId,
    updated_date: updatedDate,
    name: eventBody.questionnairName
  };

  return {
    existing: existingQuestions,
    new: newQuestions,
    inheritance:
      eventBody.inheritance !== undefined
        ? {
            questionnair_id: eventBody.questionnairId,
            is_same_user: eventBody.inheritance.isSameUser,
            question_id: eventBody.inheritance.questionId,
            question_index: eventBody.inheritance.questionIndex
          }
        : undefined,
    metadata: questionnairMetaData
  };
};

export const createPutResponseBody = async (
  eventBody: PutEventBody,
  db: pgPromise.IDatabase<Record<string, never>, pg.IClient>
) => {
  const questionnair: DBUpdateQuestionnair = await formData(eventBody, db);

  try {
    const response = await updateQuestionnair(db, questionnair);
    const body = { message: 'success', ...response };
    return { statusCode: 200, body };
  } catch (error) {
    console.error(error);
    return { statusCode: 400, body: { message: (error as Error).message } };
  }
};
