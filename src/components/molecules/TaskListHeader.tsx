import {
  Grid,
  IconButton,
  ListSubheader,
  makeStyles,
  Popover,
  Tooltip,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useCallback, useState } from "react";
import { TaskList } from "../../lib/gapi";
import { TaskAddForm } from "./TaskAddForm";
import { TaskListOptions } from "./TaskListOptions";
import { TaskListTitleForm } from "./TaskListTitleForm";

type Props = {
  taskList: TaskList;
};

const useStyles = makeStyles((theme) => ({
  subHeader: {
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 8,
  },
  addForm: {
    marginRight: 8,
  },
}));

export const TaskListHeader: React.FC<Props> = ({ taskList }) => {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [anchor, setAnchor] = useState<Element | null>(null);

  const open = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setAnchor(e.currentTarget);
      setOpenModal(true);
    },
    [setOpenModal]
  );
  const close = useCallback(() => setOpenModal(false), [setOpenModal]);

  return (
    <ListSubheader className={classes.subHeader}>
      <Popover
        open={openModal}
        onBackdropClick={close}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        anchorEl={anchor}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <TaskListOptions taskList={taskList} />
      </Popover>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify={"space-between"}>
            <Grid item>
              <Tooltip title={"Rename title"} placement={"right"}>
                <div>
                  <TaskListTitleForm taskList={taskList} />
                </div>
              </Tooltip>
            </Grid>
            <Grid item>
              <IconButton size={"small"} onClick={open}>
                <MoreVertIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TaskAddForm taskList={taskList} />
        </Grid>
      </Grid>
    </ListSubheader>
  );
};
