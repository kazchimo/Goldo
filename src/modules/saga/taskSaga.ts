import { call, put, takeEvery } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { GResponse, Task, Tasks } from "../../lib/gapi";
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

    tasks = [...tasks, ...(res.result.items || [])];

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

function* createTask({
  payload: { taskListId, task },
}: Action<{ taskListId: string; task: Task }>) {
  const res: GResponse<Task> = yield call(
    gapi.client.tasks.tasks.insert,
    {
      tasklist: taskListId,
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
    tasksActions.addTaskOnListId({ task: res.result, listId: taskListId })
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

export const taskSaga = [
  takeEvery(tasksActions.fetchTasks, fetchTasks),
  takeEvery(tasksActions.createTask, createTask),
  takeEvery(tasksActions.completeTask, completeTask),
];
