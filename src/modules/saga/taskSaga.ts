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
  payload: { task, taskListId },
}: Action<{ taskListId: string; task: Task }>) {
  if (task.id) {
    const res: GResponse<Task> = yield call(
      gapi.client.tasks.tasks.update,
      {
        tasklist: taskListId,
        task: task.id,
      },
      { ...task, status: "completed" }
    );

    yield put(snackbarActions.success({ message: "Complete task" }));
    yield put(
      tasksActions.successCompleteTask({
        taskId: res.result.id!,
        taskListId: taskListId,
      })
    );
  } else {
    console.log("Has no id");
  }
}

export const taskSaga = [
  takeEvery(tasksActions.fetchTasks, fetchTasks),
  takeEvery(tasksActions.createTask, createTask),
  takeEvery(tasksActions.completeTask, completeTask),
];
