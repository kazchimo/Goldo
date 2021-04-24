import { Grid, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import dagre from "dagre";
import React, { VFC } from "react";
import ReactFlow, {
  Elements,
  isNode,
  Node,
  Position,
} from "react-flow-renderer";
import { TaskList } from "../../lib/gapi";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { TaskView } from "../../lib/taskView/TaskView";
import { tasksSelector } from "../../modules/selector/taskSelector";
import { TaskCompleteButton } from "../atoms/TaskCompleteButton";
import { TaskListItemText } from "../atoms/TaskListItemText";

const nodeWidth = 300;
const nodeHeight = 36;

const taskToNode = (source: TaskView): Node => ({
  id: source.id,
  type: "default",
  data: {
    label: (
      <Grid container alignItems={"center"}>
        <Grid item xs={3}>
          <TaskCompleteButton task={source} />
        </Grid>
        <Grid item xs={9}>
          <TaskListItemText task={source} />
        </Grid>
      </Grid>
    ),
  },
  position: { x: 0, y: 0 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
});

const taskListToNode = (source: TaskList): Node => ({
  id: source.id,
  type: "default",
  data: { label: <Typography color="textPrimary">{source.title}</Typography> },
  position: { x: 0, y: 0 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
});

const mkEdge = (source: { id: string }, target: { id: string }) => ({
  id: source.id + target.id,
  source: source.id,
  target: target.id,
  type: "step",
});

const taskViewToElement = (task: TaskView): Elements => {
  if (task.children.length === 0) {
    return [taskToNode(task)];
  } else {
    return [
      taskToNode(task),
      ...task.children.flatMap((t) => taskViewToElement(t)),
      ...task.children.map((t) => mkEdge(task, t)),
    ];
  }
};

type Props = {
  taskList: TaskList;
};

export const TaskMindMap: VFC<Props> = ({ taskList }) => {
  const { tasksViewByListId } = useSelectors(
    tasksSelector,
    "tasksViewByListId"
  );
  const { palette } = useTheme();

  const tasks = tasksViewByListId[taskList.id] || [];
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: "LR", align: "DL" });
  graph.setDefaultEdgeLabel(() => ({}));

  const elems = [
    ...tasks.flatMap((t) => taskViewToElement(t)),
    taskListToNode(taskList),
    ...tasks.map((t) => mkEdge(taskList, t)),
  ];

  elems.forEach((el) => {
    if (isNode(el)) {
      graph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      graph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(graph);

  const layouted = elems.map((el) => {
    if (isNode(el)) {
      const nodeWithPosition = graph.node(el.id);
      el.targetPosition = Position.Left;
      el.sourcePosition = Position.Right;

      el.style = {
        ...el.style,
        background: palette.background.paper,
        borderColor: palette.text.primary,
        width: nodeWidth,
      };

      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });

  return (
    <div style={{ height: 800 }}>
      <ReactFlow
        elements={layouted}
        nodesDraggable={false}
        zoomOnScroll={false}
        panOnScroll
      />
    </div>
  );
};
