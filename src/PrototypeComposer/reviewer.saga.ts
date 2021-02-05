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
import { LoginErrorCodes } from '#utils/constants';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { cleanUp } from '#views/Auth/actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { Checklist, ChecklistStates, Comment } from './checklist.types';
import { ComposerAction } from './reducer.types';
import {
  assignReviewersToChecklist,
  fetchAssignedReviewersForChecklist,
  fetchAssignedReviewersForChecklistSuccess,
  sendReviewToCr,
  startChecklistReview,
  updateChecklistForReview,
  submitChecklistForReview,
  submitChecklistReview,
  submitChecklistReviewWithCR,
  initiateSignOff,
  fetchApprovers,
  fetchApproversSuccess,
  signOffPrototype,
  releasePrototype,
} from './reviewer.actions';
import {
  Collaborator,
  CollaboratorState,
  CollaboratorType,
  CommonReviewPayload,
  CommonReviewResponse,
} from './reviewer.types';

const getState = (state: RootState) => state.prototypeComposer.data?.state;
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
      throw 'Could Not Fetch Reviewers for Checklist';
    }

    yield put(fetchAssignedReviewersForChecklistSuccess(data));
  } catch (error) {
    console.error(
      'error from fetchReviewersForChecklistSaga in Prototype ComposerSaga :: ',
      error,
    );
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

    yield put(
      fetchApproversSuccess(
        data.filter(
          (collaborator: Collaborator) =>
            collaborator.type === CollaboratorType.SIGN_OFF_USER,
        ),
      ),
    );
  } catch (error) {
    console.error(
      'error from fetchApproversSaga in Prototype ComposerSaga :: ',
      error,
    );
  }
}

function* submitChecklistForReviewCall(checklistId: Checklist['id']) {
  try {
    const res: ResponseObj<CommonReviewResponse> = yield call(
      request,
      'PUT',
      apiSubmitChecklistForReview(checklistId),
    );

    yield* onSuccess({ checklist: res.data });

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
  } catch (error) {
    console.error(
      'error from submitChecklistForReviewSaga function in Composer-New :: ',
      error,
    );
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
    const { errors, data }: ResponseObj<CommonReviewResponse> = yield call(
      request,
      'PUT',
      apiStartChecklistReview(checklistId),
    );

    if (errors) {
      throw 'Could Not Start Review';
    }

    yield* onSuccess(data);
  } catch (error) {
    console.error(
      'error from startChecklistReviewSaga function in Composer-New :: ',
      error,
    );
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: 'Could Not Start Review',
      }),
    );
  }
}

function* onSuccess(data: CommonReviewResponse) {
  try {
    const payloadToSend: CommonReviewPayload = {
      collaborators: [],
      checklist: {},
      comments: [],
    };

    let isLast = true;
    let allDoneOk = true;

    if (data?.collaborators?.length) {
      const currentReviewers = getCurrentReviewers(yield select());

      const addedIndexes: number[] = [];
      const collaborators: Collaborator[] = [];

      data.collaborators.forEach((collab) => {
        let isUpdated = false;
        const { id, phase, phaseType } = collab;
        collaborators.push(
          ...currentReviewers.reduce((accumulator, reviewer, index) => {
            if (reviewer.phase === phase && reviewer.phaseType === phaseType) {
              if (reviewer.id === id) {
                if (!isUpdated && reviewer.state !== CollaboratorState.SIGNED) {
                  accumulator.push(collab || reviewer);
                  isUpdated = true;
                } else if (!addedIndexes.includes(index)) {
                  accumulator.push(reviewer);
                  addedIndexes.push(index);
                }

                if (collab.state !== CollaboratorState.COMMENTED_OK) {
                  allDoneOk = false;
                }
              } else {
                if (!addedIndexes.includes(index)) {
                  accumulator.push(reviewer);
                  addedIndexes.push(index);
                }

                if (reviewer.state !== CollaboratorState.COMMENTED_OK) {
                  allDoneOk = false;
                  if (reviewer.state !== CollaboratorState.COMMENTED_CHANGES) {
                    isLast = false;
                  }
                }
              }
            } else {
              if (!addedIndexes.includes(index)) {
                accumulator.push(reviewer);
                addedIndexes.push(index);
              }
            }
            return accumulator;
          }, [] as Collaborator[]),
        );

        if (!isUpdated) collaborators.push(collab);
      });

      payloadToSend.collaborators = collaborators;
    }

    if (data.comment) {
      const currentComments = getCurrentComments(yield select());

      let isUpdated = false;
      const { id } = data.comment;

      const comments = currentComments.reduce((acc, c) => {
        if (c.id === id) {
          acc.push(data.comment as Comment);
          isUpdated = true;
        } else {
          acc.push(c);
        }
        return acc;
      }, [] as Comment[]);

      if (!isUpdated) comments.push(data.comment);

      payloadToSend.comments = comments;
    }

    if (data.checklist) {
      payloadToSend.checklist = data.checklist;
    }

    yield put(updateChecklistForReview(payloadToSend));

    return { payloadToSend, allDoneOk, isLast };
  } catch (error) {
    throw "Could Not Run onSuccess For Review API's";
  }
}

