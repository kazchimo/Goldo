import { Button, Grid } from "@material-ui/core";
import { addDays } from "date-fns";
import { Field, FieldProps, FormikHelpers } from "formik";
import { DatePicker } from "formik-material-ui-pickers";
import React from "react";

export const TaskModalDueField: React.FC<{
  setFieldValue: FormikHelpers<{ due?: string }>["setFieldValue"];
}> = ({ setFieldValue }) => {
  return (
    <Field name={"due"} label={"Due"}>
      {(props: FieldProps) => (
        <Grid container>
          <Grid item>
            <Button
              onClick={() => setFieldValue("due", new Date())}
              color="primary"
            >
              Today
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => setFieldValue("due", addDays(new Date(), 1))}
            >
              Tomorrow
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => setFieldValue("due", undefined)}
              color="secondary"
            >
              Remove
            </Button>
          </Grid>
          <Grid item style={{ width: 310, height: 305 }}>
            {props.field.value && (
              <DatePicker
                {...props}
                onChange={(v) => setFieldValue("due", v)}
                disablePast
                disableToolbar
                variant={"static"}
              />
            )}
          </Grid>
        </Grid>
      )}
    </Field>
  );
};
