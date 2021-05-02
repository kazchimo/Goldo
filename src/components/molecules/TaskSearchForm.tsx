import { IconButton, InputBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, VFC } from "react";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  input: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
  },
  startAdornment: {
    marginLeft: theme.spacing(1),
  },
}));

export const TaskSearchForm: VFC = () => {
  const classes = useStyles();
  const [word, setWord] = useState("");

  return (
    <InputBase
      startAdornment={<SearchIcon />}
      endAdornment={
        word !== "" ? (
          <IconButton size={"small"}>
            <ClearIcon />
          </IconButton>
        ) : (
          <></>
        )
      }
      className={classes.input}
      value={word}
      onChange={(v) => setWord(v.target.value)}
      classes={{
        inputAdornedStart: classes.startAdornment,
      }}
      placeholder="Search Tasks"
    />
  );
};
