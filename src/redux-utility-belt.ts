export { setFetchAlt, default as restSagas } from './saga';
export {
  setBase,
  baseType,
  requestType,
  successType,
  failureType,
  postType,
  putType,
  getType,
  deleteType
} from './rest-actions';
export { createReducer } from './reducer';
export { default as rulebook } from './rulebook';
export { default as restMiddleware } from './rest-middleware';
