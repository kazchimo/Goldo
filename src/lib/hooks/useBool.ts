import { useCallback, useState } from "react";
import { Effect } from "../types";

export const useBool = (
  initial: boolean = false
): [boolean, Effect, Effect, Effect] => {
  const [state, setState] = useState(initial);
  const toTrue = useCallback(() => setState(true), []);
  const toFalse = useCallback(() => setState(false), []);
  const invert = useCallback(() => setState((prev) => !prev), []);

  return [state, toTrue, toFalse, invert];
};
