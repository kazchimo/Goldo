import { createMuiTheme } from "@material-ui/core";

export const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#3C72F5",
    },
    secondary: {
      main: "#FBB406",
    },
  },
});

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#3C72F5",
    },
    secondary: {
      main: "#FBB406",
    },
  },
});
