import { TaskMediaModal, TimedTaskConfigModal } from '#Composer-new/modals';
import EditingDisabledModal from '#Composer-new/modals/EditingDisabled';
import { AuthorsDetailsPopover } from '#Composer-new/Overlays/AuthorsDetailsPopover';
import InitiateSignOffModal from '#Composer-new/Overlays/InitiateSignOff';
import PasswordInputModal from '#Composer-new/Overlays/PasswordInput';
import ReviewerAssignmentModal from '#Composer-new/Overlays/ReviewerAssignmentModal';
import { ReviewerAssignmentPopover } from '#Composer-new/Overlays/ReviewerAssignmentPopover';
import ReviewerAssignmentSuccessModal from '#Composer-new/Overlays/ReviewerAssignmentSuccess';
import SignOffInitiatedSuccessModal from '#Composer-new/Overlays/SignOffInitiatedSuccess';
import { ReviewersDetailsPopover } from '#Composer-new/Overlays/ReviewersDetailsPopover';
import ReviewSubmitSuccessModal from '#Composer-new/Overlays/ReviewSubmitSuccess';
import SignOffSuccessModal from '#Composer-new/Overlays/SignOffSuccess';
import ReleaseSuccessModal from '#Composer-new/Overlays/ReleaseSuccess';
import SentToAuthorSuccessModal from '#Composer-new/Overlays/SentToAuthorSuccess';
import SignOffProgressModal from '#Composer-new/Overlays/SignOffProgress';
import { SubmitReviewModal } from '#Composer-new/Overlays/SubmitReview';
import AddStop from '#Composer/modals/AddStop';
import AssignmentSuccessModal from '#Composer/modals/AssignmentSuccess';
import CompleteJobWithException from '#Composer/modals/CompleteJobWithException';
import CompleteTaskWithException from '#Composer/modals/CompleteTaskWithException';
import MediaDetail from '#Composer/modals/MediaDetail';
import ParameterApprovalModal from '#Composer/modals/ParameterApproval';
import Signature from '#Composer/modals/SignatureActivity';
import SignCompletedTasksModal from '#Composer/modals/SignCompletedTasks';
import SignningNotCompleteModal from '#Composer/modals/SignningNotComplete';
import SignOffState from '#Composer/modals/SignOffStatus';
import SkipTask from '#Composer/modals/SkipTask';
import StartJob from '#Composer/modals/StartJob';
import TaskErrorCorrection from '#Composer/modals/TaskErrorCorrection';
import TaskUserAssignment from '#Composer/modals/TaskUserAssignment';
import { AssignedUserDetailsPopover } from '#Composer/Popovers/AssignedUserDetailsPopover';
import { TaskAssignmentPopover } from '#Composer/Popovers/TaskAssignmentPopover';
import { useTypedSelector } from '#store';
import SessionExpireModal from '#views/Auth/Overlays/SessionExpire';
import ChecklistInfoModal from '#views/Checklists/ListView/ChecklistInfoModal';
import { CreateJobModal } from '#views/Jobs/Modals/CreateJobModal';
import { JobUserAssignModal } from '#views/Jobs/Modals/JobUserAssignModal';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { closeAllOverlayAction, closeOverlayAction } from './actions';
import { ConfirmationModal } from './ConfirmationModal';
import SimpleConfirmationModal from './SimpleConfirmationModal';
import { CommonOverlayProps, OverlayNames } from './types';

const Wrapper = styled.div``;

