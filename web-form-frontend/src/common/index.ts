export const isNumber = (str: string): boolean => {
  return (
    !isNaN(Number(str)) &&
    !str.match(/^\./g) &&
    !str.match(/\.$/g) &&
    str !== ''
  );
};
