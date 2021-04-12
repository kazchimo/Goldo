import { call, put, takeEvery } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { GResponse, hasId, Task, Tasks, UninitTask } from "../../lib/gapi";
import { TaskView } from "../../lib/taskView/TaskView";
import { snackbarActions } from "../slice/snackBarSlice";
import { tasksActions } from "../slice/taskSlice";

function* fetchTasks(p: Action<string>) {
  let tasks: Task[] = [];
  let nextToken: string | undefined = undefined;

  while (true) {
    const res: GResponse<Tasks> = yield call(gapi.client.tasks.tasks.list, {
      tasklist: p.payload,
      maxResults: 100,
      showCompleted: false,
      pageToken: nextToken,
    });

    tasks = [
      ...tasks,
      ...(res.result.items
        ?.filter(hasId)
        .map((t) => ({ ...t, listId: p.payload })) || []),
    ];

    if (!res.result.nextPageToken) {
      break;
    } else {
      nextToken = res.result.nextPageToken;
    }
  }

  yield put(tasksActions.addMany(tasks));
  yield put(
    tasksActions.addTasksOnListId({
      tasks,
      listId: p.payload,
    })
  );
}

function* createTask({ payload: { task } }: Action<{ task: UninitTask }>) {
  const res: GResponse<Task> = yield call(
    gapi.client.tasks.tasks.insert,
    {
      tasklist: task.listId,
    },
    task
  );

  yield put(
    snackbarActions.success({
      message: "Create task",
    })
  );
  yield put(tasksActions.add(res.result));
  yield put(
    tasksActions.addTaskOnListId({ task: res.result, listId: task.listId })
  );
}

function* completeTask({
  payload: { taskId, taskListId },
}: Action<{ taskListId: string; taskId: string }>) {
  yield call(
    gapi.client.tasks.tasks.update,
    {
      tasklist: taskListId,
      task: taskId,
    },
    { id: taskId, status: "completed" }
  );
}

function* updateTask({ payload: task }: Action<Task>) {
  yield call(
    gapi.client.tasks.tasks.update,
    {
      tasklist: task.listId,
      task: task.id,
    },
    task
  );
}

export const taskSaga = [
  takeEvery(tasksActions.fetchTasks, fetchTasks),
  takeEvery(tasksActions.createTask, createTask),
  takeEvery(tasksActions.completeTask, completeTask),
  takeEvery(tasksActions.updateTask, updateTask),
];
