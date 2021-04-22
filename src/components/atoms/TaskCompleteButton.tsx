import { IconButton, IconButtonProps } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import React, { useState } from "react";

type Props = {
  isHover?: boolean;
  onHover: () => void;
  onHoverOut: () => void;
} & IconButtonProps;

export const TaskCompleteButton: React.FC<Props> = ({
  isHover,
  onHover,
  onHoverOut,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const enter = () => {
    onHover();
    setHover(true);
  };
  const leave = () => {
    onHoverOut();
    setHover(false);
  };

  return (
    <IconButton
      {...props}
      size={"small"}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {isHover || hover ? (
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
