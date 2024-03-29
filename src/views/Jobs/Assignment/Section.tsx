import { Checkbox } from '#components';
import { useTypedSelector } from '#store';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import React, { Dispatch, FC, useState } from 'react';
import styled from 'styled-components';
import AssigneeList from './AssigneeList';
import { COMPLETED_TASK_STATES, Stage } from '#types';

type Props = {
  stage: Stage;
  sectionState: Record<string, [boolean, string]>;
  localDispatch: Dispatch<any>;
  isFirst: boolean;
};

export const AssignmentSectionWrapper = styled.div.attrs({
  className: 'section',
})`
  display: flex;
  flex-direction: column;
  margin-bottom: 1px;

  .checkbox-input {
    label.container {
      color: #333333;
      font-weight: bold;

      .checkmark {
        background-color: #fff;
        border-color: #333;
        border-radius: 0px;
        border-width: 2px;
      }

      input:checked ~ .checkmark {
        background-color: #1d84ff;
        border: none;
      }
    }
  }

  .pill {
    border: 1px solid transparent;
    border-radius: 4px;
    font-size: 12px;
    margin-left: 16px;
    padding: 2px 4px;

    &.partial {
      background-color: rgba(247, 181, 0, 0.2);
      border-color: #f7b500;
      color: #dba613;
    }

    &.assigned,
    &.completed {
      background-color: #e1fec0;
      border-color: #5aa700;
      color: #5aa700;
    }

    &.unassigned {
      background-color: #ffebeb;
      border-color: #cc5656;
      color: #cc5656;
    }
  }

  .section {
    &-header {
      align-items: center;
      background-color: #eeeeee;
      display: flex;
      justify-content: space-between;
      padding: 10px 16px;

      .checkbox-input {
        margin-right: auto;
      }

      .icon-wrapper {
        align-items: center;
        background-color: #dadada;
        border-radius: 50%;
        display: flex;
        margin-right: 8px;
        padding: 2px;
      }

      .icon {
        color: #1d84ff;
        font-size: 20px;
        margin-left: 16px;
      }

      .toggle-section {
        color: #333333;
        font-size: 20px;
        margin-left: 0;
      }
    }

    &-body {
      display: flex;
      flex-direction: column;

      &-item {
        align-items: center;
        background-color: #ffffff;
        border-bottom: 1px solid #eeeeee;
        display: flex;
        padding: 10px 16px;

        > span {
          margin-left: 32px;
          margin-right: auto;
        }

        &.disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        :last-child {
          border-bottom: none;
        }

        .checkbox-input {
          margin-left: 32px;
          margin-right: auto;

          label.container {
            font-weight: normal;
          }
        }

        .icon {
          color: #1d84ff;
          font-size: 20px;
          margin-left: 16px;
        }
      }
    }
  }
`;

const Section: FC<Props> = ({ stage, sectionState = {}, localDispatch, isFirst }) => {
  const [isOpen, toggleIsOpen] = useState(isFirst);

  const { tasks, taskExecutions } = useTypedSelector((state) => state.job);

  const isAllTaskAssigned = stage.tasks
    .map((taskId) => {
      const task = tasks.get(taskId);
      const taskExecution = taskExecutions.get(task.taskExecutions[0]);
      return !!taskExecution?.assignees?.length;
    })
    .every(Boolean);

  const isNoTaskAssigned = stage.tasks
    .map((taskId) => {
      const task = tasks.get(taskId);
      const taskExecution = taskExecutions.get(task.taskExecutions[0]);
      return !!taskExecution?.assignees?.length;
    })
    .every((val) => val === false);

  const isAllTaskSelected = Object.values(sectionState).every((val) => val[0] === true);
  const isNoTaskSelected = Object.values(sectionState).every((val) => val[0] === false);

  return (
    <AssignmentSectionWrapper>
      <div className="section-header">
        <div className="icon-wrapper" onClick={() => toggleIsOpen((val) => !val)}>
          {isOpen ? (
            <ArrowDropDown className="icon toggle-section" />
          ) : (
            <ArrowRight className="icon toggle-section" />
          )}
        </div>

        <Checkbox
          {...(isAllTaskSelected
            ? { checked: true, partial: false }
            : isNoTaskSelected
            ? { checked: false, partial: false }
            : { checked: false, partial: true })}
          label={
            <div>
              <span style={{ fontWeight: 'bold' }}>Stage {stage.orderTree}</span> {stage.name}
            </div>
          }
          onClick={() => {
            localDispatch({
              type: 'SET_TASK_SELECTED_STATE',
              payload: {
                stageId: stage.id,
                taskExecutionIds: stage.tasks.reduce<string[]>((acc, taskId) => {
                  const task = tasks.get(taskId);
                  const taskExecution = taskExecutions.get(task.taskExecutions[0]);
                  if (taskExecution.state in COMPLETED_TASK_STATES) return acc;
                  return [...acc, taskExecution.id];
                }, []),

                states: stage.tasks.reduce<string[]>((acc, taskId) => {
                  const task = tasks.get(taskId);
                  const taskExecution = taskExecutions.get(task.taskExecutions[0]);
                  if (taskExecution.state in COMPLETED_TASK_STATES) return acc;
                  return [...acc, isAllTaskSelected ? false : isNoTaskSelected ? true : false];
                }, []),
              },
            });
          }}
        />

        <div
          className={`pill ${
            isAllTaskAssigned ? 'assigned' : isNoTaskAssigned ? 'unassigned' : 'partial'
          }`}
        >
          {isAllTaskAssigned ? 'Assigned' : isNoTaskAssigned ? 'Unassigned' : 'Partial Assigned'}
        </div>
      </div>
      {isOpen ? (
        <div className="section-body">
          {stage.tasks.map((taskId) => {
            const task = tasks.get(taskId);
            const taskExecution = taskExecutions.get(task.taskExecutions[0]);
            const isTaskCompleted = taskExecution?.state in COMPLETED_TASK_STATES;
            return (
              <div className="section-body-item" key={task.id}>
                <Checkbox
                  disabled={isTaskCompleted}
                  checked={(sectionState[taskExecution.id] ?? [])[0] ?? false}
                  label={`Task ${stage.orderTree}.${task.orderTree} : ${task.name}`}
                  onClick={() => {
                    localDispatch({
                      type: 'SET_TASK_SELECTED_STATE',
                      payload: {
                        stageId: stage.id,
                        taskExecutionIds: [taskExecution.id],
                        states: [!sectionState[taskExecution.id][0]],
                      },
                    });
                  }}
                />

                {taskExecution.assignees.length ? (
                  <AssigneeList users={taskExecution?.assignees} />
                ) : (
                  <div className="pill unassigned">Unassigned</div>
                )}

                {isTaskCompleted ? <div className="pill completed">Task Complete</div> : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </AssignmentSectionWrapper>
  );
};

export default Section;
