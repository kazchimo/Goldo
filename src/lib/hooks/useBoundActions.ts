import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { ActionCreatorsMapObject, bindActionCreators } from "redux";

export const useBoundActions = <T extends ActionCreatorsMapObject>(
  actions: T
) => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return bindActionCreators(actions, dispatch);
  }, [dispatch]);
};
