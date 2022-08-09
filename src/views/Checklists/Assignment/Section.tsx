import { Checkbox } from '#components';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import React, { Dispatch, FC, useState } from 'react';
import { Stage } from '#PrototypeComposer/Stages/types';
import { State } from '.';
import AssigneeList from '#views/Jobs/Assignment/AssigneeList';
import { User } from '#services/users';
import { AssignmentSectionWrapper } from '#views/Jobs/Assignment/Section';

type Props = {
  stage: Stage;
  sectionState: Record<string, boolean>;
  localDispatch: Dispatch<any>;
  isFirst: boolean;
  isAllTaskSelected: boolean;
  isNoTaskSelected: boolean;
  assignedUsersMap: State['usersMap'];
  mappedTasks: State['mappedTasks'];
};

const Section: FC<Props> = ({
  stage,
  sectionState = {},
  localDispatch,
  isFirst,
  isAllTaskSelected,
  isNoTaskSelected,
  assignedUsersMap,
  mappedTasks,
}) => {
  const [isOpen, toggleIsOpen] = useState(isFirst);
  let isAllTaskAssigned = true;
  let isNoTaskAssigned = true;

  stage.tasks.forEach((task) => {
    if (mappedTasks?.[task.id]) {
      isNoTaskAssigned = false;
    } else {
      isAllTaskAssigned = false;
    }
  });

  return (
    <AssignmentSectionWrapper>
      <div className="section-header">
        <div
          className="icon-wrapper"
          onClick={() => toggleIsOpen((val) => !val)}
        >
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
              <span style={{ fontWeight: 'bold' }}>
                Stage {stage.orderTree}
              </span>{' '}
              {stage.name}
            </div>
          }
          onClick={() => {
            localDispatch({
              type: 'SET_TASK_SELECTED_STATE',
              payload: {
                stageId: stage.id,
                taskIds: stage.tasks.map((task) => task.id),

                states: stage.tasks.map(() =>
                  isAllTaskSelected ? false : isNoTaskSelected,
                ),
              },
            });
          }}
        />

        <div
          className={`pill ${
            isAllTaskAssigned
              ? 'assigned'
              : isNoTaskAssigned
              ? 'unassigned'
              : 'partial'
          }`}
        >
          {isAllTaskAssigned
            ? 'Assigned'
            : isNoTaskAssigned
            ? 'Unassigned'
            : 'Partial Assigned'}
        </div>
      </div>
      {isOpen && (
        <div className="section-body">
          {stage.tasks.map((task) => {
            return (
              <div className="section-body-item" key={task.id}>
                <Checkbox
                  checked={sectionState[task.id] ?? false}
                  label={`Task ${stage.orderTree}.${task.orderTree} : ${task.name}`}
                  onClick={() => {
                    localDispatch({
                      type: 'SET_TASK_SELECTED_STATE',
                      payload: {
                        stageId: stage.id,
                        taskIds: [task.id],
                        states: [!sectionState[task.id]],
                      },
                    });
                  }}
                />

                {mappedTasks?.[task.id] ? (
                  <AssigneeList
                    users={
                      mappedTasks[task.id].map(
                        (userId) => assignedUsersMap[userId],
                      ) as User[]
                    }
                  />
                ) : (
                  <div className="pill unassigned">Unassigned</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AssignmentSectionWrapper>
  );
};

export default Section;