function* afterSubmitChecklistReview(isLast: boolean, allDoneOk: boolean) {
  try {
    if (isLast) {
      yield put(
        updatePropsAction(OverlayNames.SUBMIT_REVIEW_MODAL, {
          sendToAuthor: true,
          isViewer: false,
          allDoneOk,
        }),
      );
    } else {
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
    const { data, errors }: ResponseObj<CommonReviewResponse> = yield call(
      request,
      'PUT',
      apiSubmitChecklistReview(checklistId),
    );

    if (errors) {
      throw 'Could Not Submit Review';
    }

    const { isLast, allDoneOk } = yield* onSuccess(data);
    yield* afterSubmitChecklistReview(isLast, allDoneOk);
  } catch (error) {
    console.error(
      'error from submitChecklistReviewSaga function in Composer-New :: ',
      error,
    );
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
    const { data, errors }: ResponseObj<CommonReviewResponse> = yield call(
      request,
      'PUT',
      apiSubmitChecklistReviewWithCR(checklistId),
      {
        data: {
          comments,
        },
      },
    );

    if (errors) {
      throw 'Could Not Submit Review With CR';
    }

    const { isLast, allDoneOk } = yield* onSuccess(data);
    yield* afterSubmitChecklistReview(isLast, allDoneOk);
  } catch (error) {
    console.error(
      'error from submitChecklistReviewWithCRSaga function in Composer-New :: ',
      error,
    );
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
    const { data, errors }: ResponseObj<CommonReviewResponse> = yield call(
      request,
      'PUT',
      apiSendReviewToCr(checklistId),
    );

    if (errors) {
      throw 'Could Not Send Review To CR';
    }

    yield* onSuccess(data);
    yield put(closeOverlayAction(OverlayNames.SUBMIT_REVIEW_MODAL));
    yield put(
      openOverlayAction({
        type: OverlayNames.CHECKLIST_SENT_TO_AUTHOR_SUCCESS,
        props: {
          heading:
            data?.collaborators?.[0].state ===
            CollaboratorState.REQUESTED_CHANGES
              ? 'Comments Sent to Author'
              : 'Great Job !',
        },
      }),
    );
  } catch (error) {
    console.error(
      'error from sendReviewToCrSaga function in Composer-New :: ',
      error,
    );
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

    const {
      errors,
      data,
    }: ResponseObj<CommonReviewResponse> = yield call(
      request,
      'POST',
      apiSignOffOrder(checklistId),
      { data: { users } },
    );

    if (errors) {
      throw 'Could Not Initiate Sign Off';
    }

    yield* onSuccess(data);
    yield put(closeAllOverlayAction());
    yield put(
      openOverlayAction({
        type: OverlayNames.SIGN_OFF_INITIATED_SUCCESS,
      }),
    );
  } catch (error) {
    yield put(closeAllOverlayAction());
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

    const { data: validateData, errors: validateErrors } = yield call(
      request,
      'POST',
      apiValidatePassword(),
      { data: { password } },
    );

    if (validateData) {
      const { errors, data }: ResponseObj<CommonReviewResponse> = yield call(
        request,
        'PUT',
        apiPrototypeSignOff(checklistId),
      );

      if (errors) {
        throw 'User cannot signoff the checklist as previous users did not signed off the checklist.';
      }

      yield* onSuccess(data);
      yield put(closeAllOverlayAction());
      yield put(
        openOverlayAction({
          type: OverlayNames.SIGN_OFF_SUCCESS,
        }),
      );
    } else {
      if (validateErrors[0].code === LoginErrorCodes.INCORRECT) {
        throw 'Incorrect Password';
      } else if (validateErrors[0].code === LoginErrorCodes.BLOCKED) {
        yield put(closeAllOverlayAction());
        yield put(cleanUp());
        throw 'User has been blocked.';
      }
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

    const { data: validateData, errors: validateErrors } = yield call(
      request,
      'POST',
      apiValidatePassword(),
      { data: { password } },
    );

    if (validateData) {
      const { errors, data }: ResponseObj<CommonReviewResponse> = yield call(
        request,
        'PUT',
        apiPrototypeRelease(checklistId),
      );

      if (errors) {
        throw 'Unable to Relase the Prototype';
      }

      yield* onSuccess({ checklist: data });
      yield put(closeAllOverlayAction());
      yield put(
        openOverlayAction({
          type: OverlayNames.RELEASE_SUCCESS,
        }),
      );
    } else {
      if (validateErrors[0].code === LoginErrorCodes.INCORRECT) {
        throw 'Incorrect Password';
      } else if (validateErrors[0].code === LoginErrorCodes.BLOCKED) {
        yield put(closeAllOverlayAction());
        yield put(cleanUp());
        throw 'User has been blocked.';
      }
      throw 'Unable to Release the Prototype';
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
