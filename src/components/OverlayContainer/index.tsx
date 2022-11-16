import WebCamOverlay from '#components/shared/WebCamOverlay';
import AddStop from '#JobComposer/modals/AddStop';
import JobCompleteAllTasksError from '#JobComposer/modals/CompleteAllTasksError';
import CompletedWithExceptionInfo from '#JobComposer/modals/CompletedWithExceptionInfo';
import CompleteJobWithException from '#JobComposer/modals/CompleteJobWithException';
import CompleteTaskWithException from '#JobComposer/modals/CompleteTaskWithException';
import ParameterApprovalModal from '#JobComposer/modals/ParameterApproval';
import RefetchJobComposerData from '#JobComposer/modals/RefetchJobComposerData';
import Signature from '#JobComposer/modals/SignatureActivity';
import SignCompletedTasksModal from '#JobComposer/modals/SignCompletedTasks';
import SignningNotCompleteModal from '#JobComposer/modals/SignningNotComplete';
import SignOffState from '#JobComposer/modals/SignOffStatus';
import SkipTask from '#JobComposer/modals/SkipTask';
import StartJob from '#JobComposer/modals/StartJob';
import StartTaskError from '#JobComposer/modals/StartTaskError';
import TaskErrorCorrection from '#JobComposer/modals/TaskErrorCorrection';
import { AssignedUserDetailsPopover } from '#JobComposer/Popovers/AssignedUserDetailsPopover';
import { TaskMediaModal, TimedTaskConfigModal } from '#PrototypeComposer/modals';
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
import AssingnmentInfo from '#views/Jobs/Assignment/AssignmentInfo';
import UserAssignment from '#views/Jobs/Assignment/UserAssignmentModal';
import { CreateJobModal } from '#views/Jobs/Modals/CreateJobModal';
import SecretKeyModal from '#views/UserAccess/Overlays/SecretKeyModal';
import ValidateCredentialsModal from '#views/UserAccess/Overlays/ValidateCredentialsModal';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import ReasonModal from '../shared/ReasonModal';
import StartErrorModal from '../shared/StartErrorModal';
import AutomationActionModal from '#JobComposer/modals/AutomationAction';
import ChecklistUserAssignment from '#views/Checklists/Assignment/ChecklistUserAssignment';
import { closeAllOverlayAction, closeOverlayAction } from './actions';
import ConfigureColumnsModal from './ConfigureColumns';
import { ConfirmationModal } from './ConfirmationModal';
import SimpleConfirmationModal from './SimpleConfirmationModal';
import ConfigureActions from '#PrototypeComposer/Overlays/ConfigureActions';
import ProcessSharing from '#views/Checklists/Overlays/ProcessSharing';
import ConfigureJobParameters from '#PrototypeComposer/Overlays/ConfigureJobParameters';
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

    case OverlayNames.START_TASK_ERROR_MODAL:
      return <StartTaskError {...params} />;

    case OverlayNames.SKIP_TASK_MODAL:
      return <SkipTask {...params} />;

    case OverlayNames.COMPLETE_TASK_WITH_EXCEPTION:
      return <CompleteTaskWithException {...params} />;

    case OverlayNames.COMPLETE_JOB_WITH_EXCEPTION:
      return <CompleteJobWithException {...params} />;

    case OverlayNames.TASK_ERROR_CORRECTION:
      return <TaskErrorCorrection {...params} />;

    case OverlayNames.ADD_STOP:
      return <AddStop {...params} />;

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
      return params.popOverAnchorEl ? <ReviewerAssignmentPopover {...params} /> : null;

    case OverlayNames.ASSIGNED_USER_DETAIL:
      return params.popOverAnchorEl ? <AssignedUserDetailsPopover {...params} /> : null;

    case OverlayNames.AUTHORS_DETAIL:
      return params.popOverAnchorEl ? <AuthorsDetailsPopover {...params} /> : null;

    case OverlayNames.REVIEWERS_DETAIL:
      return params.popOverAnchorEl ? <ReviewersDetailsPopover {...params} /> : null;

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

    case OverlayNames.SECRET_KEY_MODAL:
      return <SecretKeyModal {...params} />;

    case OverlayNames.VALIDATE_CREDENTIALS_MODAL:
      return <ValidateCredentialsModal {...params} />;

    case OverlayNames.USER_ASSIGNMENT:
      return <UserAssignment {...params} />;

    case OverlayNames.CHECKLIST_USER_ASSIGNMENT:
      return <ChecklistUserAssignment {...params} />;

    case OverlayNames.ASSIGNMENT_INFO:
      return <AssingnmentInfo {...params} />;

    case OverlayNames.ENTITY_START_ERROR_MODAL:
      return <StartErrorModal {...params} />;

    case OverlayNames.REASON_MODAL:
      return <ReasonModal {...params} />;

    case OverlayNames.JOB_COMPLETE_ALL_TASKS_ERROR:
      return <JobCompleteAllTasksError {...params} />;

    case OverlayNames.WEBCAM_OVERLAY:
      return <WebCamOverlay {...params} />;

    case OverlayNames.REFETCH_JOB_COMPOSER_DATA:
      return <RefetchJobComposerData {...params} />;

    case OverlayNames.AUTOMATION_ACTION:
      return <AutomationActionModal {...params} />;

    case OverlayNames.CONFIGURE_COLUMNS:
      return <ConfigureColumnsModal {...params} />;

    case OverlayNames.CONFIGURE_ACTIONS:
      return <ConfigureActions {...params} />;

    case OverlayNames.PROCESS_SHARING:
      return <ProcessSharing {...params} />;

    case OverlayNames.CONFIGURE_JOB_PARAMETERS:
      return <ConfigureJobParameters {...params} />;

    default:
      return null;
  }
};

const OverlayContainer: FC = () => {
  const dispatch = useDispatch();

  const { currentOverlays } = useTypedSelector((state) => state.overlayContainer);

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
