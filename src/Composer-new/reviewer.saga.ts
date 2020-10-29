import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import {
  closeOverlayAction,
  openOverlayAction,
  updatePropsAction,
} from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RootState } from '#store';
import {
  apiAssignReviewersToChecklist,
  apiGetReviewersForChecklist,
  apiSendReviewToCr,
  apiStartChecklistReview,
  apiSubmitChecklistForReview,
  apiSubmitChecklistReview,
  apiSubmitChecklistReviewWithCR,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { Checklist, ChecklistStates } from './checklist.types';
import { ComposerAction } from './reducer.types';
import {
  assignReviewersToChecklist,
  assignReviewersToChecklistError,
  assignReviewersToChecklistSuccess,
  // continueChecklistReview,
  // continueChecklistReviewError,
  // continueChecklistReviewSuccess,
  fetchAssignedReviewersForChecklist,
  fetchAssignedReviewersForChecklistError,
  fetchAssignedReviewersForChecklistSuccess,
  sendReviewToCr,
  sendReviewToCrSuccess,
  sendReviewToCrError,
  startChecklistReview,
  startChecklistReviewError,
  startChecklistReviewSuccess,
  submitChecklistForReview,
  submitChecklistForReviewError,
  submitChecklistForReviewSuccess,
  submitChecklistReview,
  submitChecklistReviewError,
  submitChecklistReviewSuccess,
  submitChecklistReviewWithCR,
  submitChecklistReviewWithCRError,
  submitChecklistReviewWithCRSuccess,
  updateChecklistState,
} from './reviewer.actions';
import { Collaborator, CollaboratorState } from './reviewer.types';

const getStatus = (state: RootState) => state.prototypeComposer.data?.status;
const getCurrentCycle = (state: RootState) =>
  (state.prototypeComposer.data as Checklist)?.reviewCycle;
const getUserProfile = (state: RootState) => state.auth.profile;
const getCurrentReviewers = (state: RootState) =>
  (state.prototypeComposer.data as Checklist)?.collaborators || [];
const getCurrentComments = (state: RootState) =>
  (state.prototypeComposer.data as Checklist)?.comments || [];

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
      throw 'Could Not Assign Collaborator To Checklist';
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

// USED
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
    if (status === ChecklistStates.BEING_BUILT) {
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
          assignedUserIds,
          unassignedUserIds,
        },
      },
    );

    if (errors || error) {
      throw 'Could Not Assign Reviewers to Checklist';
    }

    if (status === ChecklistStates.BEING_BUILT) {
      yield put(assignReviewersToChecklistSuccess());
      yield put(
        openOverlayAction({
          type: OverlayNames.CHECKLIST_REVIEWER_ASSIGNMENT_SUCCESS,
        }),
      );
    } else {
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: 'Assignments Modified',
        }),
      );
    }
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
    const userProfile = getUserProfile(yield select());
    const currentReviewers = getCurrentReviewers(yield select());
    const currentCycle = getCurrentCycle(yield select());

    const collaborators: Collaborator[] = [];
    let isFirst = true;

    currentReviewers.forEach((r) => {
      if (r.reviewCycle === currentCycle) {
        if (
          r.state !== CollaboratorState.ILLEGAL &&
          r.state !== CollaboratorState.NOT_STARTED
        ) {
          isFirst = false;
        }
        if (r.id === userProfile?.id) {
          collaborators.push({
            ...r,
            state: CollaboratorState.BEING_REVIEWED,
          });
        } else {
          collaborators.push(r);
        }
      }
    });

    if (isFirst) {
      yield put(updateChecklistState(ChecklistStates.BEING_REVIEWED));
    }

    yield put(startChecklistReviewSuccess(collaborators));
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

