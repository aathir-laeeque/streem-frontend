import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { BaseModal } from '#components/shared/BaseModal';
import { Task } from '#JobComposer/checklist.types';
import { getUserName, User } from '#services/users';
import { useTypedSelector } from '#store/helpers';
import { Error } from '#utils/globalTypes';
import { ArrowDropDown } from '@material-ui/icons';
import { pick } from 'lodash';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

import AssigneeList from './AssigneeList';

type AssignmentError = Error & {
  userId: User['id'];
};

type AssingnmentInfoProps = {
  assignedUsers: User[];
  unassignedUsers: User[];
  selectedTasks: [Task['taskExecution']['id'], Task['id']][];
  allUsers: User[];
  errors: AssignmentError[];
};

type TaskListProps = {
  tasks: Pick<Task, 'name' | 'id'>[];
};

const ASSIGNMENT_ERROR_CODE_MESSAGE_MAPPING = {
  E220: 'task is already completed',
  E221: 'user performed some action on task',
  E222: 'user signed off the task',
};

const Wrapper = styled.div`
  .modal {
    max-width: 600px !important;
  }

  .section {
    margin-bottom: 16px;

    .header {
      margin-bottom: 16px;
      margin-left: 16px;
      text-align: left;
    }
  }

  .more-info {
    align-items: center;
    color: #1d84ff;
    display: flex;
    margin-bottom: 16px;
    margin-left: 16px;

    .icon {
      color: #000000;
      font-size: 20px;
      margin-left: 8px;
    }
  }

  .errors {
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

const TaskListWrapper = styled.div`
  max-height: 100px;
  overflow-y: scroll;

  li {
    text-align: left;
  }
`;

const TaskList = ({ tasks }: TaskListProps) => (
  <TaskListWrapper>
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.name}</li>
      ))}
    </ul>
  </TaskListWrapper>
);

const AssingnmentInfo: FC<CommonOverlayProps<AssingnmentInfoProps>> = ({
  closeAllOverlays,
  closeOverlay,
  props: {
    assignedUsers = [],
    selectedTasks = [],
    unassignedUsers = [],
    errors = [],
    allUsers = [],
  } = {},
}) => {
  const [showMoreInfo, toggleMoreInfo] = useState(false);

  const { tasksById } = useTypedSelector((state) => state.composer.tasks);

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title="Assignment Information"
        showFooter={false}
      >
        {assignedUsers.length ? (
          <div className="users-assigned section">
            <div className="header">Users assigned to selected Tasks</div>
            <AssigneeList users={assignedUsers} />
            <TaskList
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              tasks={selectedTasks.map(([_, taskId]) =>
                pick(tasksById[taskId], ['name', 'id']),
              )}
            />
          </div>
        ) : null}

        {unassignedUsers.length ? (
          <div className="users-unassigned section">
            <div className="header">Users unssigned from selected Tasks</div>
            <AssigneeList users={unassignedUsers} />
            <TaskList
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              tasks={selectedTasks.map(([_, taskId]) =>
                pick(tasksById[taskId], ['name', 'id']),
              )}
            />
          </div>
        ) : null}

        {errors.length ? (
          <div
            className="more-info"
            onClick={() => toggleMoreInfo((val) => !val)}
          >
            More Info <ArrowDropDown className="icon" />{' '}
          </div>
        ) : null}

        {showMoreInfo ? (
          <div className="errors">
            {errors.map((error) => {
              const taskId = (selectedTasks.find(
                ([taskExecutionId]) => taskExecutionId === error.id,
              ) ?? [])[1];

              const taskName = tasksById[taskId as string].name;

              const user = allUsers.find(
                (user) => user.id === error.userId,
              ) as User;

              const isUserGettingAssigned = assignedUsers.some(
                (user) => user.id === error.userId,
              );

              const isUserGettingUnassigned = unassignedUsers.some(
                (user) => user.id === error.userId,
              );

              const userName = getUserName({ user, withEmployeeId: true });

              const message = `${userName} could not be ${
                isUserGettingAssigned ? 'assigned' : ''
              }${
                isUserGettingUnassigned ? 'unassigned' : ''
              } to ${taskName}, since ${
                ASSIGNMENT_ERROR_CODE_MESSAGE_MAPPING[error.code]
              }`;

              return (
                <div className="error-item" key={error.userId}>
                  {message}
                </div>
              );
            })}
          </div>
        ) : null}
      </BaseModal>
    </Wrapper>
  );
};

export default AssingnmentInfo;
