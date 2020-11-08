import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import {
  closeAllOverlayAction,
  closeOverlayAction,
  openOverlayAction,
  updatePropsAction,
} from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RootState } from '#store';
import {
  apiAssignReviewersToChecklist,
  apiGetApproversForChecklist,
  apiGetReviewersForChecklist,
  apiInitiateSignOff,
  apiPrototypeRelease,
  apiPrototypeSignOff,
  apiSendReviewToCr,
  apiSignOffOrder,
  apiStartChecklistReview,
  apiSubmitChecklistForReview,
  apiSubmitChecklistReview,
  apiSubmitChecklistReviewWithCR,
  apiValidatePassword,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { uniqBy } from 'lodash';
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
  initiateSignOff,
  fetchApprovers,
  fetchApproversError,
  fetchApproversSuccess,
  signOffPrototype,
  signOffPrototypeSuccess,
  initiateSignOffSuccess,
  releasePrototype,
} from './reviewer.actions';
import {
  Collaborator,
  CollaboratorState,
  CollaboratorType,
} from './reviewer.types';

const getState = (state: RootState) => state.prototypeComposer.data?.state;
const getCurrentCycle = (state: RootState) =>
  (state.prototypeComposer.data as Checklist)?.reviewCycle;
const getUserProfile = (state: RootState) => state.auth.profile;
const getCurrentReviewers = (state: RootState) =>
  (state.prototypeComposer.data as Checklist)?.collaborators || [];
const getCurrentAuthors = (state: RootState) =>
  (state.prototypeComposer.data as Checklist)?.authors || [];
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
      throw 'Could Not Fetch Reviewers for Checklist';
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

function* fetchApproversSaga({ payload }: ReturnType<typeof fetchApprovers>) {
  try {
    const { checklistId } = payload;

    const { data, errors, error } = yield call(
      request,
      'GET',
      apiGetApproversForChecklist(checklistId),
    );

    if (errors || error) {
      throw 'Could Not Fetch Approvers for Checklist';
    }

    yield put(fetchApproversSuccess(data));
  } catch (error) {
    console.error(
      'error from fetchApproversSaga in Prototype ComposerSaga :: ',
      error,
    );
    yield put(fetchApproversError(error));
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
    const state = getState(yield select());
    if (state === ChecklistStates.BEING_BUILT) {
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

    if (state === ChecklistStates.BEING_BUILT) {
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
    const newComments = [];
    currentComments.forEach((c) => {
      if (c.reviewCycle !== currentCycle) {
        newComments.push(c);
      } else if (c.commentedBy.id !== userProfile?.id) {
        newComments.push(c);
      }
    });
    newComments.push(data);

    allOk
      ? yield put(submitChecklistReviewSuccess(collaborators, newComments))
      : yield put(
          submitChecklistReviewWithCRSuccess(collaborators, newComments),
        );

    let allDone = true;
    let allDoneOk = true;
    collaborators.forEach((r) => {
      if (r.reviewCycle === currentCycle) {
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

    if (allDone && allDoneOk) {
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
    let allDoneOk = true;
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
          if (r.state === CollaboratorState.COMMENTED_CHANGES) {
            allDoneOk = false;
          }
          if (r.state === CollaboratorState.COMMENTED_CHANGES) {
            collaborators.push({
              ...r,
              state: CollaboratorState.REQUESTED_CHANGES,
            });
          } else {
            collaborators.push({
              ...r,
              state: CollaboratorState.REQUESTED_NO_CHANGES,
            });
          }
        } else {
          if (r.state !== CollaboratorState.REQUESTED_NO_CHANGES) {
            allDoneOk = false;
          }
          collaborators.push(r);
        }
      }
    });

    yield put(sendReviewToCrSuccess(collaborators));

    if (allDoneOk && isLast) {
      yield put(updateChecklistState(ChecklistStates.READY_FOR_SIGNING));
    } else if (isLast && !allDoneOk) {
      yield put(updateChecklistState(ChecklistStates.REQUESTED_CHANGES));
    }

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

function* initiateSignOffSaga({ payload }: ReturnType<typeof initiateSignOff>) {
  const { checklistId, users } = payload;

  try {
    const res = yield call(request, 'PUT', apiInitiateSignOff(checklistId));

    if (res.errors || res.error) {
      throw 'Could Not Initiate Sign Off';
    }

    const { errors, error } = yield call(
      request,
      'POST',
      apiSignOffOrder(checklistId),
      { data: { users } },
    );

    if (errors || error) {
      throw 'Could Not Initiate Sign Off';
    }

    const filterdUsers: Collaborator[] = [];
    const currentReviewers = getCurrentReviewers(yield select());
    const filterdReviewers: Collaborator[] = uniqBy(currentReviewers, 'id');
    users.forEach((u) => {
      const filteredUser = filterdReviewers.filter((r) => u.userId === r.id)[0];
      if (filteredUser)
        filterdUsers.push({
          ...filteredUser,
          state: CollaboratorState.NOT_STARTED,
          type: CollaboratorType.SIGN_OFF_USER,
          orderTree: u.orderTree,
          comments: null,
        });
    });

    const currentAuthors = getCurrentAuthors(yield select());
    const currentCycle = getCurrentCycle(yield select());
    const collaborators: Collaborator[] = [...filterdUsers];
    currentAuthors.forEach((r) => {
      collaborators.push({
        ...r,
        comments: null,
        reviewCycle: currentCycle,
        state: CollaboratorState.NOT_STARTED,
        type: CollaboratorType.SIGN_OFF_USER,
      });
    });

    yield put(initiateSignOffSuccess(collaborators));
    yield put(updateChecklistState(ChecklistStates.SIGN_OFF_INITIATED));
    yield put(
      openOverlayAction({
        type: OverlayNames.SIGN_OFF_INITIATED_SUCCESS,
      }),
    );
  } catch (error) {
    console.error(
      'error from initiateSignOffSaga function in Composer-New :: ',
      error,
    );
  }
}

function* signOffPrototypeSaga({
  payload,
}: ReturnType<typeof signOffPrototype>) {
  try {
    const { checklistId, password } = payload;

    const { data: validateData } = yield call(
      request,
      'POST',
      apiValidatePassword(),
      { data: { password } },
    );

    if (validateData) {
      const { errors, error } = yield call(
        request,
        'PUT',
        apiPrototypeSignOff(checklistId),
      );

      if (errors || error) {
        throw 'User cannot signoff the checklist as previous users did not signed off the checklist.';
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
            r.type === CollaboratorType.SIGN_OFF_USER &&
            r.state === CollaboratorState.NOT_STARTED
          ) {
            isLast = false;
          }
          if (r.id === userProfile?.id) {
            collaborators.push({
              ...r,
              state: CollaboratorState.SIGNED,
            });
          } else {
            collaborators.push(r);
          }
        }
      });

      if (isLast) {
        yield put(updateChecklistState(ChecklistStates.READY_FOR_RELEASE));
      }

      yield put(closeAllOverlayAction());
      yield put(signOffPrototypeSuccess(collaborators));

      yield put(
        openOverlayAction({
          type: OverlayNames.SIGN_OFF_SUCCESS,
        }),
      );
    } else {
      throw 'Could Not Sign Off the Prototype';
    }
  } catch (error) {
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: error,
      }),
    );
    console.error('error from signOffPrototypeSaga :', error);
  }
}

