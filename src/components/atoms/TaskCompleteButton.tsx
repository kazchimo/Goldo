import { IconButton, IconButtonProps } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import React, { useCallback, useState } from "react";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

type Props = {} & IconButtonProps;

export const TaskCompleteButton: React.FC<Props> = ({ ...props }) => {
  const [hover, setHover] = useState(false);
  const enter = useCallback(() => setHover(true), [setHover]);
  const leave = useCallback(() => setHover(false), [setHover]);

  return (
    <IconButton
      {...props}
      size={"small"}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {hover ? (
        <DoneIcon fontSize={"small"} color={"primary"} />
      ) : (
        <RadioButtonUncheckedIcon fontSize={"small"} />
      )}
    </IconButton>
  );
};