function* afterSubmitChecklistReview(data: any, allOk: boolean) {
  try {
    const userProfile = getUserProfile(yield select());
    const currentReviewers = getCurrentReviewers(yield select());
    const currentComments = getCurrentComments(yield select());
    const currentCycle = getCurrentCycle(yield select());

    const collaborators = currentReviewers.map((r) =>
      r.reviewCycle === currentCycle && r.id === userProfile?.id
        ? {
            ...r,
            state: allOk
              ? CollaboratorState.COMMENTED_OK
              : CollaboratorState.COMMENTED_CHANGES,
          }
        : r,
    );

    data.commentedBy = {
      id: userProfile?.id,
      firstName: userProfile?.firstName,
      lastName: userProfile?.lastName,
      employeeId: userProfile?.employeeId,
    };

    const newComments = currentComments.filter(
      (c) => c.commentedBy.id !== userProfile?.id,
    );
    newComments.push(data);

    allOk
      ? yield put(submitChecklistReviewSuccess(collaborators, newComments))
      : yield put(
          submitChecklistReviewWithCRSuccess(collaborators, newComments),
        );

    let allDone = true;
    let allDoneOk = true;
    let isFirst = true;
    collaborators.forEach((r) => {
      if (r.reviewCycle === currentCycle) {
        if (
          r.state !== CollaboratorState.ILLEGAL &&
          r.state !== CollaboratorState.NOT_STARTED
        ) {
          isFirst = false;
        }
        if (
          r.state === CollaboratorState.ILLEGAL ||
          r.state === CollaboratorState.NOT_STARTED ||
          r.state === CollaboratorState.BEING_REVIEWED
        ) {
          allDone = false;
        }
        if (r.state !== CollaboratorState.COMMENTED_OK) {
          allDoneOk = false;
        }
      }
    });

    if (isFirst) {
      yield put(updateChecklistState(ChecklistStates.BEING_REVIEWED));
    }

    if (allDone && allDoneOk) {
      yield put(updateChecklistState(ChecklistStates.READY_FOR_SIGNING));
      yield put(closeOverlayAction(OverlayNames.SUBMIT_REVIEW_MODAL));
    } else if (allDone && !allDoneOk) {
      yield put(
        updatePropsAction(OverlayNames.SUBMIT_REVIEW_MODAL, {
          sendToAuthor: true,
          isViewer: false,
        }),
      );
    } else if (!allDone && !allDoneOk) {
      yield put(closeOverlayAction(OverlayNames.SUBMIT_REVIEW_MODAL));
      yield put(
        openOverlayAction({
          type: OverlayNames.CHECKLIST_REVIEWER_SUBMIT_SUCCESS,
        }),
      );
    }
  } catch (error) {
    throw 'Could Not Submit afterSubmitChecklistReview For Review';
  }
}

function* submitChecklistReviewSaga({
  payload,
}: ReturnType<typeof submitChecklistReview>) {
  const { checklistId } = payload;

  try {
    const { data, errors, error } = yield call(
      request,
      'PUT',
      apiSubmitChecklistReview(checklistId),
    );

    if (errors || error) {
      throw 'Could Not Submit Review';
    }

    yield* afterSubmitChecklistReview(data, true);
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

    yield* afterSubmitChecklistReview(data, false);
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

function* sendReviewToCrSaga({ payload }: ReturnType<typeof sendReviewToCr>) {
  const { checklistId } = payload;

  try {
    const { errors, error } = yield call(
      request,
      'PUT',
      apiSendReviewToCr(checklistId),
    );

    if (errors || error) {
      throw 'Could Not Send Review To CR';
    }

    const userProfile = getUserProfile(yield select());
    const currentReviewers = getCurrentReviewers(yield select());
    const currentCycle = getCurrentCycle(yield select());
    const collaborators: Collaborator[] = [];
    let isLast = true;

    currentReviewers.forEach((r) => {
      if (r.reviewCycle === currentCycle) {
        if (
          r.id !== userProfile?.id &&
          (r.state === CollaboratorState.ILLEGAL ||
            r.state === CollaboratorState.NOT_STARTED ||
            r.state === CollaboratorState.BEING_REVIEWED ||
            r.state === CollaboratorState.COMMENTED_CHANGES ||
            r.state === CollaboratorState.COMMENTED_OK)
        ) {
          isLast = false;
        }
        if (r.id === userProfile?.id) {
          collaborators.push({
            ...r,
            state: CollaboratorState.REQUESTED_CHANGES,
          });
        } else {
          collaborators.push(r);
        }
      }
    });

    if (isLast) {
      yield put(updateChecklistState(ChecklistStates.REQUESTED_CHANGES));
    }

    yield put(sendReviewToCrSuccess(collaborators));
    yield put(closeOverlayAction(OverlayNames.SUBMIT_REVIEW_MODAL));
    yield put(
      openOverlayAction({
        type: OverlayNames.CHECKLIST_SENT_TO_AUTHOR_SUCCESS,
      }),
    );
  } catch (error) {
    console.error(
      'error from sendReviewToCrSaga function in Composer-New :: ',
      error,
    );
    yield put(sendReviewToCrError(error));
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: 'Could Not Send Review To CR',
      }),
    );
  }
}

export function* ReviewerSaga() {
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
  // yield takeLatest(
  //   ComposerAction.CONTINUE_CHECKLIST_REVIEW,
  //   continueChecklistReviewSaga,
  // );
  yield takeLatest(ComposerAction.SEND_REVIEW_TO_CR, sendReviewToCrSaga);
}
