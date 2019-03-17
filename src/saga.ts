import { fork, put, call, takeEvery } from '@redux-saga/core/effects';

import {
  failureType,
  requestType,
  successType,
  postType,
  putType,
  getType,
  deleteType,
  stripBase
} from './rest-actions';
import { IAction } from './types';

let fetchAlt: any = null;
export const setFetchAlt = (alt: any) => {
  fetchAlt = alt;
};

function makeRequestWorker(method: 'get' | 'post' | 'put' | 'delete') {
  return function*(action: IAction) {
    const type = stripBase(action.type);
    if (!action.payload) {
      throw Error('payload is undefined');
    }

    if (fetchAlt === null) {
      throw Error('Please call setFetchAlt with your request creator');
    }

    try {
      // Create a +REQUEST action. Can be used to create loading states.
      yield put({ type: requestType(type) });

      // Fetch data to the server.
      const { data } = yield call(
        fetchAlt[method],
        action.payload.url,
        action.payload.data
      );
      yield put({ type: successType(type), payload: data });
      if (action.payload.callback && action.payload.callback.onSuccess) {
        yield call(action.payload.callback.onSuccess);
      }
    } catch (err) {
      yield put({ type: failureType(type), payload: { error: err.message } });
      if (action.payload.callback && action.payload.callback.onFailure) {
        yield call(action.payload.callback.onFailure);
      }
    }
  };
}

const matchPattern = (pattern: string) => {
  const regex = new RegExp(pattern);
  return (action: IAction) =>
    regex.test(action.type) && action.type.indexOf('+') === -1;
};

// Following functions look for rest actions and if they find any, they'll run
// the appropriate worker.

export function* watchPosts() {
  yield takeEvery(matchPattern(postType('.*')), makeRequestWorker('post'));
}

export function* watchPuts() {
  yield takeEvery(matchPattern(putType('.*')), makeRequestWorker('put'));
}

export function* watchGets() {
  yield takeEvery(matchPattern(getType('.*')), makeRequestWorker('get'));
}

export function* watchDeletes() {
  yield takeEvery(matchPattern(deleteType('.*')), makeRequestWorker('delete'));
}

export default function* sagas() {
  yield* [
    fork(watchPosts),
    fork(watchPuts),
    fork(watchGets),
    fork(watchDeletes)
  ];
}
