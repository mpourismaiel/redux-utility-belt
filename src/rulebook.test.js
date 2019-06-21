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
    let called = false;
    const middleware = rulebook([
      { rule: action => action && action.type, fn: () => (called = true) }
    ]);

    const { next, invoke } = create(middleware);
    const action = { type: 'TEST' };
    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(called).toEqual(true);
  });
  it('should call callbacks if a rule is proven', () => {
    let called = false;
    const middleware = rulebook([
      { rule: action => action && action.type, fn: () => (called = true) }
    ]);

    const { next, invoke } = create(middleware);
    const action = { type: 'TEST' };
    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(called).toEqual(true);
  });

  it('should call array of callbacks if a rule is proven', () => {
    let called = 0;
    const middleware = rulebook([
      {
        rule: action => action && action.type,
        fn: [() => called++, () => called++]
      }
    ]);

    const { next, invoke } = create(middleware);
    const action = { type: 'TEST' };
    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(called).toEqual(2);
  });

  it('should call callbacks with dispatch if a rule is proven', () => {
    const newAction = { type: 'NEW_ACTION' };
    const middleware = rulebook([
      {
        rule: action => action && action.type,
        fn: (_, { dispatch }) => dispatch(newAction)
      }
    ]);

    const { store, next, invoke } = create(middleware);
    const action = { type: 'TEST' };
    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(store.dispatch).toHaveBeenCalledWith(newAction);
  });

  it('should not call callbacks if a rule is proven', () => {
    let called = false;
    const middleware = rulebook([
      {
        rule: action => action && action.type === 'NOT_TEST',
        fn: () => (called = true)
      }
    ]);

    const { next, invoke } = create(middleware);
    const action = { type: 'TEST' };
    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(called).toEqual(false);
  });
});
