import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { MandatoryParameter, NonMandatoryParameter } from '#PrototypeComposer/checklist.types';
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
import { useTypedSelector } from '#store/helpers';
import React, { FC, useEffect } from 'react';
import styled from 'styled-components';

export const ParameterViewWrapper = styled.div`
  width: 100%;

  :last-child {
    border-bottom: none;
  }

  :hover {
    .container {
      touch-action: none;
    }
  }

  .container {
    display: flex;
    position: relative;
    border: 1px solid #fff;

    flex-direction: column;

    .content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;

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
        color: #525252;
        &-optional {
          color: #999999;
          font-size: 12px;
          margin-left: 4px;
        }
      }

      .form-group {
        padding: 0;
        margin-bottom: 0px;
        > div {
          margin-bottom: 0px;
        }
      }
    }
  }
`;

const ParameterView: FC<ParameterProps> = ({
  parameter,
  form,
  onChangeHandler,
  selectedObject,
}) => {
  const {
    parameters: { listById },
  } = useTypedSelector((state) => state.prototypeComposer);

  const parameterType = listById[parameter.id]?.type;

  const { register, unregister, setValue } = form;

  useEffect(() => {
    register(parameter.id, {
      required: parameter.mandatory,
    });
    setValue(parameter.id, parameter);
    return () => {
      unregister(parameter.id);
    };
  }, []);

  const renderTaskViewByType = () => {
    switch (parameterType || parameter.type) {
      case MandatoryParameter.MEDIA:
        return <MediaTaskView parameter={parameter} form={form} />;

      case MandatoryParameter.CHECKLIST:
      case MandatoryParameter.MULTISELECT:
      case MandatoryParameter.SINGLE_SELECT:
        return (
          <SingleSelectTaskView
            parameter={parameter}
            form={form}
            onChangeHandler={onChangeHandler}
          />
        );

      case MandatoryParameter.SHOULD_BE:
        return <ShouldBeTaskView parameter={parameter} form={form} />;

      case MandatoryParameter.SIGNATURE:
        return <SignatureTaskView parameter={parameter} form={form} />;

      case MandatoryParameter.NUMBER:
      case MandatoryParameter.MULTI_LINE:
      case MandatoryParameter.DATE:
      case MandatoryParameter.SINGLE_LINE:
      case MandatoryParameter.DATE_TIME:
        return <SingleLineTaskView parameter={parameter} form={form} />;

      case MandatoryParameter.YES_NO:
        return <YesNoTaskView parameter={parameter} form={form} />;

      case NonMandatoryParameter.INSTRUCTION:
        return <TextInstructionTaskView parameter={parameter} />;

      case NonMandatoryParameter.MATERIAL:
        return <MaterialInstructionTaskView parameter={parameter} />;

      case MandatoryParameter.CALCULATION:
        return <CalculationTaskView parameter={parameter} form={form} />;

      case MandatoryParameter.RESOURCE:
      case MandatoryParameter.MULTI_RESOURCE:
        return (
          <ResourceTaskView
            parameter={parameter}
            form={form}
            selectedObject={selectedObject}
            onChangeHandler={onChangeHandler}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ParameterViewWrapper>
      <div className="container">
        <div className="content">
          <div className="parameter-label">
            {parameter.label}
            {!parameter.mandatory && <span className="parameter-label-optional">optional</span>}
          </div>
          {renderTaskViewByType()}
        </div>
      </div>
    </ParameterViewWrapper>
  );
};

export default ParameterView;
