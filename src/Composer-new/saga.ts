import {
  apiGetChecklist,
  apiGetSelectedJob as apiGetJob,
  apiGetReviewersForChecklist,
  apiAssignReviewersToChecklist,
  apiStartChecklistReview,
  apiSubmitChecklistForReview,
  apiSubmitChecklistReview,
  apiContinueChecklistReview,
  apiSubmitChecklistReviewWithCR,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, fork, put, select, takeLatest, takeLeading } from 'redux-saga/effects';

import {
  fetchComposerData,
  fetchComposerDataOngoing,
  fetchComposerDataSuccess,
} from './actions';
import {
  fetchAssignedReviewersForChecklistError,
  fetchAssignedReviewersForChecklistSuccess,
  fetchAssignedReviewersForChecklist,
  assignReviewersToChecklist,
  assignReviewersToChecklistSuccess,
  assignReviewersToChecklistError,
  startChecklistReview,
  startChecklistReviewSuccess,
  startChecklistReviewError,
  submitChecklistForReview,
  submitChecklistForReviewError,
  submitChecklistForReviewSuccess,
  submitChecklistReview,
  submitChecklistReviewSuccess,
  submitChecklistReviewError,
  continueChecklistReview,
  continueChecklistReviewError,
  continueChecklistReviewSuccess,
  submitChecklistReviewWithCRSuccess,
  submitChecklistReviewWithCR,
  submitChecklistReviewWithCRError,
} from './reviewer.actions';
import { ActivitySaga } from './Activity/saga';
import { ComposerAction } from './reducer.types';
import { StageListSaga } from './Stages/saga';
import { TaskListSaga } from './Tasks/saga';
import { ComposerEntity } from './types';
import {
  closeOverlayAction,
  openOverlayAction,
} from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { Checklist, ChecklistStates } from './checklist.types';
import { RootState } from '#store';
import { ReviewerState } from './reviewer.types';

const getStatus = (state: RootState) => state.prototypeComposer.data?.status;
const getUserId = (state: RootState) => state.auth.userId;
const getCurrentReviewers = (state: RootState) =>
  (state.prototypeComposer.data as Checklist)?.reviewers || [];
const getCurrentComments = (state: RootState) =>
  (state.prototypeComposer.data as Checklist)?.comments || [];

function* fetchComposerDataSaga({
  payload,
}: ReturnType<typeof fetchComposerData>) {
  try {
    const { id, entity } = payload;

    yield put(fetchComposerDataOngoing({ entity }));

    if (entity === ComposerEntity.CHECKLIST) {
      const { data, errors } = yield call(request, 'GET', apiGetChecklist(id));

      if (data) {
        yield put(fetchComposerDataSuccess({ data, entity }));
      } else {
        console.info('Handle getChecklist API error');
        console.error(errors);
      }
    } else {
      const { data, errors } = yield call(request, 'GET', apiGetJob(id));

      if (data) {
        yield put(fetchComposerDataSuccess({ data, entity }));
      } else {
        console.info('Handle getSelectedJob API error');
        console.error(errors);
      }
    }
  } catch (error: unknown) {
    console.info('ERROR in fetchComposerDataSaga');
    console.error(error);
  }
}

function* fetchReviewersForChecklistSaga({
  payload,
}: ReturnType<typeof fetchAssignedReviewersForChecklist>) {
  try {
    const { checklistId } = payload;

    const { data, errors, error } = yield call(
      request,
      'GET',
      apiGetReviewersForChecklist(checklistId),
    );

    if (errors || error) {
      throw 'Could Not Assign Reviewer To Checklist';
    }

    yield put(fetchAssignedReviewersForChecklistSuccess(data));
  } catch (error) {
    console.error(
      'error from fetchReviewersForChecklistSaga in Prototype ComposerSaga :: ',
      error,
    );
    yield put(fetchAssignedReviewersForChecklistError(error));
  }
}

function* submitChecklistForReviewCall(checklistId: Checklist['id']) {
  try {
    const res = yield call(
      request,
      'PUT',
      apiSubmitChecklistForReview(checklistId),
    );
    return res;
  } catch (error) {
    throw 'Could Not Submit Checklist For Review';
  }
}

