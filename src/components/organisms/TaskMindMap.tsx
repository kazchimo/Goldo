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

const nodeWidth = 200;
const nodeHeight = 36;

const toNode = (source: { id: string; title?: string }): Node => ({
  id: source.id,
  type: "default",
  data: { label: source.title },
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
    return [toNode(task)];
  } else {
    return [
      toNode(task),
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
  const tasks = tasksViewByListId[taskList.id] || [];
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: "LR" });
  graph.setDefaultEdgeLabel(() => ({}));

  const elems = [
    ...tasks.flatMap((t) => taskViewToElement(t)),
    toNode(taskList),
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

      // unfortunately we need this little hack to pass a slighltiy different position
      // to notify react flow about the change. More over we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });

  return (
    <div style={{ height: 800 }}>
      <ReactFlow elements={layouted} />
    </div>
  );
};
