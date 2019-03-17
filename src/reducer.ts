import { Reducer, AnyAction } from 'redux';
import {
  Dictionary,
  ActionHandler,
  RestActionHandlerDictionary
} from './types';
import {
  stripBase,
  postType,
  putType,
  getType,
  deleteType,
  successType,
  failureType,
  requestType
} from './rest-actions';

const types = {
  postType,
  putType,
  getType,
  deleteType,
  successType,
  failureType,
  requestType
};

/**
 * Each reducer object can either be reducing rest actions (get, post, put,
 * delete) or normal ones.
 */
export interface ReducerObject<S> {
  none?: Dictionary<ActionHandler<S>>;
  get?: Dictionary<RestActionHandlerDictionary<S>>;
  post?: Dictionary<RestActionHandlerDictionary<S>>;
  put?: Dictionary<RestActionHandlerDictionary<S>>;
  delete?: Dictionary<RestActionHandlerDictionary<S>>;
}

/**
 * Creates a new reducer
 * @returns Reducer function
 * @param initialState Initial State of the reducer
 * @param reducerObject An object to handle different action types
 */
export function reducer<S = any>(
  initialState: S,
  reducerObject: ReducerObject<S>
): Reducer<S, AnyAction> {
  /**
   * Since reducerObject has a weird format and finding action types in that
   * format is a bit hard (requires stripting action types from rest and state
   * the type, finding rest method if exists, check the type in that section)
   * we flatten the reducerObject into a simpler format that wouldn't require
   * any change on the action types in the future. This improves performance.
   */
  const flatReducerObject: Dictionary<ActionHandler<S>> = Object.assign(
    {},
    reducerObject.none as Dictionary<ActionHandler<S>>
  );
  ['get', 'post', 'put', 'delete'].forEach(method =>
    Object.assign(
      flatReducerObject,
      Object.keys(reducerObject[method] || {}).reduce((tmp, key) => {
        const restActions = reducerObject[method][key];
        const methodType = types[`${method}Type`];
        Object.keys(restActions).forEach(state => {
          const stateType = types[`${state}Type`];
          tmp[stripBase(stateType(methodType(stripBase(key))))] =
            restActions[state];
        });
        return tmp;
      }, {})
    )
  );

  return (state: S = initialState, action: AnyAction) => {
    if (flatReducerObject[action.type]) {
      return flatReducerObject[action.type](state, action);
    }
    return state;
  };
}
