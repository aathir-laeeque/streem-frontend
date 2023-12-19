import { AssignedUserDetailsPopover } from '#views/Job/overlays/AssignedUserDetailsPopover';
import AddStop from '#views/Job/overlays/AddStop';
import AutomationActionModal from '#views/Job/overlays/AutomationAction';
import JobCompleteAllTasksError from '#views/Job/overlays/CompleteAllTasksError';
import CompleteJobWithException from '#views/Job/overlays/CompleteJobWithException';
import CompletedWithExceptionInfo from '#views/Job/overlays/CompletedWithExceptionInfo';
import JobVerification from '#views/Job/overlays/JobVerification';
import ParameterVariationContent from '#views/Job/overlays/ParameterVariationContent';
import ParameterApprovalModal from '#views/Job/overlays/ParameterApproval';
import PeerVerificationModal from '#views/Job/overlays/PeerVerificationModal';
import RecallVerificationModal from '#views/Job/overlays/RecallVerificationModal';
import Signature from '#views/Job/overlays/SignatureActivity';
import SignningNotCompleteModal from '#views/Job/overlays/SignningNotComplete';
import StartTaskError from '#views/Job/overlays/StartTaskError';
import TaskPauseReasonModal from '#views/Job/overlays/TaskPauseReasonModal';
import ViewReason from '#views/Job/overlays/ViewReason';
import AutomationTaskModal from '#views/Job/overlays/AutomationTaskModal';
import { AuthorsDetailsPopover } from '#PrototypeComposer/Overlays/AuthorsDetailsPopover';
import { ChecklistErrorsPopover } from '#PrototypeComposer/Overlays/ChecklistErrorsPopover';
import ConfigureActions from '#PrototypeComposer/Overlays/ConfigureActions';
import ConfigureJobParameters from '#PrototypeComposer/Overlays/ConfigureJobParameters';
import InitiateSignOffModal from '#PrototypeComposer/Overlays/InitiateSignOff';
import PasswordInputModal from '#PrototypeComposer/Overlays/PasswordInput';
import ReleaseSuccessModal from '#PrototypeComposer/Overlays/ReleaseSuccess';
import ReviewSubmitSuccessModal from '#PrototypeComposer/Overlays/ReviewSubmitSuccess';
import ReviewerAssignmentModal from '#PrototypeComposer/Overlays/ReviewerAssignmentModal';
import { ReviewerAssignmentPopover } from '#PrototypeComposer/Overlays/ReviewerAssignmentPopover';
import ReviewerAssignmentSuccessModal from '#PrototypeComposer/Overlays/ReviewerAssignmentSuccess';
import { ReviewersDetailsPopover } from '#PrototypeComposer/Overlays/ReviewersDetailsPopover';
import SentToAuthorSuccessModal from '#PrototypeComposer/Overlays/SentToAuthorSuccess';
import SignOffInitiatedSuccessModal from '#PrototypeComposer/Overlays/SignOffInitiatedSuccess';
import SignOffProgressModal from '#PrototypeComposer/Overlays/SignOffProgress';
import SignOffSuccessModal from '#PrototypeComposer/Overlays/SignOffSuccess';
import { SubmitReviewModal } from '#PrototypeComposer/Overlays/SubmitReview';
import { TaskMediaModal, TimedTaskConfigModal } from '#PrototypeComposer/modals';
import EditingDisabledModal from '#PrototypeComposer/modals/EditingDisabled';
import { QRGenerator, QRScanner } from '#components';
import WebCamOverlay from '#components/shared/WebCamOverlay';
import { useTypedSelector } from '#store';
import SessionExpireModal from '#views/Auth/Overlays/SessionExpire';
import ChecklistUserAssignment from '#views/Checklists/Assignment/ChecklistUserAssignment';
import PutCustomViewModal from '#views/Checklists/JobLogs/Overlays/PutCustomViewModal';
import ArchiveModal from '#views/Checklists/ListView/ArchiveModal';
import ChecklistInfoModal from '#views/Checklists/ListView/ChecklistInfoModal';
import ProcessSharing from '#views/Checklists/Overlays/ProcessSharing';
import RevisionErrorModal from '#views/Checklists/Overlays/RevisionErrorModal';
import StartJob from '#views/Job/overlays/StartJob';
import AssingnmentInfo from '#views/Jobs/Assignment/AssignmentInfo';
import UserAssignment from '#views/Jobs/Assignment/UserAssignmentModal';
import SetDateModal from '#views/Jobs/Overlays/SetDateModal';
import SecretKeyModal from '#views/UserAccess/Overlays/SecretKeyModal';
import ValidateCredentialsModal from '#views/UserAccess/Overlays/ValidateCredentialsModal';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import ReasonModal from '../shared/ReasonModal';
import StartErrorModal from '../shared/StartErrorModal';
import ConfigureColumnsModal from './ConfigureColumns';
import { ConfirmationModal } from './ConfirmationModal';
import OrientationModal from './OrientationModal';
import SimpleConfirmationModal from './SimpleConfirmationModal';
import { MultiTabModal } from './MultiTabChecker';
import { closeAllOverlayAction, closeOverlayAction } from './actions';
import { CommonOverlayProps, OverlayNames } from './types';
import TaskRecurrenceModal from '#PrototypeComposer/Overlays/TaskRecurrenceModal';
import RepeatTaskError from '#views/Job/overlays/RepeatTaskError';
import RecurrenceExecutionModal from '#views/Job/overlays/RecurrenceExecutionModal';
import EndRecurrenceModal from '#views/Job/overlays/EndRecurrenceModal';
import ViewReasonModal from '#views/Job/overlays/ViewReasonModal';
import ScheduleTaskModal from '#PrototypeComposer/Overlays/ScheduleTaskModal';
import AddRemark from '#views/Job/overlays/AddRemark';

