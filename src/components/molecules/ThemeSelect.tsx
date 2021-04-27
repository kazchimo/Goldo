import { FormControl, InputLabel, MenuItem } from "@material-ui/core";
import { Field } from "formik";
import { Select } from "formik-material-ui";
import React, { VFC } from "react";

export const ThemeSelect: VFC = () => {
  return (
    <FormControl style={{ width: "100%" }}>
      <InputLabel>Theme</InputLabel>
      <Field component={Select} name={"theme"}>
        <MenuItem key={"light"} value={"light"}>
          Light
        </MenuItem>
        <MenuItem key={"dark"} value={"dark"}>
          Dark
        </MenuItem>
      </Field>
    </FormControl>
  );
};
