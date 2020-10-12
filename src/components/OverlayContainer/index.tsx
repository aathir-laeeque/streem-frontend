import { TaskMediaModal, TimedTaskConfigModal } from '#Composer-new/modals';
import AddStop from '#Composer/modals/AddStop';
import AssignmentSuccessModal from '#Composer/modals/AssignmentSuccess';
import CompleteJobWithException from '#Composer/modals/CompleteJobWithException';
import CompleteTaskWithException from '#Composer/modals/CompleteTaskWithException';
import MediaDetail from '#Composer/modals/MediaDetail';
import Signature from '#Composer/modals/SignatureActivity';
import SkipTask from '#Composer/modals/SkipTask';
import StartJob from '#Composer/modals/StartJob';
import TaskErrorCorrection from '#Composer/modals/TaskErrorCorrection';
import TaskUserAssignment from '#Composer/modals/TaskUserAssignment';
import { AssignedUserDetailsPopover } from '#Composer/Popovers/AssignedUserDetailsPopover';
import { TaskAssignmentPopover } from '#Composer/Popovers/TaskAssignmentPopover';
import ReviewerAssignmentModal from '#Composer-new/Overlays/ReviewerAssignmentModal';
import ReviewerAssignmentSuccessModal from '#Composer-new/Overlays/ReviewerAssignmentSuccess';
import ReviewSubmitSuccessModal from '#Composer-new/Overlays/ReviewSubmitSuccess';
import { ReviewerAssignmentPopover } from '#Composer-new/Overlays/ReviewerAssignmentPopover';
import { SubmitReviewModal } from '#Composer-new/Overlays/SubmitReview';
import { AuthorsDetailsPopover } from '#Composer-new/Overlays/AuthorsDetailsPopover';
import { ReviewersDetailsPopover } from '#Composer-new/Overlays/ReviewersDetailsPopover';
import { useTypedSelector } from '#store';
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

    case OverlayNames.SUBMIT_REVIEW_MODAL:
      return <SubmitReviewModal {...params} />;

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

    case OverlayNames.TASK_MEDIA_UPLOAD:
      return <TaskMediaModal {...params} />;

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
