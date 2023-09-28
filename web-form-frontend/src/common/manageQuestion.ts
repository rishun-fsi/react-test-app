import { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  NewQuestion,
  NewQuestionItem,
  QuestionType,
  EditingQuestion,
  EditingQuestionItem,
  ExistingQuestion,
  Question,
  QuestionItem,
  ExistingQuestionItem,
  FetchedQuestion
} from '../interface/Question';

type UpdateType = 'string' | 'boolean';

export const handleSelectChange =
  (
    questions: EditingQuestion[],
    setQuestions: Dispatch<SetStateAction<EditingQuestion[]>>
  ) =>
  (index: number) =>
  (event: SelectChangeEvent) => {
    const type: QuestionType = event.target.value as QuestionType;

    const updated = questions.map((question: EditingQuestion, i: number) => {
      if (i !== index) return question;

      return {
        ...question,
        type,
        items:
          question.items === undefined && type !== 'text' ? [] : question.items
      };
    });

    setQuestions(updated);
  };

export const addQuestion =
  (
    questions: EditingQuestion[],
    setQuestions: Dispatch<SetStateAction<EditingQuestion[]>>
  ) =>
  (setFocusingIndex: Dispatch<SetStateAction<number>>) =>
  (type: QuestionType) =>
  () => {
    const newQuestionLength: number = questions.filter(
      (question: EditingQuestion) => !('isDeleted' in question)
    ).length;
    const newQuestion: NewQuestion = {
      id: -(newQuestionLength + 1),
      question: '',
      type,
      required: false,
      headline: '',
      items: type === 'text' ? undefined : [],
      canInherit: false
    };

    const index: number = questions.findIndex(
      (question: EditingQuestion) =>
        'isDeleted' in question && question.isDeleted
    );

    if (index === -1) {
      setFocusingIndex(questions.length);
      setQuestions([...questions, newQuestion]);
      return;
    }

    const copied = [...questions];
    copied.splice(index, 0, newQuestion);
    setFocusingIndex(index);
    setQuestions(copied);
  };

export const addQuestionItem =
  (
    questions: EditingQuestion[],
    setQuestions: Dispatch<SetStateAction<EditingQuestion[]>>
  ) =>
  (index: number, newItemName: string) =>
  () => {
    const items: EditingQuestionItem[] = [
      ...questions[index].items!,
      { name: newItemName, isDescription: false }
    ];
    const updated = questions.map((question: EditingQuestion, i: number) => {
      if (i !== index) return question;

      const itemIndex: number = question.items!.findIndex(
        (item: EditingQuestionItem) => 'isDeleted' in item && item.isDeleted
      );

      if (itemIndex === -1) {
        return { ...question, items };
      }

      const copiedItem: EditingQuestionItem[] = [...question.items!];
      copiedItem.splice(itemIndex, 0, {
        name: newItemName,
        isDescription: false
      });
      return { ...question, items: copiedItem };
    });

    setQuestions(updated);
  };

export const switchOrder =
  (
    questions: EditingQuestion[],
    setQuestions: Dispatch<SetStateAction<EditingQuestion[]>>
  ) =>
  (setFocusingIndex: Dispatch<SetStateAction<number>>) =>
  (index: number, isUpward: boolean) =>
  () => {
    const switchTarget: EditingQuestion = isUpward
      ? questions[index - 1]
      : questions[index + 1];
    const switching: EditingQuestion = questions[index];

    const switched: EditingQuestion[] = questions.map(
      (question: NewQuestion, i: number) => {
        if (index === i) {
          return { ...switchTarget };
        } else if (
          (isUpward && i === index - 1) ||
          (!isUpward && i === index + 1)
        ) {
          return { ...switching };
        }

        return question;
      }
    );

    setFocusingIndex(isUpward ? index - 1 : index + 1);
    setQuestions(switched);
  };

export const deleteNewQuestion =
  (
    questions: NewQuestion[],
    setQuestions: Dispatch<SetStateAction<NewQuestion[]>>
  ) =>
  (setFocusingIndex: Dispatch<SetStateAction<number>>) =>
  (index: number) =>
  () => {
    const deleted = questions.filter((_, i: number) => i !== index);
    setFocusingIndex(-1);
    setQuestions(deleted);
  };

export const updateQuestion =
  (
    questions: EditingQuestion[],
    setQuestions: Dispatch<SetStateAction<EditingQuestion[]>>
  ) =>
  (index: number, key: string, valueType: UpdateType) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    const updatedValue: string | boolean =
      valueType === 'string'
        ? (event.target.value as string)
        : event.target.checked;

    const updated = questions.map((question: NewQuestion, i: number) => {
      if (i !== index) return question;

      return { ...question, [key]: updatedValue };
    });

    setQuestions(updated);
  };

export const updateQuestionItem =
  (
    questions: EditingQuestion[],
    setQuestions: Dispatch<SetStateAction<EditingQuestion[]>>
  ) =>
  (questionIndex: number, itemIndex: number, key: string) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    const updatedValue: string | boolean =
      key === 'name' ? (event.target.value as string) : event.target.checked;
    const updatedItems: EditingQuestionItem[] = questions[
      questionIndex
    ].items!.map((item: NewQuestionItem, i: number) => {
      if (i !== itemIndex) return item;

      return { ...item, [key]: updatedValue };
    });
    const updated: EditingQuestion[] = questions.map(
      (question: EditingQuestion, i: number) => {
        if (i !== questionIndex) return question;

        return { ...question, items: updatedItems };
      }
    );

    setQuestions(updated);
  };

export const deleteNewQuestionItem =
  (
    questions: NewQuestion[],
    setQuestions: Dispatch<SetStateAction<NewQuestion[]>>
  ) =>
  (questionIndex: number, itemIndex: number) =>
  () => {
    const deleted = questions.map((question: NewQuestion, i: number) => {
      if (i !== questionIndex) return question;

      return {
        ...question,
        items: question.items!.filter((_, j: number) => j !== itemIndex)
      };
    });

    setQuestions(deleted);
  };

export const completelyExpandQuestionResponse = (
  questionResponse: FetchedQuestion[]
): ExistingQuestion[] => {
  const flattened: Question[] = questionResponse
    .map((question: FetchedQuestion): Question | Question[] => {
      if ('group' in question) {
        return question.questions;
      }

      return question;
    })
    .flat();

  return flattened.map(
    (question: Question): ExistingQuestion => ({
      ...question,
      items:
        question.items !== undefined
          ? question.items.map(
              (item: QuestionItem): ExistingQuestionItem => ({
                ...item
              })
            )
          : undefined
    })
  );
};
