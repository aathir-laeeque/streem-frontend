import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { deleteActivity, toggleNewParameter } from '#PrototypeComposer/Activity/actions';
import { ActivityProps } from '#PrototypeComposer/Activity/types';
import { MandatoryActivity, NonMandatoryActivity } from '#PrototypeComposer/checklist.types';
import { ParameterTypeMap } from '#PrototypeComposer/constants';
import CalculationTaskView from '#PrototypeComposer/Parameters/TaskViews/Calculation';
import MaterialInstructionTaskView from '#PrototypeComposer/Parameters/TaskViews/MaterialInstruction';
import MediaTaskView from '#PrototypeComposer/Parameters/TaskViews/Media';
import ShouldBeTaskView from '#PrototypeComposer/Parameters/TaskViews/Parameter';
import ResourceTaskView from '#PrototypeComposer/Parameters/TaskViews/Resource';
import SignatureTaskView from '#PrototypeComposer/Parameters/TaskViews/Signature';
import SingleLineTaskView from '#PrototypeComposer/Parameters/TaskViews/SingleLine';
import SingleSelectTaskView from '#PrototypeComposer/Parameters/TaskViews/SingleSelect';
import TextInstructionTaskView from '#PrototypeComposer/Parameters/TaskViews/TextInstruction';
import YesNoTaskView from '#PrototypeComposer/Parameters/TaskViews/YesNo';
import { useTypedSelector } from '#store/helpers';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DeleteOutlined, DragIndicator, EditOutlined, FilterList } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

export const ParameterTaskViewWrapper = styled.div`
  padding: 16px 8px 16px 0;

  :last-child {
    border-bottom: none;
  }

  :hover {
    .container {
      touch-action: none;
      background-color: rgba(29, 132, 255, 0.04);
      border: 1px solid #1d84ff;
      .draggable {
        visibility: visible;
      }

      .content {
        .actions {
          display: flex;
        }
      }
    }
  }

  .container {
    display: flex;
    position: relative;
    border: 1px solid #fff;

    &.dragging {
      z-index: 1;
      transition: none;

      * {
        cursor: grabbing;
      }

      box-shadow: -1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25);

      &:focus-visible {
        box-shadow: 0 0px 10px 2px #4c9ffe;
      }
    }

    .draggable {
      background-color: #1d84ff;
      align-items: center;
      cursor: pointer;
      display: flex;
      visibility: hidden;
      svg {
        color: #fff;
        font-size: 16px;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      /* transition: 0.2s all ease; */
      padding: 16px 16px 16px 8px;

      .actions {
        position: absolute;
        right: 16px;
        top: -16px;
        height: 32px;
        align-items: center;
        background: #fff;
        border: 1px solid #1d84ff;
        color: #1d84ff;
        display: none;

        @media (max-width: 1200px) {
          top: -12px;
          height: 24px;
        }

        svg {
          color: inherit;
          font-size: 32px;
          padding-inline: 4px;
          cursor: pointer;
          border-right: 1px solid #1d84ff;
          :last-of-type {
            border-right: none;
          }
          :hover {
            background-color: #1d84ff;
            color: #fff;
          }
          @media (max-width: 1200px) {
            font-size: 24px !important;
          }
        }
      }

      .filters-validations {
        margin-top: 8px;
        display: flex;
        align-items: center;
        color: #1d84ff;
        font-size: 14px;
        line-height: 16px;
        cursor: pointer;

        svg {
          font-size: 16px;
          margin-right: 8px;
        }
      }

      .parameter-label {
        font-size: 14px;
        line-height: 1.33;
        letter-spacing: 0.32px;
        color: #161616;
      }

      .form-group {
        padding: 0;
        > div {
          margin-bottom: 8px;

          :last-of-type {
            margin-bottom: 0px;
          }
        }
      }
    }
  }
`;

