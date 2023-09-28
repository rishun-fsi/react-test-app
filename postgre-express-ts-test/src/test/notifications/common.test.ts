import { isTimestamp } from '../../notifications/common';

describe('isTimestampのテスト', () => {
  test('指定された形式のタイムスタンプであるかを正常に評価できること - true', () => {
    expect(isTimestamp('2023/01/01 10:10:10')).toBe(true);
  });

  test('指定された形式のタイムスタンプであるかを正常に評価できること - false', () => {
    expect(isTimestamp('aaa')).toBe(false);
  });

  test('形式は一致していても日付として成立していなければfalseを返すこと', () => {
    expect(isTimestamp('2023/11/35 10:10:10')).toBe(false);
  });
});
