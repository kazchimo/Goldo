import { call, put, takeEvery } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { getTasks, GResponse, Tasks } from "../../lib/gapi";
import { tasksActions } from "../slice/taskSlice";

function* fetchTasks(p: Action<string>) {
  const res: GResponse<Tasks> = yield call(getTasks, p.payload);
  yield put(tasksActions.addMany(res.result.items));
}

export const taskSaga = [takeEvery(tasksActions.fetchTasks, fetchTasks)];
