import { Field, FieldProps } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";

export const TaskModalTitleField: React.FC = () => {
  return (
    <Field name={"title"}>
      {(props: FieldProps) => (
        <TextField
          {...props}
          label={"title"}
          multiline
          fullWidth
          variant={"outlined"}
        />
      )}
    </Field>
  );
};
