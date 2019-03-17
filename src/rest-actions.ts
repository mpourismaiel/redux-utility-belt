let base = 'REST_ACTION/';
export const setBase = (type: string) => {
  base = type;
};

const post = 'REST_POST/';
const put = 'REST_PUT/';
const get = 'REST_GET/';
const deleteT = 'REST_DELETE/';

export const baseType = (type: string): string => base + type;

export const requestType = (type: string): string =>
  baseType(type + '+REQUEST');
export const successType = (type: string): string =>
  baseType(type + '+SUCCESS');
export const failureType = (type: string): string =>
  baseType(type + '+FAILURE');

export const postType = (type: string): string => baseType(post + type);
export const putType = (type: string): string => baseType(put + type);
export const getType = (type: string): string => baseType(get + type);
export const deleteType = (type: string): string => baseType(deleteT + type);

export const stripBase = (type: string): string =>
  type.indexOf(base) === 0 ? type.replace(`${base}/`, '') : type;

export const stripRest = (type: string): string => {
  const withoutBase = stripBase(type);
  return withoutBase.indexOf('REST_') === 0
    ? withoutBase.replace(/REST_(POST|PUT|GET|DELETE)\//, '')
    : type;
};
