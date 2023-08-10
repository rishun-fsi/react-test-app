import { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  NewQuestion,
  ExistingQuestion,
  NewQuestionItem,
  ExistingQuestionItem,
  QuestionType
} from '../interface/Question';

type UpdateType = 'string' | 'boolean';

export const handleSelectChange =
  (
    questions: (NewQuestion | ExistingQuestion)[],
    setQuestions: Dispatch<SetStateAction<(NewQuestion | ExistingQuestion)[]>>
  ) =>
  (index: number) =>
  (event: SelectChangeEvent) => {
    const type: QuestionType = event.target.value as QuestionType;

    const updated = questions.map(
      (question: NewQuestion | ExistingQuestion, i: number) => {
        if (i !== index) return question;

        return { ...question, type };
      }
    );

    setQuestions(updated);
  };

export const addQuestion =
  (
    questions: (NewQuestion | ExistingQuestion)[],
    setQuestions: Dispatch<SetStateAction<(NewQuestion | ExistingQuestion)[]>>
  ) =>
  (type: QuestionType) =>
  () => {
    const newQuestion: NewQuestion = {
      question: '',
      type,
      required: false,
      headline: '',
      items: [],
      canInherit: false
    };

    const index: number = questions.findIndex(
      (question: NewQuestion | ExistingQuestion) =>
        'isDeleted' in question && question.isDeleted
    );

    if (index === -1) {
      setQuestions([...questions, newQuestion]);
      return;
    }

    const copied = [...questions];
    copied.splice(index, 0, newQuestion);
    setQuestions(copied);
  };

export const addQuestionItem =
  (
    questions: (NewQuestion | ExistingQuestion)[],
    setQuestions: Dispatch<SetStateAction<(NewQuestion | ExistingQuestion)[]>>
  ) =>
  (index: number, newItemName: string) =>
  () => {
    const items: (NewQuestionItem | ExistingQuestionItem)[] = [
      ...questions[index].items,
      { name: newItemName, isDiscription: false }
    ];
    const updated = questions.map(
      (question: NewQuestion | ExistingQuestion, i: number) => {
        if (i !== index) return question;

        const itemIndex: number = question.items.findIndex(
          (item: NewQuestionItem | ExistingQuestionItem) =>
            'isDeleted' in item && item.isDeleted
        );

        if (itemIndex === -1) {
          return { ...question, items };
        }

        const copiedItem: (NewQuestionItem | ExistingQuestionItem)[] = [
          ...question.items
        ];
        copiedItem.splice(itemIndex, 0, {
          name: newItemName,
          isDiscription: false
        });
        return { ...question, items: copiedItem };
      }
    );

    setQuestions(updated);
  };

export const switchOrder =
  (
    questions: (NewQuestion | ExistingQuestion)[],
    setQuestions: Dispatch<SetStateAction<(NewQuestion | ExistingQuestion)[]>>
  ) =>
  (index: number, isUpward: boolean) =>
  () => {
    const switchTarget: NewQuestion | ExistingQuestion = isUpward
      ? questions[index - 1]
      : questions[index + 1];
    const switching: NewQuestion | ExistingQuestion = questions[index];

    const switched: (NewQuestion | ExistingQuestion)[] = questions.map(
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

    setQuestions(switched);
  };

export const deleteNewQuestion =
  (
    questions: NewQuestion[],
    setQuestions: Dispatch<SetStateAction<NewQuestion[]>>
  ) =>
  (index: number) =>
  () => {
    const deleted = questions.filter((_, i: number) => i !== index);
    setQuestions(deleted);
  };

export const updateQuestion =
  (
    questions: (NewQuestion | ExistingQuestion)[],
    setQuestions: Dispatch<SetStateAction<(NewQuestion | ExistingQuestion)[]>>
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
    questions: (NewQuestion | ExistingQuestion)[],
    setQuestions: Dispatch<SetStateAction<(NewQuestion | ExistingQuestion)[]>>
  ) =>
  (questionIndex: number, itemIndex: number, key: string) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    const updatedValue: string | boolean =
      key === 'name' ? (event.target.value as string) : event.target.checked;
    const updatedItems: (NewQuestionItem | ExistingQuestionItem)[] = questions[
      questionIndex
    ].items.map((item: NewQuestionItem, i: number) => {
      if (i !== itemIndex) return item;

      return { ...item, [key]: updatedValue };
    });
    const updated: (NewQuestion | ExistingQuestion)[] = questions.map(
      (question: NewQuestion | ExistingQuestion, i: number) => {
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
        items: question.items.filter((_, j: number) => j !== itemIndex)
      };
    });

    setQuestions(deleted);
  };
