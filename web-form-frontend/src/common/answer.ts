import { Dispatch, SetStateAction } from 'react';
import { Answer } from '../interface/Answer';

export const getTempAnswers = (tempPath: string): Answer[] => {
  return localStorage.getItem(tempPath) !== null
    ? JSON.parse(localStorage.getItem(tempPath)!)
    : [];
};

export const removeTempAnswers = (tempPath: string) => {
  if (localStorage.getItem(tempPath) !== null) {
    localStorage.removeItem(tempPath);
  }
};

export const removeAnswer =
  (answers: Answer[], setAnswers: Dispatch<SetStateAction<Answer[]>>) =>
  (questionId: number) =>
  (itemId?: number) => {
    setAnswers(
      answers.filter(
        (answer: Answer) =>
          answer.questionId !== questionId || answer.itemId !== itemId
      )
    );
  };

export const addAnswer =
  (answers: Answer[], setAnswers: Dispatch<SetStateAction<Answer[]>>) =>
  (questionId: number) =>
  (itemId?: number, textAnswer?: string): void => {
    const newAnswer: Answer = { questionId, itemId, textAnswer };
    setAnswers([...answers, newAnswer]);
  };

export const updateDescriptionAnswer =
  (answers: Answer[], setAnswers: Dispatch<SetStateAction<Answer[]>>) =>
  (questionId: number) =>
  (textAnswer: string, itemId?: number) => {
    const newAnswer: Answer = { questionId, itemId, textAnswer };
    const otherAnswers: Answer[] = answers.filter(
      (answer: Answer) =>
        answer.questionId !== questionId || answer.itemId !== itemId
    );

    setAnswers([...otherAnswers, newAnswer]);
  };
