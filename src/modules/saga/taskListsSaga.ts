import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { GResponse, hasId, TaskList, TaskLists } from "../../lib/gapi";
import { taskListActions } from "../slice/taskListSlice";

function* fetchTaskLists() {
  const res: GResponse<TaskLists> = yield call(
    gapi.client.tasks.tasklists.list,
    { maxResults: 100 }
  );
  yield put(
    taskListActions.successFetchTaskLists(res.result.items?.filter(hasId) || [])
  );
}

function* deleteTaskList(a: Action<string>) {
  yield call(gapi.client.tasks.tasklists.delete, { tasklist: a.payload });
}

function* updateTaskList(a: Action<TaskList>) {
  yield call(
    gapi.client.tasks.tasklists.update,
    {
      tasklist: a.payload.id,
    },
    a.payload
  );
}

export const taskListsSaga = [
  takeLatest(taskListActions.fetchTaskLists, fetchTaskLists),
  takeEvery(taskListActions.deleteTaskList, deleteTaskList),
  takeEvery(taskListActions.updateList, updateTaskList),
];
