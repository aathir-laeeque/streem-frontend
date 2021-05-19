import { CommonOverlayProps } from '#components/OverlayContainer/types';
import AssignmentSuccess from '#assets/svg/AssignmentSuccess';
import { BaseModal } from '#components/shared/BaseModal';
import { Task } from '#JobComposer/checklist.types';
import { getUserName, User } from '#services/users';
import { useTypedSelector } from '#store/helpers';
import { Error } from '#utils/globalTypes';
import React, { FC } from 'react';
import styled from 'styled-components';

type AssignmentError = Error & {
  userId: User['id'];
};

type AssignmentInfoProps = {
  assignedUsers: User[];
  unassignedUsers: User[];
  selectedTasks: [Task['taskExecution']['id'], Task['id']][];
  errors: AssignmentError[];
};

const ASSIGNMENT_ERROR_CODE_MESSAGE_MAPPING: Record<string, string> = {
  E220: 'task is already completed',
  E221: 'user performed some action on task',
  E222: 'user signed off the task',
};

const Wrapper = styled.div`
  .modal {
    max-width: 600px !important;
  }

  .success {
    &-info {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 50px;
    }

    &-icon {
      font-size: 200px;
    }

    &-text {
      color: #000000;
      font-size: 20px;
      font-weight: bold;
      margin-top: 16px;
      text-align: center;
    }
  }

  .errors-info {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    max-height: 100px;
    overflow-y: scroll;
  }

  .error-item {
    color: #333333;
    font-size: 14px;
    letter-spacing: 0.16px;
    line-height: 1.43;
    margin-bottom: 16px;
    text-align: left;

    :last-child {
      margin-bottom: 0;
    }
  }
`;

const AssignmentInfo: FC<CommonOverlayProps<AssignmentInfoProps>> = ({
  closeAllOverlays,
  closeOverlay,
  props: {
    assignedUsers = [],
    errors = [],
    selectedTasks = [],
    unassignedUsers = [],
  } = {},
}) => {
  const { tasksById } = useTypedSelector((state) => state.composer.tasks);

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title={
          errors?.length
            ? 'Action could not be taken for the following users'
            : ''
        }
        showFooter={false}
        showHeader={!!errors.length}
      >
        {
          // TODO : Optimize the loops where in users & tasks can be created as a hashmap outside errors.map and use those inside.
          errors.length ? (
            <div className="errors-info">
              {errors.map((error) => {
                const taskId = (selectedTasks.find(
                  ([taskExecutionId]) => taskExecutionId === error.id,
                ) ?? [])[1];

                const taskName = tasksById[taskId as string].name;

                const user = [...assignedUsers, ...unassignedUsers].find(
                  (user) => user.id === error.userId,
                ) as User;

                const isUserGettingAssigned = assignedUsers.some(
                  (user) => user.id === error.userId,
                );

                const userName = getUserName({ user, withEmployeeId: true });

                return (
                  <div className="error-item" key={error.userId}>
                    <span>{userName}</span> could not be{' '}
                    {isUserGettingAssigned ? 'assigned to' : 'unassigned from'}{' '}
                    <span>{taskName}</span>, since{' '}
                    {ASSIGNMENT_ERROR_CODE_MESSAGE_MAPPING[error.code]}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="success-info">
              <AssignmentSuccess className="icon success-icon" />
              <span className="success-text">
                Action Completed Successfully
              </span>
            </div>
          )
        }
      </BaseModal>
    </Wrapper>
  );
};

export default AssignmentInfo;
