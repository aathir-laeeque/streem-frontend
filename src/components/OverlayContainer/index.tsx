import AssignmentSuccessModal from '#Composer/modals/AssignmentSuccess';
import CompleteJobWithException from '#Composer/modals/CompleteJobWithException';
import CompleteTaskWithException from '#Composer/modals/CompleteTaskWithException';
import MediaDetail from '#Composer/modals/MediaDetail';
import Signature from '#Composer/modals/SignatureActivity';
import SkipTask from '#Composer/modals/SkipTask';
import AddStop from '#Composer/modals/AddStop';
import StartJob from '#Composer/modals/StartJob';
import TaskErrorCorrection from '#Composer/modals/TaskErrorCorrection';
import TaskUserAssignment from '#Composer/modals/TaskUserAssignment';
import { AssignedUserDetailsPopover } from '#Composer/Popovers/AssignedUserDetailsPopover';
import { TaskAssignmentPopover } from '#Composer/Popovers/TaskAssignmentPopover';
import { useTypedSelector } from '#store';
import { CreateJobModal } from '#views/Jobs/Modals/CreateJobModal';
import { JobUserAssignModal } from '#views/Jobs/Modals/JobUserAssignModal';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { closeAllOverlayAction, closeOverlayAction } from './actions';
import { ConfirmationModal } from './ConfirmationModal';
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

    case OverlayNames.TASK_USER_ASSIGNMENT:
      return params.popOverAnchorEl ? (
        <TaskAssignmentPopover {...params} />
      ) : null;

    case OverlayNames.ASSIGNED_USER_DETAIL:
      return params.popOverAnchorEl ? (
        <AssignedUserDetailsPopover {...params} />
      ) : null;

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