function* releasePrototypeSaga({
  payload,
}: ReturnType<typeof releasePrototype>) {
  try {
    const { checklistId, password } = payload;

    const { data: validateData } = yield call(
      request,
      'POST',
      apiValidatePassword(),
      { data: { password } },
    );

    if (validateData) {
      const { errors, error } = yield call(
        request,
        'PUT',
        apiPrototypeRelease(checklistId),
      );

      if (errors || error) {
        throw 'Unable to Relase the Prototype';
      }

      yield put(updateChecklistState(ChecklistStates.PUBLISHED));

      yield put(closeAllOverlayAction());

      yield put(
        openOverlayAction({
          type: OverlayNames.RELEASE_SUCCESS,
        }),
      );
    } else {
      throw 'Unable to Relase the Prototype';
    }
  } catch (error) {
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: error,
      }),
    );
    console.error('error from releasePrototypeSaga :', error);
  }
}

export function* ReviewerSaga() {
  yield takeLatest(
    ComposerAction.FETCH_REVIEWERS_FOR_CHECKLIST,
    fetchReviewersForChecklistSaga,
  );
  yield takeLatest(ComposerAction.FETCH_APPROVERS, fetchApproversSaga);
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
  yield takeLatest(ComposerAction.INITIATE_SIGNOFF, initiateSignOffSaga);
  yield takeLatest(ComposerAction.SEND_REVIEW_TO_CR, sendReviewToCrSaga);
  yield takeLatest(ComposerAction.SIGN_OFF_PROTOTYPE, signOffPrototypeSaga);
  yield takeLatest(ComposerAction.RELEASE_PROTOTYPE, releasePrototypeSaga);
}
