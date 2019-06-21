import restMiddleware from './rest-middleware';
import { getType, postType } from './rest-actions';

const create = middleware => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn()
  };
  const next = jest.fn();

  const invoke = action => middleware(store)(next)(action);

  return { store, next, invoke };
};

describe('restMiddleware', () => {
  it('should call fetch when a request action is made', () => {
    const fetch = jest.fn();
    const { store, invoke } = create(restMiddleware(fetch));
    const action = { type: getType('SAMPLE'), payload: { url: '/test' } };
    invoke(action);

    expect(fetch).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should call fetch with appropriate method when a request action is made', () => {
    const fetch = jest.fn();
    const { invoke } = create(restMiddleware(fetch));
    const action = { type: postType('SAMPLE'), payload: { url: '/test' } };
    invoke(action);

    expect(fetch).toHaveBeenCalledWith({ method: 'post', url: '/test' });
  });
});
