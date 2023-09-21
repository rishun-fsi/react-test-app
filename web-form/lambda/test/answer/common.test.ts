import { formatDate } from '../../answer/common';

describe('formatDateのテスト', () => {
  test('YYYY-MM-dd形式に変換できることのテスト', () => {
    const date: Date = new Date(2023, 0, 2);
    expect(formatDate(date)).toBe('2023-01-02');
  });
});
