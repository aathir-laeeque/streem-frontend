import {
  CameraAltOutlined,
  DateRangeOutlined,
  DoneAllOutlined,
  EventNoteOutlined,
  ExposureOutlined,
  Filter1Outlined,
  FunctionsOutlined,
  GestureOutlined,
  LayersOutlined,
  LineStyle,
  ShortTextOutlined,
  SubjectOutlined,
  TonalityOutlined,
} from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';
import { MandatoryParameter, NonMandatoryParameter, TargetEntityType } from './checklist.types';

export const ParameterIconByType = {
  [MandatoryParameter.CHECKLIST]: <LineStyle />,
  [NonMandatoryParameter.INSTRUCTION]: <LineStyle />,
  [NonMandatoryParameter.MATERIAL]: <LineStyle />,
  [MandatoryParameter.MEDIA]: <CameraAltOutlined />,
  [MandatoryParameter.MULTISELECT]: <DoneAllOutlined />,
  [MandatoryParameter.SHOULD_BE]: <ExposureOutlined />,
  [MandatoryParameter.SIGNATURE]: <GestureOutlined />,
  [MandatoryParameter.SINGLE_SELECT]: <DoneAllOutlined />,
  [MandatoryParameter.SINGLE_LINE]: <ShortTextOutlined />,
  [MandatoryParameter.MULTI_LINE]: <SubjectOutlined />,
  [MandatoryParameter.YES_NO]: <TonalityOutlined />,
  [MandatoryParameter.NUMBER]: <Filter1Outlined />,
  [MandatoryParameter.CALCULATION]: <FunctionsOutlined />,
  [MandatoryParameter.DATE]: <DateRangeOutlined />,
  [MandatoryParameter.DATE_TIME]: <EventNoteOutlined />,
  [MandatoryParameter.RESOURCE]: <LayersOutlined />,
};

const ParameterLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #525252;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.32px;

  .parameter-icon {
    background-color: #4589ff;
    border-radius: 50%;
    margin-right: 8px;
    display: flex;
    padding: 4px;
    svg {
      color: #fff;
      height: 16px;
      width: 16px;
      margin: unset;
      &:hover {
        color: #fff;
      }
    }
  }
`;

const RenderParameterLabel: React.FC<{ label: string; icon: JSX.Element }> = ({ label, icon }) => {
  return (
    <ParameterLabelWrapper>
      <div className="parameter-icon">{icon}</div>
      {label}
    </ParameterLabelWrapper>
  );
};

export const ParameterTypeMap: Record<string, JSX.Element | string> = {
  [MandatoryParameter.CHECKLIST]: (
    <RenderParameterLabel
      label="Subtasks"
      icon={ParameterIconByType[MandatoryParameter.CHECKLIST]}
    />
  ),
  [NonMandatoryParameter.INSTRUCTION]: (
    <RenderParameterLabel
      label="Instruction"
      icon={ParameterIconByType[NonMandatoryParameter.INSTRUCTION]}
    />
  ),
  [NonMandatoryParameter.MATERIAL]: (
    <RenderParameterLabel
      label="Material"
      icon={ParameterIconByType[NonMandatoryParameter.MATERIAL]}
    />
  ),
  [MandatoryParameter.MEDIA]: (
    <RenderParameterLabel
      label="Image Capture"
      icon={ParameterIconByType[MandatoryParameter.MEDIA]}
    />
  ),
  [MandatoryParameter.MULTISELECT]: (
    <RenderParameterLabel
      label="Multi-select dropdown"
      icon={ParameterIconByType[MandatoryParameter.MULTISELECT]}
    />
  ),
  [MandatoryParameter.SHOULD_BE]: (
    <RenderParameterLabel
      label="Should Be"
      icon={ParameterIconByType[MandatoryParameter.SHOULD_BE]}
    />
  ),
  [MandatoryParameter.SIGNATURE]: (
    <RenderParameterLabel
      label="Signature"
      icon={ParameterIconByType[MandatoryParameter.SIGNATURE]}
    />
  ),
  [MandatoryParameter.SINGLE_SELECT]: (
    <RenderParameterLabel
      label="Single-select dropdown"
      icon={ParameterIconByType[MandatoryParameter.SINGLE_SELECT]}
    />
  ),
  [MandatoryParameter.SINGLE_LINE]: (
    <RenderParameterLabel
      label="Single-line text"
      icon={ParameterIconByType[MandatoryParameter.SINGLE_LINE]}
    />
  ),
  [MandatoryParameter.MULTI_LINE]: (
    <RenderParameterLabel
      label="Multi-line text"
      icon={ParameterIconByType[MandatoryParameter.MULTI_LINE]}
    />
  ),
  [MandatoryParameter.YES_NO]: (
    <RenderParameterLabel label="Yes/No" icon={ParameterIconByType[MandatoryParameter.YES_NO]} />
  ),
  [MandatoryParameter.NUMBER]: (
    <RenderParameterLabel label="Number" icon={ParameterIconByType[MandatoryParameter.NUMBER]} />
  ),
  [MandatoryParameter.CALCULATION]: (
    <RenderParameterLabel
      label="Calculation"
      icon={ParameterIconByType[MandatoryParameter.CALCULATION]}
    />
  ),
  [MandatoryParameter.DATE]: (
    <RenderParameterLabel label="Date" icon={ParameterIconByType[MandatoryParameter.DATE]} />
  ),
  [MandatoryParameter.DATE_TIME]: (
    <RenderParameterLabel
      label="Date-Time"
      icon={ParameterIconByType[MandatoryParameter.DATE_TIME]}
    />
  ),
  [MandatoryParameter.RESOURCE]: (
    <RenderParameterLabel
      label="Resource"
      icon={ParameterIconByType[MandatoryParameter.RESOURCE]}
    />
  ),
};

export const PARAMETER_OPERATORS = [
  { label: '( = ) Equal to', value: 'EQUAL_TO' },
  { label: '( < ) Less than', value: 'LESS_THAN' },
  { label: '( <= ) Less than equal to', value: 'LESS_THAN_EQUAL_TO' },
  { label: '( > ) More than', value: 'MORE_THAN' },
  { label: '( >= ) More than equal to', value: 'MORE_THAN_EQUAL_TO' },
  { label: '( <-> ) Between', value: 'BETWEEN' },
];

export const TargetEntityTypeVisual = {
  [TargetEntityType.TASK]: 'Task',
  [TargetEntityType.PROCESS]: 'Create Job Form',
  [TargetEntityType.UNMAPPED]: 'Unmapped',
};
