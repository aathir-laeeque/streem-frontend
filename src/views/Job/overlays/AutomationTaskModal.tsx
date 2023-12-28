import { BaseModal, StyledTabs } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React from 'react';
import styled from 'styled-components';
import { Task } from '#PrototypeComposer/checklist.types';
import AutomationInfo from '../components/Task/AutomationInfo';
import { LocationProvider } from '@reach/router';
import { useTypedSelector } from '#store';

const Wrapper = styled.div`
  .modal {
    width: 70%;

    .close-icon {
      color: #e0e0e0 !important;
      font-size: 16px !important;
    }

    .modal-header {
      border-bottom: 1px solid #f4f4f4 !important;
      h2 {
        color: #161616 !important;
        font-weight: bold !important;
        font-size: 14px !important;
      }
    }
  }
`;

type Props = {
  taskId: any;
  initialTab?: number;
  taskExecutionId?: any;
};

const AutomationTaskModal = (props: CommonOverlayProps<Props>) => {
  const {
    closeOverlay,
    closeAllOverlays,
    props: { taskId, initialTab, taskExecutionId },
  } = props;

  const { tasks, taskExecutions } = useTypedSelector((state) => state.job);

  const taskData = tasks.get(taskId);
  const taskExecutionData = taskExecutions.get(taskExecutionId);

  return (
    <Wrapper>
      <BaseModal
        onSecondary={closeOverlay}
        closeModal={closeOverlay}
        closeAllModals={closeAllOverlays}
        title={'Automations'}
        showFooter={false}
      >
        <div className="automation-modal-form-body">
          <LocationProvider>
            <StyledTabs
              tabs={[
                {
                  value: '0',
                  label: 'Automations configured',
                  panelContent: (
                    <AutomationInfo
                      task={{ ...taskData, taskExecution: taskExecutionData }}
                      executedSection={false}
                      closeOverlay={closeOverlay}
                    />
                  ),
                },
                {
                  value: '1',
                  label: 'Executed Automations',
                  panelContent: (
                    <AutomationInfo
                      task={{ ...taskData, taskExecution: taskExecutionData }}
                      executedSection={true}
                      closeOverlay={closeOverlay}
                    />
                  ),
                },
              ]}
              activeTab={initialTab || '0'}
            />
          </LocationProvider>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default AutomationTaskModal;
