import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik } from "formik";
import React, { VFC } from "react";
import { TaskListsSelect } from "../molecules/TaskListsSelect";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
  },
  titleContainer: {
    marginBottom: theme.spacing(2),
  },
}));

export const SettingsPage: VFC = () => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12} className={classes.titleContainer}>
        <Typography>Settings</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Formik initialValues={{ defaultListId: "" }} onSubmit={console.log}>
            {() => (
              <Grid container component={Form}>
                <Grid item xs={12} container alignItems={"center"}>
                  <Grid item xs={3}>
                    <Typography>Default List</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TaskListsSelect />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Formik>
        </Paper>
      </Grid>
    </Grid>
  );
};