const Wrapper = styled.div``;

const getOverlay = (params: CommonOverlayProps<any>) => {
  const { type } = params;
  switch (type) {
    case OverlayNames.SIGNATURE_MODAL:
      return <Signature {...params} />;

    case OverlayNames.CONFIRMATION_MODAL:
      return <ConfirmationModal {...params} />;

    case OverlayNames.START_JOB_MODAL:
      return <StartJob {...params} />;

    case OverlayNames.START_TASK_ERROR_MODAL:
      return <StartTaskError {...params} />;

    case OverlayNames.COMPLETE_JOB_WITH_EXCEPTION:
      return <CompleteJobWithException {...params} />;

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

    case OverlayNames.CHECKLIST_ERRORS:
      return params.popOverAnchorEl ? <ChecklistErrorsPopover {...params} /> : null;

    case OverlayNames.SIMPLE_CONFIRMATION_MODAL:
      return <SimpleConfirmationModal {...params} />;

    case OverlayNames.TIMED_TASK_CONFIG:
      return <TimedTaskConfigModal {...params} />;

    case OverlayNames.TASK_MEDIA:
      return <TaskMediaModal {...params} />;

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

    case OverlayNames.QR_SCANNER:
      return <QRScanner {...params} />;

    case OverlayNames.QR_GENERATOR:
      return <QRGenerator {...params} />;

    case OverlayNames.PUT_CUSTOM_VIEW:
      return <PutCustomViewModal {...params} />;

    case OverlayNames.SET_DATE:
      return <SetDateModal {...params} />;

    case OverlayNames.PEER_VERIFICATION_MODAL:
      return <PeerVerificationModal {...params} />;

    case OverlayNames.RECALL_VERIFICATION_MODAL:
      return <RecallVerificationModal {...params} />;

    case OverlayNames.JOB_VERIFICATION:
      return <JobVerification {...params} />;

    case OverlayNames.VIEW_REASON:
      return <ViewReason {...params} />;

    case OverlayNames.TASK_PAUSE_REASON_MODAL:
      return <TaskPauseReasonModal {...params} />;

    case OverlayNames.AUTOMATION_TASK_MODAL:
      return <AutomationTaskModal {...params} />;

    case OverlayNames.ORIENTATION_MODAL:
      return <OrientationModal {...params} />;

    case OverlayNames.MULTI_TAB_MODAL:
      return <MultiTabModal {...params} />;

    case OverlayNames.JOB_PARAMETER_VARIATION:
      return <ParameterVariationContent {...params} />;
    case OverlayNames.TASK_RECURRENCE_MODAL:
      return <TaskRecurrenceModal {...params} />;

    case OverlayNames.REPEAT_TASK_ERROR_MODAL:
      return <RepeatTaskError {...params} />;

    case OverlayNames.TASK_RECURRENCE_EXECUTION_MODAL:
      return <RecurrenceExecutionModal {...params} />;

    case OverlayNames.END_TASK_RECURRENCE_MODAL:
      return <EndRecurrenceModal {...params} />;

    case OverlayNames.VIEW_REASON_MODAL:
      return <ViewReasonModal {...params} />;

    case OverlayNames.SCHEDULE_TASK_MODAL:
      return <ScheduleTaskModal {...params} />;
    case OverlayNames.ADD_REMARK_MODAL:
      return <AddRemark {...params} />;

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
