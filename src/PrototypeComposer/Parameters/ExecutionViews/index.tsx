import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { deleteParameter, toggleNewParameter } from '#PrototypeComposer/Activity/actions';
import { parameterReducer } from '#PrototypeComposer/Activity/reducer';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { MandatoryParameter, NonMandatoryParameter } from '#PrototypeComposer/checklist.types';
import { ParameterTypeMap } from '#PrototypeComposer/constants';
import CalculationTaskView from '#PrototypeComposer/Parameters/ExecutionViews/Calculation';
import MaterialInstructionTaskView from '#PrototypeComposer/Parameters/ExecutionViews/MaterialInstruction';
import MediaTaskView from '#PrototypeComposer/Parameters/ExecutionViews/Media';
import ShouldBeTaskView from '#PrototypeComposer/Parameters/ExecutionViews/Parameter';
import ResourceTaskView from '#PrototypeComposer/Parameters/ExecutionViews/Resource';
import SignatureTaskView from '#PrototypeComposer/Parameters/ExecutionViews/Signature';
import SingleLineTaskView from '#PrototypeComposer/Parameters/ExecutionViews/SingleLine';
import SingleSelectTaskView from '#PrototypeComposer/Parameters/ExecutionViews/SingleSelect';
import TextInstructionTaskView from '#PrototypeComposer/Parameters/ExecutionViews/TextInstruction';
import YesNoTaskView from '#PrototypeComposer/Parameters/ExecutionViews/YesNo';
// import MediaView from '.././../../views/Jobs/Modals/ParameterViews/Media';
// remove this
import { useTypedSelector } from '#store/helpers';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DeleteOutlined,
  DragIndicator,
  EditOutlined,
  FilterList,
  VisibilityOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

export const ParameterViewWrapper = styled.div<{ isReadOnly: boolean }>`
  // padding: ${({ isReadOnly }) => (isReadOnly ? '16px 8px' : '16px 8px 16px 0')};

  width: 100%;

  :last-child {
    border-bottom: none;
  }

  :hover {
    .container {
      touch-action: none;
      // background-color: rgba(29, 132, 255, 0.04);
      // border: 1px solid #1d84ff;
      // .draggable {
      //   visibility: visible;
      // }

      // .content {
      //   .actions {
      //     display: flex;
      //   }
      // }
    }
  }

  .container {
    display: flex;
    position: relative;
    border: 1px solid #fff;

    flex-direction: column;

    // &.dragging {
    //   z-index: 1;
    //   transition: none;

    //   * {
    //     cursor: grabbing;
    //   }

    //   box-shadow: -1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25);

    //   &:focus-visible {
    //     box-shadow: 0 0px 10px 2px #4c9ffe;
    //   }
    // }

    // .draggable {
    //   background-color: #1d84ff;
    //   align-items: center;
    //   cursor: pointer;
    //   display: flex;
    //   visibility: hidden;
    //   svg {
    //     color: #fff;
    //     font-size: 16px;
    //   }
    // }

    .content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      padding-block: 16px;

      // padding: 16px 16px 16px 8px;
      // .actions {
      //   position: absolute;
      //   right: 16px;
      //   top: -16px;
      //   height: 32px;
      //   align-items: center;
      //   background: #fff;
      //   border: 1px solid #1d84ff;
      //   color: #1d84ff;
      //   display: none;
      //   @media (max-width: 1200px) {
      //     top: -12px;
      //     height: 24px;
      //   }
      //   svg {
      //     color: inherit;
      //     font-size: 32px;
      //     padding-inline: 4px;
      //     cursor: pointer;
      //     border-right: 1px solid #1d84ff;
      //     :last-of-type {
      //       border-right: none;
      //     }
      //     :hover {
      //       background-color: #1d84ff;
      //       color: #fff;
      //     }
      //     @media (max-width: 1200px) {
      //       font-size: 24px !important;
      //     }
      //   }
      // }
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

const ParameterView: FC<ParameterProps> = ({ parameter, taskId, isReadOnly, form }) => {
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

  const parameterType = listById[parameter.id]?.type;

  const onDelete = () => {
    if (stageId) {
      dispatch(deleteParameter({ parameterId: parameter.id, taskId, stageId }));
    }
  };

  // console.log('zero paramter view', isReadOnly, form);

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
    switch (parameterType || parameter.type) {
      case MandatoryParameter.MEDIA:
        return <MediaTaskView parameter={parameter} form={form} />;

      case MandatoryParameter.CHECKLIST:
      case MandatoryParameter.MULTISELECT:
      case MandatoryParameter.SINGLE_SELECT:
        return <SingleSelectTaskView parameter={parameter} form={form} />;

      case MandatoryParameter.SHOULD_BE:
        return <ShouldBeTaskView parameter={parameter} form={form} />;

      case MandatoryParameter.SIGNATURE:
        return <SignatureTaskView parameter={parameter} form={form} />;

      case MandatoryParameter.NUMBER:
        return (
          <>
            <SingleLineTaskView parameter={parameter} form={form} />
            {parameter.validations?.resourceParameterValidations &&
              renderFiltersValidationsAction(
                'Validations',
                parameter.validations.resourceParameterValidations.length,
              )}
          </>
        );

      case MandatoryParameter.MULTI_LINE:
      case MandatoryParameter.DATE:
      case MandatoryParameter.SINGLE_LINE:
        return <SingleLineTaskView parameter={parameter} form={form} />;

      case MandatoryParameter.YES_NO:
        return <YesNoTaskView parameter={parameter} form={form} />;

      case NonMandatoryParameter.INSTRUCTION:
        return <TextInstructionTaskView parameter={parameter} isReadOnly={isReadOnly} />;

      case NonMandatoryParameter.MATERIAL:
        return <MaterialInstructionTaskView parameter={parameter} isReadOnly={isReadOnly} />;

      case MandatoryParameter.CALCULATION:
        return <CalculationTaskView parameter={parameter} form={form} />;

      case MandatoryParameter.RESOURCE:
        return (
          <>
            <ResourceTaskView parameter={parameter} form={form} />
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
    const titlePreFix = isReadOnly ? 'View' : 'Edit';
    dispatch(
      toggleNewParameter({
        action: 'task',
        title:
          parameter.type in NonMandatoryParameter
            ? `${titlePreFix} Instruction`
            : `${titlePreFix} Process Parameter`,
        parameterId: parameter.id,
        ...(parameter.type in NonMandatoryParameter && {
          type: parameter.type,
        }),
      }),
    );
  };

  return (
    <ParameterViewWrapper isReadOnly={isReadOnly}>
      <div
        ref={setNodeRef}
        style={style}
        className={isDragging ? 'container dragging' : 'container'}
      >
        {/* {!isReadOnly && (
          <div className="draggable" {...attributes} {...listeners}>
            <DragIndicator />
          </div>
        )} */}
        <div className="content">
          {/* <div className="actions">
            {isReadOnly ? (
              <VisibilityOutlined onClick={onViewOrEditParameter} />
            ) : (
              <>
                <EditOutlined onClick={onViewOrEditParameter} />
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
              </>
            )}
          </div> */}
          {ParameterTypeMap[parameter.type]}
          <span className="parameter-label">{parameter.label}</span>
          {renderTaskViewByType()}
        </div>
      </div>
    </ParameterViewWrapper>
  );
};

export default ParameterView;
