import { call, put, takeEvery } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { GResponse, Tasks } from "../../lib/gapi";
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

export const taskSaga = [takeEvery(tasksActions.fetchTasks, fetchTasks)];
