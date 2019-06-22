import { AnyAction, Dispatch } from 'redux';

export type Rule<A = AnyAction, S = any> = (action?: A, store?: S) => boolean;
export type Callback<A = AnyAction, S = any> = (action?: A, store?: S) => void;

export type Rules = ({
  rule: Rule;
  fn: Callback | Callback[];
})[];

const rulebook = (rules: Rules) => {
  return store => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    rules.forEach(
      rule =>
        rule.rule(action, store) &&
        setTimeout(
          () =>
            typeof rule.fn === 'function'
              ? rule.fn(action, store)
              : (rule.fn as Callback[]).forEach(fn => fn(action, store)),
          0
        )
    );
    return next(action);
  };
};

export default rulebook;
