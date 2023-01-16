import { Textarea } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { CollaboratorType } from '#PrototypeComposer/reviewer.types';
import { useTypedSelector } from '#store/helpers';
import {
  ArrowDropDown,
  ArrowDropUp,
  AssignmentTurnedIn,
  DeleteOutlined,
  Error,
  Error as ErrorIcon,
  PanTool,
} from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Checklist, EnabledStates } from '../checklist.types';
import { deleteStage, reOrderStage, setActiveStage, updateStageName } from './actions';
import { StageCardWrapper } from './styles';
import { StageCardProps } from './types';

const StageCard = forwardRef<HTMLDivElement, StageCardProps>((props, ref) => {
  const { index, isActive, isFirstItem, isLastItem, stage, isReadOnly } = props;

  const { tasksInStage, data, parametersInStage, userId } = useTypedSelector((state) => ({
    tasksInStage: state.prototypeComposer.tasks.tasksOrderInStage[stage.id].map(
      (taskId) => state.prototypeComposer.tasks.listById[taskId],
    ),
    data: state.prototypeComposer.data,
    userId: state.auth.userId,
    parametersInStage: Object.keys(
      state.prototypeComposer.parameters.parameterOrderInTaskInStage[stage.id] ?? {},
    )
      .map(
        (taskId) =>
          state.prototypeComposer.parameters.parameterOrderInTaskInStage[stage.id][taskId],
      )
      .flat()
      .map((parameterId) => state.prototypeComposer.parameters.listById[parameterId]),
  }));

  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    setIsAuthor(
      (data as Checklist)?.collaborators?.some(
        (collaborator) =>
          (collaborator.type === CollaboratorType.PRIMARY_AUTHOR ||
            collaborator.type === CollaboratorType.AUTHOR) &&
          collaborator.id === userId,
      ),
    );
  }, []);

  const approvalNeeded = false;

  const anyParameterHasError = parametersInStage.some((parameter) => !!parameter.errors?.length);

  const { stageHasStop, anyTaskHasError } = tasksInStage.reduce(
    ({ stageHasStop, anyTaskHasError }, task) => {
      stageHasStop ||= task.hasStop;

      anyTaskHasError ||= !!task.errors.length;

      return { stageHasStop, anyTaskHasError };
    },
    { stageHasStop: false, anyTaskHasError: false },
  );

  const dispatch = useDispatch();

  const stageWiseError =
    !!stage.errors.length && stage.errors.find((error) => error.code === 'E128');

  const stageHasError = !!stage.errors.length || anyParameterHasError || anyTaskHasError;

  return (
    <StageCardWrapper
      ref={ref}
      isActive={isActive}
      onClick={() => dispatch(setActiveStage({ id: stage.id }))}
      hasError={stageHasError}
    >
      <div
        className={`overlap ${
          isAuthor && data?.state in EnabledStates && !data?.archived ? 'hide' : ''
        }`}
        onClick={() => {
          if (isActive) {
            dispatch(
              openOverlayAction({
                type: OverlayNames.EDITING_DISABLED,
                props: { state: data?.state, archived: data?.archived },
              }),
            );
          }
        }}
      />
      <div className="stage-header">
        <div className="order-control">
          <ArrowDropUp
            className="icon"
            fontSize="small"
            onClick={(event) => {
              event.stopPropagation();
              if (!isFirstItem) {
                dispatch(reOrderStage({ from: index, to: index - 1, id: stage.id }));
              }
            }}
          />
          <ArrowDropDown
            className="icon"
            fontSize="small"
            onClick={(event) => {
              event.stopPropagation();
              if (!isLastItem) {
                dispatch(reOrderStage({ from: index, to: index + 1, id: stage.id }));
              }
            }}
          />
        </div>

        <div className="stage-name">Stage {index + 1}</div>
        {!isReadOnly && (
          <DeleteOutlined
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
                        <span>You cannot recover your tasks once you delete the stage.</span>
                        <span>Are you sure you want to delete the stage?</span>
                      </>
                    ),
                  },
                }),
              );
            }}
          />
        )}
      </div>

      <div className="stage-body">
        <div className="stage-task-properties">
          {approvalNeeded ? <AssignmentTurnedIn className="icon" id="approval-needed" /> : null}

          {stageHasStop ? <PanTool className="icon" id="task-stop" /> : null}

          {(anyParameterHasError || anyTaskHasError || stageWiseError) && (
            <div className="stage-badge">
              <Error className="icon" />
              <span>Error Found</span>
            </div>
          )}
        </div>
        {stageWiseError && (
          <div className="stage-error-wrapper">
            <ErrorIcon className="stage-error-icon" />
            {stageWiseError.message}
          </div>
        )}
        <Textarea
          defaultValue={stage.name}
          error={!stage.name && stage.errors.find((error) => error.code === 'E303')?.message}
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
      </div>
    </StageCardWrapper>
  );
});

StageCard.displayName = 'Stage-Card';

export default StageCard;
