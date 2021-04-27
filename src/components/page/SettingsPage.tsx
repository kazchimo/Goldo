import {
  Button,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik } from "formik";
import React, { VFC } from "react";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { appSelector } from "../../modules/selector/appSelector";
import { themeSelector } from "../../modules/selector/themeSelector";
import { appActions } from "../../modules/slice/appSlice";
import { themeActions } from "../../modules/slice/themeSlice";
import { TaskListsSelect } from "../molecules/TaskListsSelect";
import { ThemeSelect } from "../molecules/ThemeSelect";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
  },
  titleContainer: {
    marginBottom: theme.spacing(2),
  },
  listIdSelectContainer: {
    width: 300,
  },
  saveButtonContainer: {
    textAlign: "end",
    marginTop: theme.spacing(2),
  },
  list: {
    width: "100%",
  },
}));

export const SettingsPage: VFC = () => {
  const classes = useStyles();
  const { setDefaultListId, setTheme } = useBoundActions({
    ...appActions,
    ...themeActions,
  });
  const { defaultListId, theme } = useSelectors(
    { ...appSelector, ...themeSelector },
    "defaultListId",
    "theme"
  );

  return (
    <Grid container>
      <Grid item xs={12} className={classes.titleContainer}>
        <Typography>Settings</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Formik
            enableReinitialize
            initialValues={{ listId: defaultListId, theme }}
            onSubmit={(v, { setSubmitting }) => {
              setSubmitting(false);
              setDefaultListId(v.listId);
              setTheme(v.theme);
            }}
          >
            {() => (
              <Grid container component={Form} spacing={2}>
                <List className={classes.list}>
                  <ListItem divider>
                    <Grid
                      container
                      alignItems={"center"}
                      justify={"space-between"}
                    >
                      <Grid item>
                        <Typography>Default List</Typography>
                      </Grid>
                      <Grid item className={classes.listIdSelectContainer}>
                        <TaskListsSelect />
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid
                      container
                      justify={"space-between"}
                      alignItems={"center"}
                    >
                      <Grid item>
                        <Typography>Theme</Typography>
                      </Grid>
                      <Grid item className={classes.listIdSelectContainer}>
                        <ThemeSelect />
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
                <Grid item xs={12} className={classes.saveButtonContainer}>
                  <Button type={"submit"} variant={"outlined"} color="primary">
                    Save
                  </Button>
                </Grid>
              </Grid>
            )}
          </Formik>
        </Paper>
      </Grid>
    </Grid>
  );
};