function* submitChecklistForReviewSaga({
  payload,
}: ReturnType<typeof submitChecklistForReview>) {
  const { checklistId } = payload;

  try {
    const { errors, error } = yield* submitChecklistForReviewCall(checklistId);
    if (errors || error) {
      throw 'Could Not Submit Checklist For Review';
    }

    yield put(submitChecklistForReviewSuccess());
  } catch (error) {
    console.error(
      'error from submitChecklistForReviewSaga function in Composer-New :: ',
      error,
    );
    yield put(submitChecklistForReviewError(error));
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: 'Could Not Submit Checklist For Review',
      }),
    );
  }
}

function* assignReviewersToChecklistSaga({
  payload,
}: ReturnType<typeof assignReviewersToChecklist>) {
  const {
    checklistId,
    assignIds: assignedUserIds,
    unassignIds: unassignedUserIds,
  } = payload;

  try {
    const status = getStatus(yield select());
    if (status === ChecklistStates.DRAFT) {
      const res = yield* submitChecklistForReviewCall(checklistId);
      if (res.errors && res.errors.length > 0) {
        let error = '';
        res.errors.forEach((err: any) => (error = error + err.message + '\n'));
        throw error;
      }
    }
    const { errors, error } = yield call(
      request,
      'PUT',
      apiAssignReviewersToChecklist(checklistId),
      {
        data: {
          checklistId,
          assignedUserIds,
          unassignedUserIds,
        },
      },
    );

    if (errors || error) {
      throw 'Could Not Assign Reviewers to Checklist';
    }

    yield put(assignReviewersToChecklistSuccess());
    yield put(
      openOverlayAction({
        type: OverlayNames.CHECKLIST_REVIEWER_ASSIGNMENT_SUCCESS,
      }),
    );
  } catch (error) {
    console.error(
      'error from assignReviewersToChecklistSaga function in Composer-New :: ',
      error,
    );
    yield put(assignReviewersToChecklistError(error));
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: error,
      }),
    );
  }
}

function* startChecklistReviewSaga({
  payload,
}: ReturnType<typeof startChecklistReview>) {
  const { checklistId } = payload;

  try {
    const { errors, error } = yield call(
      request,
      'PUT',
      apiStartChecklistReview(checklistId),
    );

    if (errors || error) {
      throw 'Could Not Start Review';
    }
    const userId = getUserId(yield select());
    const currentReviewers = getCurrentReviewers(yield select());

    const reviewers = currentReviewers.map((r) =>
      r.id === userId ? { ...r, state: ReviewerState.IN_PROGRESS } : r,
    );

    yield put(startChecklistReviewSuccess(reviewers));
  } catch (error) {
    console.error(
      'error from startChecklistReviewSaga function in Composer-New :: ',
      error,
    );
    yield put(startChecklistReviewError(error));
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: 'Could Not Start Review',
      }),
    );
  }
}

// TODO REMOVE MOCK DATA FOR COMMENTS

function* submitChecklistReviewSaga({
  payload,
}: ReturnType<typeof submitChecklistReview>) {
  const { checklistId } = payload;

  try {
    const { errors, error } = yield call(
      request,
      'PUT',
      apiSubmitChecklistReview(checklistId),
    );

    if (errors || error) {
      throw 'Could Not Submit Review';
    }
    const userId = getUserId(yield select());
    const currentReviewers = getCurrentReviewers(yield select());
    const newComments = getCurrentComments(yield select());

    const reviewers = currentReviewers.map((r) =>
      r.id === userId ? { ...r, state: ReviewerState.DONE } : r,
    );

    newComments.push({
      id: 14993987800879104,
      comments: 'All OK',
      commentedAt: 1602493245,
      commentedBy: {
        id: 46,
        employeeId: 'MOCK123',
        firstName: 'Snehal',
        lastName: 'Seth',
      },
      reviewCycle: 1,
    });

    yield put(submitChecklistReviewSuccess(reviewers, newComments));
    yield put(closeOverlayAction(OverlayNames.SUBMIT_REVIEW_MODAL));
  } catch (error) {
    console.error(
      'error from submitChecklistReviewSaga function in Composer-New :: ',
      error,
    );
    yield put(submitChecklistReviewError(error));
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: 'Could Not Submit Review',
      }),
    );
  }
}

