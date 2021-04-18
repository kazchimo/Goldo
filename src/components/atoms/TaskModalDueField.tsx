import { Field, FieldProps, FormikHelpers } from "formik";
import { DatePicker } from "formik-material-ui-pickers";
import React from "react";

export const TaskModalDueField: React.FC<{
  setFieldValue: FormikHelpers<{ due?: string }>["setFieldValue"];
}> = ({ setFieldValue }) => {
  return (
    <Field name={"due"} label={"Due"}>
      {(props: FieldProps) => (
        <DatePicker
          {...props}
          onChange={(v) => setFieldValue("due", v)}
          disablePast
          disableToolbar
          variant={"static"}
        />
      )}
    </Field>
  );
};
