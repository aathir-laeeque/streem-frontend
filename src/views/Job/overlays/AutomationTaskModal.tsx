import { BaseModal, StyledTabs } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React from 'react';
import styled from 'styled-components';
import { Task } from '#PrototypeComposer/checklist.types';
import AutomationInfo from '../components/Task/AutomationInfo';
import { LocationProvider } from '@reach/router';

const Wrapper = styled.div`
  #modal-container .modal-background .modal {
    min-width: 450px;
  }

  .modal {
    width: 50%;

    .close-icon {
      color: #e0e0e0 !important;
      font-size: 16px !important;
      top: 19px !important;
    }

    .modal-header {
      border-bottom: 1px solid #f4f4f4 !important;
      h2 {
        color: #161616 !important;
        font-weight: bold !important;
        font-size: 14px !important;
      }
    }
    .modal-body {
      padding: 0px !important;

      .automation-modal-form-body {
        padding: 16px 16px 16px 26px;
      }
    }
  }
`;

type Props = {
  task: Task;
};

const AutomationTaskModal = (props: CommonOverlayProps<Props>) => {
  const {
    closeOverlay,
    closeAllOverlays,
    props: { task },
  } = props;

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
                  panelContent: <AutomationInfo task={task} executedSection={false} />,
                },
                {
                  value: '1',
                  label: 'Executed Automations',
                  panelContent: <AutomationInfo task={task} executedSection={true} />,
                },
              ]}
              activeTab="0"
            />
          </LocationProvider>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default AutomationTaskModal;
