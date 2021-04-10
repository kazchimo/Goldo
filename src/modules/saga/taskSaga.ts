import { call, put, takeEvery } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { GResponse, Task, Tasks } from "../../lib/gapi";
import { tasksActions } from "../slice/taskSlice";

function* fetchTasks(p: Action<string>) {
  const res: GResponse<Tasks> = yield call(gapi.client.tasks.tasks.list, {
    tasklist: p.payload,
    maxResults: 100,
    showCompleted: false,
  });
  yield put(tasksActions.addMany(res.result.items || []));
  yield put(
    tasksActions.addTasksOnListId({
      tasks: res.result.items || [],
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

  yield put(tasksActions.add(res.result));
  yield put(
    tasksActions.addTaskOnListId({ task: res.result, listId: taskListId })
  );
}

export const taskSaga = [
  takeEvery(tasksActions.fetchTasks, fetchTasks),
  takeEvery(tasksActions.createTask, createTask),
];
