import { Action, AnyAction } from 'redux';

export type Dictionary<T> = { [key: string]: T };

export interface IAction extends Action {
  payload?: {
    base_type?: any;
    data?: any;
    error?: any;
    url?: any;
    callback?: {
      onSuccess?: any;
      onFailure?: any;
    };
    [extraProps: string]: any;
  };
  meta?: any;
}

export type ActionHandler<S = any, A = AnyAction> = (state: S, action: A) => S;

export type RestActionHandlerDictionary<S> = {
  request?: ActionHandler<S>;
  failure?: ActionHandler<S>;
  success?: ActionHandler<S>;
};