const getOverlay = (params: CommonOverlayProps<any>) => {
  const { type } = params;
  switch (type) {
    case OverlayNames.CREATE_JOB_MODAL:
      return <CreateJobModal {...params} />;

    case OverlayNames.JOB_USER_ASSIGN:
      return <JobUserAssignModal {...params} />;

    case OverlayNames.SIGNATURE_MODAL:
      return <Signature {...params} />;

    case OverlayNames.CONFIRMATION_MODAL:
      return <ConfirmationModal {...params} />;

    case OverlayNames.START_JOB_MODAL:
      return <StartJob {...params} />;

    case OverlayNames.SKIP_TASK_MODAL:
      return <SkipTask {...params} />;

    case OverlayNames.COMPLETE_TASK_WITH_EXCEPTION:
      return <CompleteTaskWithException {...params} />;

    case OverlayNames.COMPLETE_JOB_WITH_EXCEPTION:
      return <CompleteJobWithException {...params} />;

    case OverlayNames.TASK_ERROR_CORRECTION:
      return <TaskErrorCorrection {...params} />;

    case OverlayNames.MEDIA_DETAIL:
      return <MediaDetail {...params} />;

    case OverlayNames.TASK_USERS_ASSIGNMENT:
      return <TaskUserAssignment {...params} />;

    case OverlayNames.ADD_STOP:
      return <AddStop {...params} />;

    case OverlayNames.ASSIGNMENT_SUCCESS:
      return <AssignmentSuccessModal {...params} />;

    case OverlayNames.CHECKLIST_REVIEWER_ASSIGNMENT:
      return <ReviewerAssignmentModal {...params} />;

    case OverlayNames.CHECKLIST_REVIEWER_ASSIGNMENT_SUCCESS:
      return <ReviewerAssignmentSuccessModal {...params} />;

    case OverlayNames.CHECKLIST_REVIEWER_SUBMIT_SUCCESS:
      return <ReviewSubmitSuccessModal {...params} />;

    case OverlayNames.CHECKLIST_SENT_TO_AUTHOR_SUCCESS:
      return <SentToAuthorSuccessModal {...params} />;

    case OverlayNames.SUBMIT_REVIEW_MODAL:
      return <SubmitReviewModal {...params} />;

    case OverlayNames.INITIATE_SIGNOFF:
      return <InitiateSignOffModal {...params} />;

    case OverlayNames.SIGN_OFF_PROGRESS:
      return <SignOffProgressModal {...params} />;

    case OverlayNames.SIGN_OFF_INITIATED_SUCCESS:
      return <SignOffInitiatedSuccessModal {...params} />;

    case OverlayNames.SIGN_OFF_SUCCESS:
      return <SignOffSuccessModal {...params} />;

    case OverlayNames.RELEASE_SUCCESS:
      return <ReleaseSuccessModal {...params} />;

    case OverlayNames.PASSWORD_INPUT:
      return <PasswordInputModal {...params} />;

    case OverlayNames.SESSION_EXPIRE:
      return <SessionExpireModal {...params} />;

    case OverlayNames.CHECKLIST_REVIEWER_ASSIGNMENT_POPOVER:
      return params.popOverAnchorEl ? (
        <ReviewerAssignmentPopover {...params} />
      ) : null;

    case OverlayNames.TASK_USER_ASSIGNMENT:
      return params.popOverAnchorEl ? (
        <TaskAssignmentPopover {...params} />
      ) : null;

    case OverlayNames.ASSIGNED_USER_DETAIL:
      return params.popOverAnchorEl ? (
        <AssignedUserDetailsPopover {...params} />
      ) : null;

    case OverlayNames.AUTHORS_DETAIL:
      return params.popOverAnchorEl ? (
        <AuthorsDetailsPopover {...params} />
      ) : null;

    case OverlayNames.REVIEWERS_DETAIL:
      return params.popOverAnchorEl ? (
        <ReviewersDetailsPopover {...params} />
      ) : null;

    case OverlayNames.SIMPLE_CONFIRMATION_MODAL:
      return <SimpleConfirmationModal {...params} />;

    case OverlayNames.TIMED_TASK_CONFIG:
      return <TimedTaskConfigModal {...params} />;

    case OverlayNames.TASK_MEDIA:
      return <TaskMediaModal {...params} />;

    case OverlayNames.SIGN_OFF_STATE:
      return <SignOffState {...params} />;

    case OverlayNames.SIGN_COMPLETED_TASKS:
      return <SignCompletedTasksModal {...params} />;

    case OverlayNames.SIGNNING_NOT_COMPLETE:
      return <SignningNotCompleteModal {...params} />;

    case OverlayNames.PARAMETER_APPROVAL:
      return <ParameterApprovalModal {...params} />;

    case OverlayNames.EDITING_DISABLED:
      return <EditingDisabledModal {...params} />;

    case OverlayNames.CHECKLIST_INFO:
      return <ChecklistInfoModal {...params} />;

    default:
      return null;
  }
};

const OverlayContainer: FC = () => {
  const dispatch = useDispatch();

  const { currentOverlays } = useTypedSelector(
    (state) => state.overlayContainer,
  );

  const closeOverlay = (params: OverlayNames) => {
    dispatch(closeOverlayAction(params));
  };

  const closeAllOverlays = () => {
    dispatch(closeAllOverlayAction());
  };

  return (
    <Wrapper>
      {currentOverlays.map((overlay, index) =>
        getOverlay({
          ...overlay,
          key: index.toString(),
          closeAllOverlays,
          closeOverlay: () => closeOverlay(overlay.type),
        }),
      )}
    </Wrapper>
  );
};

export default OverlayContainer;
