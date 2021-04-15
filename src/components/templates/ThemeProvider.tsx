import { MuiThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../consts/theme";
import { themeSelector } from "../../modules/selector/themeSelector";

export const ThemeProvider: React.FC = ({ children }) => {
  const theme = useSelector(themeSelector.theme);

  return (
    <MuiThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      {children}
    </MuiThemeProvider>
  );
};
