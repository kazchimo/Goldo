import { IconButton, IconButtonProps } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import React from "react";
import { useBool } from "../../lib/hooks/useBool";

type Props = {
  isHover?: boolean;
  onHover?: () => void;
  onHoverOut?: () => void;
} & IconButtonProps;

export const TaskCompleteButton: React.FC<Props> = ({
  isHover,
  onHover,
  onHoverOut,
  ...props
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

  return (
    <IconButton
      {...props}
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
