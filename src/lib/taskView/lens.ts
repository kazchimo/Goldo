import { Lens } from "monocle-ts";
import { TaskView } from "./TaskView";

export const taskViewChildrenLens = Lens.fromPath<TaskView>()(["children"]);
