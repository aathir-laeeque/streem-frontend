import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  deleteParameter,
  deleteParameterSuccess,
  toggleNewParameter,
} from '#PrototypeComposer/Activity/actions';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { MandatoryParameter, NonMandatoryParameter } from '#PrototypeComposer/checklist.types';
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
import {
  RemoveCircleOutlineOutlined,
  DragIndicator,
  EditOutlined,
  FilterList,
  VisibilityOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { request } from '#utils/request';
import styled from 'styled-components';
import { apiDeleteParameter } from '#utils/apiUrls';

export const ParameterTaskViewWrapper = styled.div<{ isReadOnly: boolean }>`
  padding: ${({ isReadOnly }) => (isReadOnly ? '16px 8px' : '16px 8px 16px 0')};

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

const ParameterTaskView: FC<ParameterProps> = ({ parameter, taskId, isReadOnly }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: parameter.id,
    disabled: isReadOnly,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const dispatch = useDispatch();
  const { activeStageId: stageId } = useTypedSelector((state) => state.prototypeComposer.stages);
  const {
    parameters: { listById },
  } = useTypedSelector((state) => state.prototypeComposer);
  const parameterType = listById[parameter.id].type;

  const onDelete = () => {
    if (
      parameter.type === 'INSTRUCTION' ||
      parameter.type === 'CHECKLIST' ||
      parameter.type === 'MATERIAL'
    ) {
      archiveParameter();
    } else {
      dispatch(deleteParameter({ parameterId: parameter.id, taskId, stageId }));
    }
  };

  const archiveParameter = async () => {
    const { data } = await request('PATCH', apiDeleteParameter(parameter.id));
    if (data?.taskId && data?.stageId) {
      dispatch(
        deleteParameterSuccess({
          taskId: data.taskId,
          stageId: data.stageId,
          parameterId: parameter.id,
        }),
      );
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
              parameterId: parameter.id,
              ...(parameter.type in NonMandatoryParameter && {
                type: parameter.type,
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
    switch (parameterType) {
      case MandatoryParameter.MEDIA:
        return <MediaTaskView parameter={parameter} />;

      case MandatoryParameter.CHECKLIST:
      case MandatoryParameter.MULTISELECT:
      case MandatoryParameter.SINGLE_SELECT:
        return <SingleSelectTaskView parameter={parameter} />;

      case MandatoryParameter.SHOULD_BE:
        return <ShouldBeTaskView parameter={parameter} />;

      case MandatoryParameter.SIGNATURE:
        return <SignatureTaskView parameter={parameter} />;

      case MandatoryParameter.NUMBER:
        return (
          <>
            <SingleLineTaskView parameter={parameter} />
            {parameter.validations?.resourceParameterValidations &&
              renderFiltersValidationsAction(
                'Validations',
                parameter.validations.resourceParameterValidations.length,
              )}
          </>
        );

      case MandatoryParameter.SINGLE_LINE:
      case MandatoryParameter.MULTI_LINE:
      case MandatoryParameter.DATE:
      case MandatoryParameter.DATE_TIME:
        return <SingleLineTaskView parameter={parameter} />;

      case MandatoryParameter.YES_NO:
        return <YesNoTaskView parameter={parameter} />;

      case NonMandatoryParameter.INSTRUCTION:
        return <TextInstructionTaskView parameter={parameter} />;

      case NonMandatoryParameter.MATERIAL:
        return <MaterialInstructionTaskView parameter={parameter} />;

      case MandatoryParameter.CALCULATION:
        return <CalculationTaskView parameter={parameter} />;

      case MandatoryParameter.RESOURCE:
        return (
          <>
            <ResourceTaskView parameter={parameter} />
            {parameter.data?.propertyValidations?.length > 0 &&
              renderFiltersValidationsAction(
                'Filters and Validations',
                parameter.data.propertyValidations.length,
              )}
          </>
        );

      default:
        return null;
    }
  };

  const onViewOrEditParameter = () => {
    const titlePrefix = isReadOnly ? 'View' : 'Edit';
    dispatch(
      toggleNewParameter({
        action: 'task',
        title:
          parameter.type in NonMandatoryParameter
            ? `${titlePrefix} Instruction`
            : `${titlePrefix} Process Parameter`,
        parameterId: parameter.id,
        ...(parameter.type in NonMandatoryParameter && {
          type: parameter.type,
        }),
      }),
    );
  };

  return (
    <ParameterTaskViewWrapper isReadOnly={isReadOnly}>
      <div
        ref={setNodeRef}
        style={style}
        className={isDragging ? 'container dragging' : 'container'}
      >
        {!isReadOnly && (
          <div className="draggable" {...attributes} {...listeners}>
            <DragIndicator />
          </div>
        )}
        <div className="content">
          <div className="actions">
            {isReadOnly ? (
              <VisibilityOutlined onClick={onViewOrEditParameter} />
            ) : (
              <>
                <EditOutlined onClick={onViewOrEditParameter} />
                <RemoveCircleOutlineOutlined
                  onClick={() => {
                    if (stageId) {
                      dispatch(
                        openOverlayAction({
                          type: OverlayNames.CONFIRMATION_MODAL,
                          props: {
                            onPrimary: onDelete,
                            primaryText: 'Yes',
                            secondaryText: 'No',
                            title: 'Remove Parameter',
                            body: <>Are you sure you want to remove this Parameter from task?</>,
                          },
                        }),
                      );
                    }
                  }}
                />
              </>
            )}
          </div>
          {ParameterTypeMap[parameter.type]}
          <span className="parameter-label">{parameter.label}</span>
          {renderTaskViewByType()}
        </div>
      </div>
    </ParameterTaskViewWrapper>
  );
};

export default ParameterTaskView;
