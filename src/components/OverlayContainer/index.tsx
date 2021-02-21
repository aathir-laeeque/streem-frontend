import AddStop from '#JobComposer/modals/AddStop';
import AssignmentSuccessModal from '#JobComposer/modals/AssignmentSuccess';
import CompletedWithExceptionInfo from '#JobComposer/modals/CompletedWithExceptionInfo';
import CompleteJobWithException from '#JobComposer/modals/CompleteJobWithException';
import CompleteTaskWithException from '#JobComposer/modals/CompleteTaskWithException';
import MediaDetail from '#JobComposer/modals/MediaDetail';
import ParameterApprovalModal from '#JobComposer/modals/ParameterApproval';
import Signature from '#JobComposer/modals/SignatureActivity';
import SignCompletedTasksModal from '#JobComposer/modals/SignCompletedTasks';
import SignningNotCompleteModal from '#JobComposer/modals/SignningNotComplete';
import SignOffState from '#JobComposer/modals/SignOffStatus';
import SkipTask from '#JobComposer/modals/SkipTask';
import StartJob from '#JobComposer/modals/StartJob';
import TaskErrorCorrection from '#JobComposer/modals/TaskErrorCorrection';
import TaskUserAssignment from '#JobComposer/modals/TaskUserAssignment';
import { AssignedUserDetailsPopover } from '#JobComposer/Popovers/AssignedUserDetailsPopover';
import { TaskAssignmentPopover } from '#JobComposer/Popovers/TaskAssignmentPopover';
import {
  TaskMediaModal,
  TimedTaskConfigModal,
} from '#PrototypeComposer/modals';
import EditingDisabledModal from '#PrototypeComposer/modals/EditingDisabled';
import { AuthorsDetailsPopover } from '#PrototypeComposer/Overlays/AuthorsDetailsPopover';
import InitiateSignOffModal from '#PrototypeComposer/Overlays/InitiateSignOff';
import PasswordInputModal from '#PrototypeComposer/Overlays/PasswordInput';
import ReleaseSuccessModal from '#PrototypeComposer/Overlays/ReleaseSuccess';
import ReviewerAssignmentModal from '#PrototypeComposer/Overlays/ReviewerAssignmentModal';
import { ReviewerAssignmentPopover } from '#PrototypeComposer/Overlays/ReviewerAssignmentPopover';
import ReviewerAssignmentSuccessModal from '#PrototypeComposer/Overlays/ReviewerAssignmentSuccess';
import { ReviewersDetailsPopover } from '#PrototypeComposer/Overlays/ReviewersDetailsPopover';
import ReviewSubmitSuccessModal from '#PrototypeComposer/Overlays/ReviewSubmitSuccess';
import SentToAuthorSuccessModal from '#PrototypeComposer/Overlays/SentToAuthorSuccess';
import SignOffInitiatedSuccessModal from '#PrototypeComposer/Overlays/SignOffInitiatedSuccess';
import SignOffProgressModal from '#PrototypeComposer/Overlays/SignOffProgress';
import SignOffSuccessModal from '#PrototypeComposer/Overlays/SignOffSuccess';
import { SubmitReviewModal } from '#PrototypeComposer/Overlays/SubmitReview';
import { useTypedSelector } from '#store';
import SessionExpireModal from '#views/Auth/Overlays/SessionExpire';
import ArchiveModal from '#views/Checklists/ListView/ArchiveModal';
import ChecklistInfoModal from '#views/Checklists/ListView/ChecklistInfoModal';
import RevisionErrorModal from '#views/Checklists/Overlays/RevisionErrorModal';
import { CreateJobModal } from '#views/Jobs/Modals/CreateJobModal';
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

    case OverlayNames.SHOW_COMPLETED_JOB_WITH_EXCEPTION_INFO:
      return <CompletedWithExceptionInfo {...params} />;

    case OverlayNames.REVISION_ERROR:
      return <RevisionErrorModal {...params} />;

    case OverlayNames.ARCHIVE_MODAL:
      return <ArchiveModal {...params} />;

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
