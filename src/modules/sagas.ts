import { all } from "redux-saga/effects";
import { authSaga } from "./saga/authSaga";
import { gapiSaga } from "./saga/gapiSaga";
import { taskListsSaga } from "./saga/taskListsSaga";
import { taskSaga } from "./saga/taskSaga";
import { themeSaga } from "./saga/themeSaga";

function* allSagas() {
  yield all([
    ...taskListsSaga,
    ...gapiSaga,
    ...authSaga,
    ...taskSaga,
    ...themeSaga,
  ]);
}

export { allSagas };
