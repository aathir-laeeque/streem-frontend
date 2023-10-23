import {
  deleteParameter,
  deleteParameterSuccess,
  toggleNewParameter,
} from '#PrototypeComposer/Activity/actions';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import CalculationTaskView from '#PrototypeComposer/Parameters/TaskViews/Calculation';
import FileUploadTaskView from '#PrototypeComposer/Parameters/TaskViews/FileUpload';
import MaterialInstructionTaskView from '#PrototypeComposer/Parameters/TaskViews/MaterialInstruction';
import MediaTaskView from '#PrototypeComposer/Parameters/TaskViews/Media';
import ShouldBeTaskView from '#PrototypeComposer/Parameters/TaskViews/Parameter';
import ResourceTaskView from '#PrototypeComposer/Parameters/TaskViews/Resource';
import SignatureTaskView from '#PrototypeComposer/Parameters/TaskViews/Signature';
import SingleLineTaskView from '#PrototypeComposer/Parameters/TaskViews/SingleLine';
import SingleSelectTaskView from '#PrototypeComposer/Parameters/TaskViews/SingleSelect';
import TextInstructionTaskView from '#PrototypeComposer/Parameters/TaskViews/TextInstruction';
import YesNoTaskView from '#PrototypeComposer/Parameters/TaskViews/YesNo';
import {
  MandatoryParameter,
  NonMandatoryParameter,
  ParameterVerificationTypeEnum,
} from '#PrototypeComposer/checklist.types';
import { ParameterTypeMap } from '#PrototypeComposer/constants';
import peerVerificationIcon from '#assets/svg/peerVerification.svg';
import selfVerificationIcon from '#assets/svg/selfVerification.svg';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { apiDeleteParameter } from '#utils/apiUrls';
import { request } from '#utils/request';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Tooltip from '@material-ui/core/Tooltip';
import {
  DragIndicator,
  EditOutlined,
  Error as ErrorIcon,
  FilterList,
  RemoveCircleOutlineOutlined,
  VisibilityOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { ParameterMode } from '#types';
import { withStyles } from '@material-ui/core/styles';

const CustomTooltip = withStyles({
  tooltip: {
    width: '205px',
    backgroundColor: '#393939',
    borderRadius: '0px',
    color: '#fff',
    textAlign: 'center',
    fontSize: '14px',
  },
  arrow: {
    color: '#393939',
  },
})(Tooltip);

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
      .parameter-error {
        align-items: center;
        color: #eb5757;
        display: flex;
        font-size: 12px;
        justify-content: flex-start;
        margin-top: 8px;

        .icon {
          font-size: 16px;
          color: #eb5757;
          margin-right: 5px;
        }
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

    .verification-icons {
      display: flex;
      gap: 8px;
    }
  }
`;

const ParameterTaskView: FC<ParameterProps> = ({ parameter, taskId, isReadOnly }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: parameter?.id,
    disabled: isReadOnly,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const dispatch = useDispatch();
  const {
    parameters: { listById },
    stages: { activeStageId: stageId },
  } = useTypedSelector((state) => state.prototypeComposer);
  const parameterType = listById[parameter?.id]?.type;

  const onDelete = () => {
    if (
      parameter?.type === NonMandatoryParameter.INSTRUCTION ||
      parameter?.type === MandatoryParameter.CHECKLIST ||
      parameter?.type === NonMandatoryParameter.MATERIAL
    ) {
      archiveParameter();
    } else {
      dispatch(deleteParameter({ parameterId: parameter?.id, taskId, stageId }));
    }
  };

  const archiveParameter = async () => {
    const { data } = await request('PATCH', apiDeleteParameter(parameter?.id));
    if (data?.taskId && data?.stageId) {
      dispatch(
        deleteParameterSuccess({
          taskId: data.taskId,
          stageId: data.stageId,
          parameterId: parameter?.id,
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
              parameterId: parameter?.id,
              ...(parameter?.type in NonMandatoryParameter && {
                type: parameter?.type,
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
        return <MediaTaskView />;

      case MandatoryParameter.FILE_UPLOAD:
        return <FileUploadTaskView />;

      case MandatoryParameter.CHECKLIST:
      case MandatoryParameter.MULTISELECT:
      case MandatoryParameter.SINGLE_SELECT:
        return <SingleSelectTaskView parameter={parameter} />;

      case MandatoryParameter.SHOULD_BE:
        return <ShouldBeTaskView parameter={parameter} />;

      case MandatoryParameter.SIGNATURE:
        return <SignatureTaskView />;

      case MandatoryParameter.NUMBER:
        return (
          <>
            <SingleLineTaskView parameter={parameter} />
            {parameter.validations?.resourceParameterValidations?.length > 0 &&
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
      case MandatoryParameter.MULTI_RESOURCE:
        return (
          <>
            <ResourceTaskView parameter={parameter} />
            {(parameter.data?.propertyValidations?.length > 0 ||
              parameter.data?.propertyFilters?.fields?.length > 0) &&
              renderFiltersValidationsAction(
                'Filters and Validations',
                (parameter.data?.propertyValidations?.length ?? 0) +
                  (parameter.data?.propertyFilters?.fields?.length ?? 0),
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
          parameter?.type in NonMandatoryParameter
            ? `${titlePrefix} Instruction`
            : `${titlePrefix} Process Parameter`,
        parameterId: parameter?.id,
        ...(parameter?.type in NonMandatoryParameter && {
          type: parameter?.type,
        }),
      }),
    );
  };

  return (
    <ParameterTaskViewWrapper
      isReadOnly={isReadOnly || parameter.mode === ParameterMode.READ_ONLY}
      className="parameter-task-view"
    >
      <div
        ref={setNodeRef}
        style={style}
        className={isDragging ? 'container dragging' : 'container'}
      >
        {!isReadOnly && parameter.mode !== ParameterMode.READ_ONLY && (
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
                {parameter?.mode !== ParameterMode.READ_ONLY && (
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
                )}
              </>
            )}
          </div>
          <>
            {ParameterTypeMap[parameter?.type]}
            <span className="parameter-label">{parameter?.label}</span>
          </>
          {parameter.errors?.length > 0 && (
            <span className="parameter-error">
              <ErrorIcon className="icon" />
              {parameter.errors?.[0]?.message}
            </span>
          )}
          {renderTaskViewByType()}
          <div className="verification-icons">
            {parameter?.verificationType === ParameterVerificationTypeEnum.SELF ||
            parameter?.verificationType === ParameterVerificationTypeEnum.BOTH ? (
              <CustomTooltip title="Self Verification Enabled" arrow>
                <img src={selfVerificationIcon} alt="icon" width="24px" />
              </CustomTooltip>
            ) : (
              ''
            )}
            {parameter?.verificationType === ParameterVerificationTypeEnum.PEER ||
            parameter?.verificationType === ParameterVerificationTypeEnum.BOTH ? (
              <CustomTooltip title="Peer Verification Enabled" arrow>
                <img src={peerVerificationIcon} alt="icon" width="24px" />
              </CustomTooltip>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </ParameterTaskViewWrapper>
  );
};

export default ParameterTaskView;
