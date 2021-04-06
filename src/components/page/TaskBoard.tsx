import React, { useEffect } from "react";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { actions } from "../../modules/reducers";
import { selectors } from "../../modules/selectors";

export const TaskBoard: React.FC = () => {
  const { fetchTaskLists } = useBoundActions(actions);
  const { taskLists } = useSelectors(selectors, "taskLists");

  useEffect(() => {
    fetchTaskLists();
  }, []);

  return (
    <div>
      {taskLists.map((t) => (
        <p>{t.title}</p>
      ))}
    </div>
  );
};
