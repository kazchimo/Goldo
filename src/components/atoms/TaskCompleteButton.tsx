import { IconButton } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import React, { useCallback } from "react";
import { useBool } from "../../lib/hooks/useBool";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { TaskView } from "../../lib/taskView/TaskView";
import { tasksActions } from "../../modules/slice/taskSlice";

type Props = {
  task: TaskView;
  isHover?: boolean;
  onHover?: () => void;
  onHoverOut?: () => void;
};

export const TaskCompleteButton: React.FC<Props> = ({
  task,
  isHover,
  onHover,
  onHoverOut,
}) => {
  const [mouseEnter, onMouseEnter, onMouseLeave] = useBool();
  const enter = () => {
    onHover && onHover();
    onMouseEnter();
  };
  const leave = () => {
    onHoverOut && onHoverOut();
    onMouseLeave();
  };
  const { completeTask } = useBoundActions(tasksActions);

  const finishTask = useCallback(() => {
    completeTask(task);
  }, [task]);

  return (
    <IconButton
      onClick={finishTask}
      size={"small"}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {isHover || mouseEnter ? (
        <DoneIcon
          fontSize={"small"}
          color={"primary"}
          style={{ pointerEvents: "none" }}
        />
      ) : (
        <RadioButtonUncheckedIcon
          fontSize={"small"}
          style={{ pointerEvents: "none" }}
        />
      )}
    </IconButton>
  );
};
