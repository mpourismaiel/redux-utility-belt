# Redux utility belt

A bunch of functions to make writing reducers, action creators and making API calls a bit less tedious.

## Usage

Install the library by running:

```
yarn add redux-utility-belt
```

### Making API calls

You need to add the restSaga and set axios (or any other library with the four supported methods (`get`, `post`, `put`, `delete`) that receive `url` and `data` as their arguments):

```
import { restSagas, setFetchAlt } from 'redux-utility-belt';

...
sagaMiddleware.run(restSagas);
```

In order to make API calls, create an action. The action type must be the result of calling one of the rest action type:

```
import { postType, putType, getType, deleteType } from 'redux-utility-belt';

export const LOGIN = 'AUTH/LOGIN';

export const login = ({ email, password }) => ({
  type: postType(LOGIN),
  payload: { data: { email, password }, baseType: LOGIN, url: '/login' },
});
```

You can also pass callbacks to `callback.onSuccess` and `callback.onFailure`.

### Creating reducers

Reducers created by the utility belt are made to work with the restSaga. So in order to make it easier to make API calls, the reducer object passed to the function has 5 keys: `get`, `post`, `put`, `delete`, `none`. The action is passed to `none` object if `action.type` is not the result of calling one of the rest action types.

Rest types in the reducer have three types: `request`, `success` or `failure`.

```
import { postType, createReducer } from 'redux-utility-belt';
import { Dictionary } from '../../types';

// Constants
export const LOGIN = 'AUTH/LOGIN';

// Action Creators
export const login = ({ email, password }) => ({
  type: postType(LOGIN),
  payload: { data: { email, password }, baseType: LOGIN, url: '/login' },
});

// Reducer
export interface AuthState {
  isLoggingIn: boolean;
  user: Dictionary<any>;
  token: null | string;
  error: null | string;
}

const token = localStorage.getItem('auth_token');
export const initialState: AuthState = {
  isLoggingIn: token !== 'undefined' && token !== undefined && token !== null,
  user: {},
  token: token === 'undefined' ? null : token || null,
  error: null,
};

const auth = createReducer<AuthState>(initialState, {
  post: {
    [LOGIN]: {
      request: state => ({ ...state, isLoggingIn: true, error: null }),
      failure: (state, action) => ({
        ...state,
        isLoggingIn: false,
        error: action.payload,
      }),
      success: (state, { payload: { token, ...user } }) => {
        localStorage.setItem('auth_token', token);
        return {
          ...state,
          isLoggingIn: false,
          user,
          token,
        };
      },
    },
  },
});
```

Created using the fantastic [TypeScript library starter](https://github.com/alexjoverm/typescript-library-starter)
