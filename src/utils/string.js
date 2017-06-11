import * as R from 'ramda';

export const equalsIgnoreCase = (strA, strB) => {
  return !R.isNil(strA) &&
      !R.isNil(strB) && strA.toUpperCase() === strB.toUpperCase() ||
      strA === strB;
};
