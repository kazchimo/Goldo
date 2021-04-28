import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { GResponse, isTaskList, TaskList, TaskLists } from "../../lib/gapi";
import { taskListActions } from "../slice/taskListSlice";

function* fetchTaskLists() {
  const res: GResponse<TaskLists> = yield call(
    gapi.client.tasks.tasklists.list,
    { maxResults: 100 }
  );
  yield put(
    taskListActions.successFetchTaskLists(
      res.result.items?.filter(isTaskList) || []
    )
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

function* createTaskList(a: Action<string>) {
  const res: GResponse<gapi.client.tasks.TaskList> = yield call(
    gapi.client.tasks.tasklists.insert,
    {},
    { title: a.payload }
  );

  if (isTaskList(res.result)) {
    yield put(taskListActions.successCreateTaskList(res.result));
  }
}

export const taskListsSaga = [
  takeLatest(taskListActions.fetchTaskLists, fetchTaskLists),
  takeEvery(taskListActions.deleteTaskList, deleteTaskList),
  takeEvery(taskListActions.updateList, updateTaskList),
  takeEvery(taskListActions.createTaskList, createTaskList),
];
