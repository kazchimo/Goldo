import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { isToday } from "date-fns";
import { Field, FieldProps, Form, Formik } from "formik";
import { InputBase, Select } from "formik-material-ui";
import { DatePicker } from "formik-material-ui-pickers";
import React from "react";
import * as Yup from "yup";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { appSelector } from "../../modules/selector/appSelector";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
import { tasksActions } from "../../modules/slice/taskSlice";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    padding: theme.spacing(2),
  },
  taskList: {
    marginLeft: theme.spacing(2),
  },
  addButtonContainer: {
    marginLeft: "auto",
  },
}));

const schema = Yup.object().shape({
  title: Yup.string().required(),
  listId: Yup.string().required(),
});

export const TodayTaskAddForm: React.FC = () => {
  const classes = useStyles();
  const { taskLists, defaultListId } = useSelectors(
    { ...taskListsSelector, ...appSelector },
    "taskLists",
    "defaultListId"
  );
  const { createTask } = useBoundActions(tasksActions);

  return (
    <Paper elevation={0} className={classes.paper} variant={"outlined"}>
      <Formik
        initialValues={{
          title: "",
          notes: "",
          due: new Date(),
          listId: defaultListId || "",
        }}
        onSubmit={(v, { setSubmitting, resetForm }) => {
          createTask({ task: { ...v, due: v.due.toISOString() } });
          setSubmitting(false);
          resetForm();
        }}
        enableReinitialize
        validationSchema={schema}
      >
        {({ setFieldValue }) => (
          <Form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Field name="title" placeholder={"title"}>
                  {(props: FieldProps) => (
                    <InputBase {...props} placeholder={"title"} fullWidth />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Field name={"notes"}>
                  {(props: FieldProps) => (
                    <InputBase {...props} placeholder={"detail"} fullWidth />
                  )}
                </Field>
              </Grid>
              <Grid item container alignItems={"flex-end"}>
                <Grid item>
                  <Field name={"due"}>
                    {(props: FieldProps<Date>) => (
                      <DatePicker
                        {...props}
                        labelFunc={(d) =>
                          d ? (isToday(d) ? "Today" : d?.toDateString()) : ""
                        }
                        disablePast
                        disableToolbar
                        variant={"inline"}
                        onChange={(v) => setFieldValue("due", v)}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item className={classes.taskList}>
                  <FormControl style={{ width: 120 }}>
                    <InputLabel>Task List</InputLabel>
                    <Field component={Select} name={"listId"}>
                      {taskLists.map((list) => (
                        <MenuItem key={list.id} value={list.id}>
                          {list.title}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid>
                <Grid item className={classes.addButtonContainer}>
                  <Button
                    variant={"outlined"}
                    color={"primary"}
                    type={"submit"}
                    size={"small"}
                    style={{ textTransform: "none" }}
                  >
                    add new task
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};
