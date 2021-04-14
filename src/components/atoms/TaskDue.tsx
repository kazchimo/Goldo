import { Grid, Paper, Typography } from "@material-ui/core";
import { differenceInDays, parseISO } from "date-fns";
import React from "react";
import EventNoteIcon from "@material-ui/icons/EventNote";

type Props = {
  due: string;
};

const dayString = (day: number) => {
  switch (day) {
    case 0:
      return "Today";
    case 1:
      return "Tomorrow";
    case -1:
      return "Yesterday";
    default:
      if (day > 0) {
        return `In ${day} days`;
      } else {
        return `${-day} days ago`;
      }
  }
};

export const TaskDue: React.FC<Props> = ({ due }) => {
  const diff = differenceInDays(parseISO(due), new Date()) + 1;

  return (
    <Paper
      elevation={0}
      variant={"outlined"}
      style={{ maxWidth: "fit-content" }}
    >
      <Grid container>
        <Grid
          item
          style={{
            height: 20,
          }}
        >
          <EventNoteIcon
            fontSize={"small"}
            color={diff >= 0 ? "primary" : "secondary"}
          />
        </Grid>
        <Grid item>
          <Typography
            color={diff >= 0 ? "primary" : "secondary"}
            variant={"caption"}
          >
            {dayString(diff)}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
