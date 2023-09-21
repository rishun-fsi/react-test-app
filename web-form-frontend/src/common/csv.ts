import {
  ExistingQuestion,
  EditingQuestionItem,
  ExistingQuestionItem,
  QuestionType
} from '../interface/Question';
import { HeaderForFormat } from '../interface/CSV';
import { Answer } from '../interface/Answer';
import { isNumber } from './index';

export const createHeadersForFormat = (
  headerRow: string,
  questions: ExistingQuestion[]
): HeaderForFormat[] => {
  const csvHeaders: string[] = parseCSV(headerRow);
  const headers: string[] = csvHeaders.filter(
    filterAnswerHeaders(csvHeaders.length)
  );
  return headers.map((header: string) => {
    const headline: string = header.includes('_')
      ? header.split('_')[0]
      : header;
    const target: ExistingQuestion | undefined = questions.find(
      (question: ExistingQuestion) => question.headline === headline
    );
    if (target === undefined)
      throw new Error(
        'アンケートの形式とCSVファイルの形式が一致しませんでした。'
      );

    const id: number = target.id;
    const type: QuestionType = target.type;

    if (header.includes('_')) {
      const item: EditingQuestionItem | undefined = target.items!.find(
        (item: EditingQuestionItem) => item.name === header.split('_')[1]
      );
      if (item === undefined)
        throw new Error(
          'アンケートの形式とCSVファイルの形式が一致しませんでした。'
        );
      const itemId: number = (item as ExistingQuestionItem).id;
      const isDescription: boolean = (item as ExistingQuestionItem)
        .isDescription;

      return { id, header, type, itemId, isDescription };
    }

    return { id, header, type };
  });
};

const filterAnswerHeaders =
  (length: number) =>
  (_: any, index: number): boolean =>
    index > 0 && index < length - 4;

const eliminateDoubleQuatation = (str: string): string => {
  if (str.match(/^"/g) && str.match(/"$/g)) return str.slice(1, -1);
  return str;
};

const startsWithOddDoubleQuatation = (str: string): boolean => {
  const chars: string[] = str.split('');

  const firstNotDoubleQuatationIndex: number = chars.findIndex(
    (char: string) => char !== '"'
  );
  return firstNotDoubleQuatationIndex % 2 === 1;
};

const endsWithOddDoubleQuatation = (str: string): boolean => {
  const reversed: string = str.split('').reverse().join();

  return startsWithOddDoubleQuatation(reversed);
};

const decodeDoubleQuatation = (str: string) => str.replace(/""/g, '"');

export const parseCSV = (row: string): string[] => {
  return row
    .split(',')
    .map(eliminateDoubleQuatation)
    .reduce((accumulator: string[], str: string, index: number) => {
      if (endsWithOddDoubleQuatation(str)) {
        return [
          ...accumulator.slice(0, -2),
          `${accumulator[accumulator.length - 2]},${str}`
        ];
      }
      if (accumulator.length > index) {
        return [
          ...accumulator.slice(0, -2),
          `${accumulator[accumulator.length - 2]},${str}`,
          ''
        ];
      }
      if (startsWithOddDoubleQuatation(str)) {
        return [...accumulator, str, ''];
      }
      return [...accumulator, str];
    }, [])
    .map(eliminateDoubleQuatation)
    .map(decodeDoubleQuatation);
};

const getItemId = (
  questions: ExistingQuestion[],
  questionId: number,
  answer: string
): number => {
  try {
    return (
      questions
        .find((question: ExistingQuestion) => question.id === questionId)!
        .items!.find(
          (item: EditingQuestionItem) => item.name === answer
        )! as ExistingQuestionItem
    ).id;
  } catch (e) {
    throw new Error('存在しない選択肢が指定されています。');
  }
};

export const formatAnswer =
  (csvHeaders: HeaderForFormat[], questions: ExistingQuestion[]) =>
  (accumulator: Answer[], answer: string, index: number) => {
    const header: HeaderForFormat = csvHeaders[index];
    const questionId: number = header.id;
    if (
      (header.type === 'select' || header.type === 'radio') &&
      answer !== ''
    ) {
      const itemId: number = getItemId(questions, questionId, answer);
      return [...accumulator, { questionId, itemId }];
    } else if (
      header.type === 'check' &&
      !header.isDescription &&
      answer === '1'
    ) {
      return [...accumulator, { questionId, itemId: header.itemId! }];
    } else if (
      header.type === 'check' &&
      header.isDescription &&
      answer !== ''
    ) {
      return [
        ...accumulator,
        {
          questionId,
          itemId: header.itemId!,
          textAnswer: answer
        }
      ];
    } else if (
      (header.type === 'text' && answer !== '') ||
      (header.type === 'number' && isNumber(answer))
    ) {
      return [...accumulator, { questionId, textAnswer: answer }];
    }

    return [...accumulator];
  };
