import { BaseModal, Avatar, ProgressBar } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React, { FC } from 'react';
import styled from 'styled-components';
import { pick } from 'lodash';

const Wrapper = styled.div`
  .modal-body {
    padding: 0 !important;
  }

  .close-icon {
    top: 24px !important;
    right: 32px !important;
  }

  .header {
    border-bottom: 1px solid #dadada;
    font-size: 20px;
    font-weight: bold;
    padding: 24px 32px;
    text-align: left;
  }

  .body {
    max-height: 250px;
    overflow: auto;
    padding: 24px 32px;

    .item {
      display: flex;
      margin-bottom: 16px;

      :last-child {
        margin-bottom: 0;
      }

      .progress-details {
        align-items: center;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        margin-left: 8px;

        > div.details {
          color: #666666;
          margin-top: 4px;
          text-align: left;
          width: 100%;
        }
      }
    }
  }
`;

type Assignee = {
  assigned: boolean;
  assignedTasks: number;
  completelyAssigned: boolean;
  employeeId: string;
  firstName: string;
  id: string;
  lastName: string;
  pendingSignOffs: number;
  signedOffTasks: number;
};

type Props = {
  data: Assignee[];
};

const SignOffStateModal: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { data: assignees = [] } = {},
}) => {
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <div className="header">Signing Off State</div>

        <div className="body">
          {assignees?.map((assignee, index) => {
            const { assignedTasks, id, signedOffTasks } = assignee;

            const percentage = Math.round(
              (signedOffTasks / assignedTasks) * 100,
            );

            return (
              <div key={`${id}-${index}`} className="item">
                <Avatar
                  color="blue"
                  user={pick(assignee, [
                    'id',
                    'firstName',
                    'lastName',
                    'employeeId',
                  ])}
                />

                <div className="progress-details">
                  <ProgressBar percentage={percentage} />
                  <div className="details">
                    Signed : {signedOffTasks} of {assignedTasks} tasks
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default SignOffStateModal;
