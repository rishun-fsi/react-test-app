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

export const isStringLengthValid = (str: string, maxLength: number) =>
  str.length <= maxLength;

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

export const isTimestamp = (timestampStr: string): boolean =>
  timestampStr.match(
    /[0-9]{4}\/[0-9]{2}\/[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/g
  ) !== null && isValidDate(new Date(timestampStr));
