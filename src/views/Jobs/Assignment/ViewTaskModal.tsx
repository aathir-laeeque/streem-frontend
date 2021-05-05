import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { BaseModal } from '#components/shared/BaseModal';
import { Task, Stage } from '#JobComposer/checklist.types';
import React from 'react';
import styled from 'styled-components';

import TaskView from './TaskView';

type ViewTaskModalProps = {
  task: Task;
  stageOrder: Stage['orderTree'];
};

const Wrapper = styled.div`
  .modal {
    height: 700px;
    max-height: 700px !important;
    max-width: 550px !important;

    &-header {
      border: none !important;
    }

    &-body {
      height: inherit;
      padding: 0 !important;
    }
  }
`;

const ViewTaskModal = ({
  closeOverlay,
  closeAllOverlays,
  props,
}: CommonOverlayProps<ViewTaskModalProps>) => (
  <Wrapper>
    <BaseModal
      closeModal={closeOverlay}
      closeAllModals={closeAllOverlays}
      showFooter={false}
      showHeader={false}
    >
      <TaskView {...(props as ViewTaskModalProps)} />
    </BaseModal>
  </Wrapper>
);

export default ViewTaskModal;
