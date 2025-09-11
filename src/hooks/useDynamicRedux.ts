import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useMemo } from "react";

type SelectedState<TSelectors extends Record<string, (state: any) => any>> = {
  [K in keyof TSelectors]: ReturnType<TSelectors[K]>;
};

export function useDynamicRedux<
  TState,
  TSelectors extends Record<string, (state: TState) => any>,
  TActions extends Record<string, (...args: any[]) => any>
>(
  selectors: TSelectors = {} as TSelectors,
  actions: TActions = {} as TActions
) {
  const dispatch = useDispatch<any>();

  // گرفتن state ها از Redux store
  const selectedValues = {} as SelectedState<TSelectors>;
  for (const key in selectors) {
    const selector = selectors[key as keyof TSelectors] as (state: TState) => any;
    (selectedValues as any)[key] = useSelector(selector, shallowEqual);
  }

  // Memoize خروجی state تا reference ثابت بمونه
  const state = useMemo(() => selectedValues, [Object.values(selectedValues)]);

  // آماده کردن اکشن‌ها و Memoize آنها
  const boundActions = useMemo(() => {
    const obj = {} as {
      [K in keyof TActions]: (
        ...args: Parameters<TActions[K]>
      ) => ReturnType<TActions[K]>;
    };
    for (const key in actions) {
      const actionCreator = actions[key] as (...args: any[]) => any;
      (obj as any)[key] = (...args: any[]) => dispatch(actionCreator(...args));
    }
    return obj;
  }, [actions, dispatch]);

  // خروجی نهایی memoize شده
  return useMemo(() => ({ state, actions: boundActions }), [state, boundActions]);
}


