import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik } from "formik";
import React, { VFC } from "react";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { appSelector } from "../../modules/selector/appSelector";
import { appActions } from "../../modules/slice/appSlice";
import { TaskListsSelect } from "../molecules/TaskListsSelect";

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
}));

export const SettingsPage: VFC = () => {
  const classes = useStyles();
  const { setDefaultListId } = useBoundActions(appActions);
  const { defaultListId } = useSelectors(appSelector, "defaultListId");

  return (
    <Grid container>
      <Grid item xs={12} className={classes.titleContainer}>
        <Typography>Settings</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Formik
            enableReinitialize
            initialValues={{ listId: defaultListId }}
            onSubmit={(v, { setSubmitting }) => {
              setSubmitting(false);
              setDefaultListId(v.listId);
            }}
          >
            {() => (
              <Grid container component={Form} spacing={2}>
                <Grid
                  item
                  xs={12}
                  container
                  alignItems={"flex-end"}
                  justify={"space-between"}
                >
                  <Grid item>
                    <Typography>Default List</Typography>
                  </Grid>
                  <Grid item className={classes.listIdSelectContainer}>
                    <TaskListsSelect />
                  </Grid>
                </Grid>
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