function* submitChecklistReviewWithCRSaga({
  payload,
}: ReturnType<typeof submitChecklistReviewWithCR>) {
  const { checklistId, comments } = payload;

  try {
    const { data, error, errors } = yield call(
      request,
      'PUT',
      apiSubmitChecklistReviewWithCR(checklistId),
      {
        data: {
          comments,
        },
      },
    );

    if (errors || error) {
      throw 'Could Not Submit Review With CR';
    }

    const userId = getUserId(yield select());
    const currentReviewers = getCurrentReviewers(yield select());
    const newComments = getCurrentComments(yield select());

    const reviewers = currentReviewers.map((r) =>
      r.id === userId ? { ...r, state: ReviewerState.DONE_WITH_CR } : r,
    );

    newComments.push({
      id: 14993987800879104,
      comments: '<p>Some Changes Required</p>\n',
      commentedAt: 1602493245,
      commentedBy: {
        id: 46,
        employeeId: 'ESL107',
        firstName: 'Sathyam',
        lastName: 'Lokare',
      },
      reviewCycle: 1,
    });

    yield put(submitChecklistReviewWithCRSuccess(reviewers, newComments));
    yield put(closeOverlayAction(OverlayNames.SUBMIT_REVIEW_MODAL));
    yield put(
      openOverlayAction({
        type: OverlayNames.CHECKLIST_REVIEWER_SUBMIT_SUCCESS,
      }),
    );
  } catch (error) {
    console.error(
      'error from submitChecklistReviewWithCRSaga function in Composer-New :: ',
      error,
    );
    yield put(submitChecklistReviewWithCRError(error));
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: 'Could Not Submit Review With CR',
      }),
    );
  }
}

function* continueChecklistReviewSaga({
  payload,
}: ReturnType<typeof continueChecklistReview>) {
  const { checklistId } = payload;

  try {
    const { errors, error } = yield call(
      request,
      'PUT',
      apiContinueChecklistReview(checklistId),
    );

    if (errors || error) {
      throw 'Could Not Continue Review';
    }
    const userId = getUserId(yield select());
    const currentReviewers = getCurrentReviewers(yield select());

    const reviewers = currentReviewers.map((r) =>
      r.id === userId ? { ...r, state: ReviewerState.IN_PROGRESS } : r,
    );

    yield put(continueChecklistReviewSuccess(reviewers));
  } catch (error) {
    console.error(
      'error from continueChecklistReviewSaga function in Composer-New :: ',
      error,
    );
    yield put(continueChecklistReviewError(error));
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: 'Could Not Continue Review',
      }),
    );
  }
}

export function* ComposerSaga() {
  yield takeLeading(ComposerAction.FETCH_COMPOSER_DATA, fetchComposerDataSaga);

  yield takeLatest(
    ComposerAction.FETCH_REVIEWERS_FOR_CHECKLIST,
    fetchReviewersForChecklistSaga,
  );
  yield takeLatest(
    ComposerAction.ASSIGN_REVIEWERS_TO_CHECKLIST,
    assignReviewersToChecklistSaga,
  );
  yield takeLatest(
    ComposerAction.START_CHECKLIST_REVIEW,
    startChecklistReviewSaga,
  );
  yield takeLatest(
    ComposerAction.SUBMIT_CHECKLIST_FOR_REVIEW,
    submitChecklistForReviewSaga,
  );
  yield takeLatest(
    ComposerAction.SUBMIT_CHECKLIST_REVIEW,
    submitChecklistReviewSaga,
  );
  yield takeLatest(
    ComposerAction.SUBMIT_CHECKLIST_REVIEW_WITH_CR,
    submitChecklistReviewWithCRSaga,
  );
  yield takeLatest(
    ComposerAction.CONTINUE_CHECKLIST_REVIEW,
    continueChecklistReviewSaga,
  );

  yield all([fork(StageListSaga), fork(TaskListSaga), fork(ActivitySaga)]);
}
