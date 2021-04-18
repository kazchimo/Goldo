import { Field, FieldProps } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";

export const TaskModalNotesField: React.FC = () => {
  return (
    <Field name={"notes"}>
      {(props: FieldProps) => (
        <TextField
          {...props}
          label={"detail"}
          multiline
          fullWidth
          variant={"outlined"}
          rows={2}
        />
      )}
    </Field>
  );
};
