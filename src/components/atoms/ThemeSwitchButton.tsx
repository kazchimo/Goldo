import { IconButton, Tooltip } from "@material-ui/core";
import React, { useCallback } from "react";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import { useSelector } from "react-redux";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { themeSelector } from "../../modules/selector/themeSelector";
import { themeActions } from "../../modules/slice/themeSlice";

export const ThemeSwitchButton: React.FC = () => {
  const { toDarkTheme, toLightTheme } = useBoundActions(themeActions);
  const theme = useSelector(themeSelector.theme);

  const flip = useCallback(() => {
    if (theme === "light") {
      toDarkTheme();
    } else {
      toLightTheme();
    }
  }, [theme]);

  return (
    <Tooltip title={"Toggle light/dark theme"}>
      <IconButton onClick={flip}>
        <Brightness4Icon />
      </IconButton>
    </Tooltip>
  );
};
