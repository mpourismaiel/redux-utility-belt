import { IAction } from './types';
import {
  getType,
  postType,
  putType,
  patchType,
  deleteType,
  stripBase,
  requestType,
  successType,
  failureType
} from './rest-actions';
import rulebook from './rulebook';

const matchPattern = (pattern: string) => {
  const regex = new RegExp(pattern);
  return (action: IAction) =>
    regex.test(action.type) && action.type.indexOf('+') === -1;
};

const isGet = matchPattern(getType('.*'));
const isPost = matchPattern(postType('.*'));
const isPut = matchPattern(putType('.*'));
const isPatch = matchPattern(patchType('.*'));
const isDelete = matchPattern(deleteType('.*'));

const isRequest = action =>
  action &&
  action.type &&
  (isGet(action) ||
    isPost(action) ||
    isPut(action) ||
    isPatch(action) ||
    isDelete(action));

const requestMethod = action => {
  if (isGet(action)) {
    return 'get';
  } else if (isPost(action)) {
    return 'post';
  } else if (isPut(action)) {
    return 'put';
  } else if (isPatch(action)) {
    return 'patch';
  } else if (isDelete(action)) {
    return 'delete';
  }
};

export type Options = { failCondition?: (response) => boolean };

const restMiddleware = (fetchAlt, options: Options = {}) =>
  rulebook([
    {
      rule: isRequest,
      fn: async (action, { dispatch }) => {
        if (!action) return;

        if (!action.payload) {
          throw Error('payload is undefined');
        }

        const type = stripBase(action.type);
        const method = requestMethod(action);
        try {
          // Create a +REQUEST action. Can be used to create loading states.
          dispatch({ type: requestType(type), meta: action.meta });

          // Fetch data to the server.
          const config = {
            url: action.payload.url,
            method: method,
            data: action.payload.data,
            headers: action.payload.headers,
            ...action.payload.config
          };

          if (!config.headers) delete config.headers;
          if (!config.data) delete config.data;
          const response = await fetchAlt(config);

          if (options.failCondition && options.failCondition(response)) {
            throw response;
          } else {
            dispatch({
              type: successType(type),
              payload: response,
              meta: action.meta
            });

            if (action.payload.callback && action.payload.callback.onSuccess) {
              action.payload.callback.onSuccess(response, action);
            }
          }
        } catch (error) {
          dispatch({
            type: failureType(type),
            payload: { error },
            meta: action.meta
          });

          if (action.payload.callback && action.payload.callback.onFailure) {
            action.payload.callback.onFailure(error, action);
          }
        }
      }
    }
  ]);

export default restMiddleware;
