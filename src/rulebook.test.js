import rulebook from './rulebook';

const create = middleware => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn()
  };
  const next = jest.fn();

  const invoke = action => middleware(store)(next)(action);

  return { store, next, invoke };
};

describe('rulebook', () => {
  it('should call callbacks if a rule is proven', () => {
    const callback = jest.fn(() => expect(callback).toHaveBeenCalled());
    const middleware = rulebook([
      { rule: action => action && action.type, fn: callback }
    ]);

    const { next, invoke } = create(middleware);
    const action = { type: 'TEST' };
    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
  });

  it('should call callbacks if a rule is proven', () => {
    const callback = jest.fn(() => expect(callback).toHaveBeenCalled());
    const middleware = rulebook([
      { rule: action => action && action.type, fn: callback }
    ]);

    const { next, invoke } = create(middleware);
    const action = { type: 'TEST' };
    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
  });

  it('should call array of callbacks if a rule is proven', () => {
    const callback = jest.fn(() => expect(callback).toHaveBeenCalledTimes(2));
    const middleware = rulebook([
      {
        rule: action => action && action.type,
        fn: [callback, callback]
      }
    ]);

    const { next, invoke } = create(middleware);
    const action = { type: 'TEST' };
    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
  });

  it('should call callbacks with dispatch if a rule is proven', () => {
    const callback = jest.fn(() =>
      expect(callback).toHaveBeenCalledWith(newAction, store)
    );
    const newAction = { type: 'NEW_ACTION' };
    const middleware = rulebook([
      {
        rule: action => action && action.type,
        fn: callback
      }
    ]);

    const { store, next, invoke } = create(middleware);
    const action = { type: 'TEST' };
    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
  });

  it('should not call callbacks if a rule is proven', () => {
    const callback = jest.fn(() => expect(callback).toHaveBeenCalled());
    const middleware = rulebook([
      {
        rule: action => action && action.type === 'NOT_TEST',
        fn: callback
      }
    ]);

    const { next, invoke } = create(middleware);
    const action = { type: 'TEST' };
    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
  });
});
