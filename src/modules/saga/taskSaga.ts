import { parseISO } from "date-fns";
import { call, fork, put, takeEvery } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { GResponse, hasId, Task, Tasks, UninitTask } from "../../lib/gapi";
import { loadingActions } from "../slice/loadingSlice";
import { tasksActions, UpdatePayload } from "../slice/taskSlice";

const handleApiTimestampDiscarding = <T extends { due?: string }>(task: T) => {
  // NOTE: handle discarding of portion of timestamp by google api
  const due = task.due !== "" && task.due !== undefined && parseISO(task.due);
  due && due.setHours(9);
  return due;
};

function* fetchTasks(p: Action<string>) {
  let tasks: Task[] = [];
  let nextToken: string | undefined = undefined;

  yield put(loadingActions.onLoading());
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
  yield put(loadingActions.offLoading());

  yield put(tasksActions.addTasks(tasks));
}

function* createTask({
  payload: { task, previous },
}: Action<{ task: UninitTask; previous?: string }>) {
  const due = handleApiTimestampDiscarding(task);

  yield put(loadingActions.onLoading());
  const res: GResponse<Task> = yield call(
    gapi.client.tasks.tasks.insert,
    {
      tasklist: task.listId,
      parent: task.parent,
      previous,
    },
    { ...task, due: due ? due.toISOString() : undefined }
  );
  yield put(loadingActions.offLoading());

  yield put(tasksActions.addTaskToTop({ ...res.result, listId: task.listId }));
}

function* completeTask({ payload: { id, listId } }: Action<Task>) {
  yield put(loadingActions.onLoading());
  yield call(
    gapi.client.tasks.tasks.update,
    {
      tasklist: listId,
      task: id,
    },
    { id: id, status: "completed" }
  );
  yield put(loadingActions.offLoading());
}

function* updateTask({
  payload: { task, taskId, listId },
}: Action<UpdatePayload>) {
  const due = handleApiTimestampDiscarding(task);

  yield put(loadingActions.onLoading());

  if (task.listId !== listId) {
    yield fork(deleteTask, {
      payload: task,
      type: tasksActions.deleteTask.type,
    });
    yield call(
      gapi.client.tasks.tasks.insert,
      {
        tasklist: task.listId,
        parent: task.parent,
      },
      { ...task, due: due ? due.toISOString() : undefined }
    );
  } else {
    yield call(
      gapi.client.tasks.tasks.update,
      {
        tasklist: listId,
        task: taskId,
      },
      { ...task, due: due ? due.toISOString() : undefined }
    );
  }

  yield put(loadingActions.offLoading());
}

function* deleteTask({ payload: task }: Action<Task>) {
  yield call(gapi.client.tasks.tasks.delete, {
    tasklist: task.listId,
    task: task.id,
  });
}

function* move({
  payload: { task, previous, parent },
}: Action<{ task: Task; previous?: string; parent?: string }>) {
  yield call(gapi.client.tasks.tasks.move, {
    task: task.id,
    tasklist: task.listId,
    previous,
    parent,
  });
}

export const taskSaga = [
  takeEvery(tasksActions.fetchTasks, fetchTasks),
  takeEvery(tasksActions.createTask, createTask),
  takeEvery(tasksActions.completeTask, completeTask),
  takeEvery(tasksActions.updateTask, updateTask),
  takeEvery(tasksActions.deleteTask, deleteTask),
  takeEvery(tasksActions.moveTask, move),
];
