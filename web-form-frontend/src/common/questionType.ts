import { QuestionTypeObject } from '../interface/Question';

export const questionTypes: QuestionTypeObject[] = [
  { type: 'select', name: 'プルダウン' },
  { type: 'radio', name: 'ラジオボタン' },
  { type: 'check', name: 'チェックボックス' },
  { type: 'text', name: 'テキスト' },
  { type: 'number', name: '数字' }
];
