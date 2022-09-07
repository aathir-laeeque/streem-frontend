import ActivityList from '#JobComposer/ActivityList';
import { Stage, Task } from '#JobComposer/checklist.types';
import { useTypedSelector } from '#store/helpers';
import React from 'react';
import styled from 'styled-components';
import AssigneeList from './AssigneeList';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: inherit;
  overflow-y: scroll;

  .assignee-info {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 48px 24px 16px;
  }

  .task-name {
    background-color: #f4f4f4;
    color: #000000;
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    padding: 32px;
  }

  .activity {
    &-list {
      opacity: 1;
      padding: 24px 0;
    }

    padding: 16px 32px;

    :first-child {
      padding-top: 0;
    }

    > div {
      text-align: left;
    }
  }
`;

type Props = {
  task: Task;
  stageOrder: Stage['orderTree'];
};

const TaskView = ({ task, stageOrder }: Props) => {
  const { userId } = useTypedSelector((state) => state.auth);

  const {
    activities,
    name: taskName,
    taskExecution: { assignees },
  } = task;

  const isLoggedInUserAssigned = task.taskExecution.assignees.some((user) => user.id === userId);

  return (
    <Wrapper>
      {assignees.length ? (
        <div className="assignee-info">
          <span>
            {isLoggedInUserAssigned
              ? 'This Task is Assigned to you and others'
              : 'Users Assigned to this Task'}
          </span>

          <AssigneeList users={assignees} />
        </div>
      ) : null}

      <div className="task-name">{`${stageOrder}.${task.orderTree} ${taskName}`}</div>

      <ActivityList
        activities={activities}
        isTaskStarted={false}
        isTaskCompleted={false}
        isCompletedWithException={false}
        isCorrectingError={false}
      />
    </Wrapper>
  );
};

export default TaskView;
