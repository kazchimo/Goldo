import { call, put, takeLatest } from "redux-saga/effects";
import { getTaskLists, GResponse, TaskLists } from "../../lib/gapi";
import { taskListActions } from "../slice/taskListSlice";

function* fetchTaskLists() {
  const res: GResponse<TaskLists> = yield call(getTaskLists);
  yield put(taskListActions.successFetchTaskLists(res.result.items));
}

export const taskListsSaga = [
  takeLatest(taskListActions.fetchTaskLists, fetchTaskLists),
];