const ParameterTaskView: FC<ActivityProps> = ({ activity, taskId }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const dispatch = useDispatch();
  const { activeStageId: stageId } = useTypedSelector((state) => state.prototypeComposer.stages);
  const {
    activities: { listById },
  } = useTypedSelector((state) => state.prototypeComposer);
  const activityType = listById[activity.id].type;

  const onDelete = () => {
    if (stageId) {
      dispatch(deleteActivity({ activityId: activity.id, taskId, stageId }));
    }
  };

  const renderFiltersValidationsAction = (label: string, count: number) => {
    return (
      <div
        className="filters-validations"
        onClick={() =>
          dispatch(
            toggleNewParameter({
              action: 'task',
              title: 'Edit Process Parameter',
              activityId: activity.id,
              ...(activity.type in NonMandatoryActivity && {
                type: activity.type,
              }),
            }),
          )
        }
      >
        <FilterList />
        {label} ({count})
      </div>
    );
  };

  const renderTaskViewByType = () => {
    switch (activityType) {
      case MandatoryActivity.MEDIA:
        return <MediaTaskView activity={activity} />;

      case MandatoryActivity.CHECKLIST:
      case MandatoryActivity.MULTISELECT:
      case MandatoryActivity.SINGLE_SELECT:
        return <SingleSelectTaskView activity={activity} />;

      case MandatoryActivity.PARAMETER:
        return <ShouldBeTaskView activity={activity} />;

      case MandatoryActivity.SIGNATURE:
        return <SignatureTaskView activity={activity} />;

      case MandatoryActivity.NUMBER:
        return (
          <>
            <SingleLineTaskView activity={activity} />
            {activity.validations?.resourceActivityValidations &&
              renderFiltersValidationsAction(
                'Validations',
                activity.validations.resourceActivityValidations.length,
              )}
          </>
        );

      case MandatoryActivity.TEXTBOX:
      case MandatoryActivity.DATE:
        return <SingleLineTaskView activity={activity} />;

      case MandatoryActivity.YES_NO:
        return <YesNoTaskView activity={activity} />;

      case NonMandatoryActivity.INSTRUCTION:
        return <TextInstructionTaskView activity={activity} />;

      case NonMandatoryActivity.MATERIAL:
        return <MaterialInstructionTaskView activity={activity} />;

      case MandatoryActivity.CALCULATION:
        return <CalculationTaskView activity={activity} />;

      case MandatoryActivity.RESOURCE:
        return (
          <>
            <ResourceTaskView activity={activity} />
            {activity.data?.propertyValidations?.length > 0 &&
              renderFiltersValidationsAction(
                'Filters and Validations',
                activity.data.propertyValidations.length,
              )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <ParameterTaskViewWrapper>
      <div
        ref={setNodeRef}
        style={style}
        className={isDragging ? 'container dragging' : 'container'}
      >
        <div className="draggable" {...attributes} {...listeners}>
          <DragIndicator />
        </div>
        <div className="content">
          <div className="actions">
            <EditOutlined
              onClick={() =>
                dispatch(
                  toggleNewParameter({
                    action: 'task',
                    title:
                      activity.type in NonMandatoryActivity
                        ? 'Edit Instruction'
                        : 'Edit Process Parameter',
                    activityId: activity.id,
                    ...(activity.type in NonMandatoryActivity && {
                      type: activity.type,
                    }),
                  }),
                )
              }
            />
            <DeleteOutlined
              onClick={() => {
                if (stageId) {
                  dispatch(
                    openOverlayAction({
                      type: OverlayNames.CONFIRMATION_MODAL,
                      props: {
                        onPrimary: onDelete,
                        primaryText: 'Yes',
                        secondaryText: 'No',
                        title: 'Delete Parameter',
                        body: <>Are you sure you want to Delete this Parameter ?</>,
                      },
                    }),
                  );
                }
              }}
            />
          </div>
          {ParameterTypeMap[activity.type]}
          <span className="parameter-label">{activity.label}</span>
          {renderTaskViewByType()}
        </div>
      </div>
    </ParameterTaskViewWrapper>
  );
};

export default ParameterTaskView;
