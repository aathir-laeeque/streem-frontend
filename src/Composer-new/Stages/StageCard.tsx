import { Textarea } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import {
  ArrowDownward,
  ArrowUpward,
  AssignmentTurnedIn,
  Delete,
  PanTool,
} from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';

import {
  deleteStage,
  reOrderStage,
  setActiveStage,
  updateStageName,
} from './actions';
import { StageCardWrapper } from './styles';
import { StageCardProps } from './types';

const StageCard = forwardRef<HTMLDivElement, StageCardProps>((props, ref) => {
  const { index, isActive, isFirstItem, isLastItem, stage } = props;

  const { tasksInStage } = useTypedSelector((state) => ({
    tasksInStage: state.prototypeComposer.tasks.tasksOrderInStage[stage.id].map(
      (taskId) => state.prototypeComposer.tasks.listById[taskId],
    ),
  }));

  const approvalNeeded = false;

  const stageHasStop = tasksInStage.reduce((acc, task) => {
    acc ||= task.hasStop;

    return acc;
  }, false);

  const dispatch = useDispatch();

  return (
    <StageCardWrapper
      ref={ref}
      isActive={isActive}
      onClick={() => dispatch(setActiveStage({ id: stage.id }))}
    >
      <div className="stage-header">
        <div className="order-control">
          <ArrowUpward
            className="icon"
            fontSize="small"
            onClick={(event) => {
              event.stopPropagation();
              if (!isFirstItem) {
                dispatch(
                  reOrderStage({ from: index, to: index - 1, id: stage.id }),
                );
              }
            }}
          />
          <ArrowDownward
            className="icon"
            fontSize="small"
            onClick={(event) => {
              event.stopPropagation();
              if (!isLastItem) {
                dispatch(
                  reOrderStage({ from: index, to: index + 1, id: stage.id }),
                );
              }
            }}
          />
        </div>

        <div className="stage-name">Stage {index + 1}</div>

        <Delete
          className="icon"
          id="stage-delete"
          onClick={(event) => {
            event.stopPropagation();
            dispatch(
              openOverlayAction({
                type: OverlayNames.SIMPLE_CONFIRMATION_MODAL,
                props: {
                  header: 'Delete Stage',
                  primaryText: 'Confirm',
                  secondaryText: 'Cancel',
                  onPrimaryClick: () => dispatch(deleteStage({ id: stage.id })),
                  body: (
                    <>
                      <span>
                        You cannot recover your tasks once you delete the stage.
                      </span>
                      <span>Are you sure you want to delete the stage?</span>
                    </>
                  ),
                },
              }),
            );
          }}
        />
      </div>

      <div className="stage-body">
        <div className="stage-task-properties">
          {approvalNeeded ? (
            <AssignmentTurnedIn className="icon" id="approval-needed" />
          ) : null}

          {stageHasStop ? <PanTool className="icon" id="task-stop" /> : null}
        </div>

        <Textarea
          defaultValue={stage.name}
          error={
            !stage.name &&
            stage.errors.find((error) => error.code === 'E303')?.message
          }
          label="Name the Stage"
          onChange={debounce(({ value }) => {
            dispatch(
              updateStageName({
                id: stage.id,
                name: value,
                orderTree: stage.orderTree,
              }),
            );
          }, 500)}
        />

        <span className="stage-task-count">{tasksInStage.length} Tasks</span>
      </div>
    </StageCardWrapper>
  );
});

StageCard.displayName = 'Stage-Card';

export default StageCard;
