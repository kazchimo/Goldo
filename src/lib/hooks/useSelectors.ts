import _ from "lodash";
import { useSelector } from "react-redux";
import { OutputSelector } from "reselect";
import { State } from "../../modules/reducers";

export const useSelectors = <
  T extends { [key: string]: OutputSelector<any, any, any> },
  M extends (keyof T)[]
>(
  selectors: T,
  ...memoizer: M
) => {
  const s = Object.keys(selectors)
    .filter((k) => memoizer.includes(k))
    .reduce(
      (prev, key) => (s: State) => ({
        ...prev(s),
        [key]: selectors[key](s),
      }),
      (_: State) => ({} as { [key in M[number]]: ReturnType<T[key]> })
    );

  return useSelector(s, (a, b) =>
    memoizer.length !== 0
      ? _.isEqual(_.pick(a, memoizer), _.pick(b, memoizer))
      : _.isEqual(a, b)
  );
};
