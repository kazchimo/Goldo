import { call, put, takeEvery } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { GResponse, hasId, Task, Tasks, UninitTask } from "../../lib/gapi";
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

  yield put(tasksActions.addTasks(tasks));
}

function* createTask({
  payload: { task, previous },
}: Action<{ task: UninitTask; previous?: string }>) {
  const res: GResponse<Task> = yield call(
    gapi.client.tasks.tasks.insert,
    {
      tasklist: task.listId,
      parent: task.parent,
      previous,
    },
    task
  );

  yield put(
    snackbarActions.success({
      message: "Create task",
    })
  );
  yield put(tasksActions.addTask(res.result));
}

function* completeTask({ payload: { id, listId } }: Action<Task>) {
  yield call(
    gapi.client.tasks.tasks.update,
    {
      tasklist: listId,
      task: id,
    },
    { id: id, status: "completed" }
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

function* deleteTask({ payload: task }: Action<Task>) {
  yield call(gapi.client.tasks.tasks.delete, {
    tasklist: task.listId,
    task: task.id,
  });
}

export const taskSaga = [
  takeEvery(tasksActions.fetchTasks, fetchTasks),
  takeEvery(tasksActions.createTask, createTask),
  takeEvery(tasksActions.completeTask, completeTask),
  takeEvery(tasksActions.updateTask, updateTask),
  takeEvery(tasksActions.deleteTask, deleteTask),
];
