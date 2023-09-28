const isInt = (x: any): boolean => {
  return typeof x === 'number' && x % 1 === 0;
};

export const checkNumberFormat = (
  numberData: number,
  min: number,
  max?: number
) => {
  if (
    numberData < min ||
    !isInt(numberData) ||
    (max !== undefined && numberData > max)
  ) {
    throw new Error('不正なパラメータが指定されました。');
  }
};
