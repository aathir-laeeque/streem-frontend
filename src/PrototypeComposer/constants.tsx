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
    color: #fff;
    margin-right: 8px;
    display: flex;
    padding: 4px;

    svg {
      font-size: 16px;
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
  [MandatoryParameter.CHECKLIST]: <RenderParameterLabel label="Subtasks" icon={<LineStyle />} />,
  [NonMandatoryParameter.INSTRUCTION]: (
    <RenderParameterLabel label="Instruction" icon={<LineStyle />} />
  ),
  [NonMandatoryParameter.MATERIAL]: <RenderParameterLabel label="Material" icon={<LineStyle />} />,
  [MandatoryParameter.MEDIA]: (
    <RenderParameterLabel label="Image Capture" icon={<CameraAltOutlined />} />
  ),
  [MandatoryParameter.MULTISELECT]: (
    <RenderParameterLabel label="Multi-select dropdown" icon={<DoneAllOutlined />} />
  ),
  [MandatoryParameter.SHOULD_BE]: (
    <RenderParameterLabel label="Should Be" icon={<ExposureOutlined />} />
  ),
  [MandatoryParameter.SIGNATURE]: (
    <RenderParameterLabel label="Signature" icon={<GestureOutlined />} />
  ),
  [MandatoryParameter.SINGLE_SELECT]: (
    <RenderParameterLabel label="Single-select dropdown" icon={<DoneAllOutlined />} />
  ),
  [MandatoryParameter.SINGLE_LINE]: (
    <RenderParameterLabel label="Single-line text" icon={<ShortTextOutlined />} />
  ),
  [MandatoryParameter.MULTI_LINE]: (
    <RenderParameterLabel label="Multi-line text" icon={<SubjectOutlined />} />
  ),
  [MandatoryParameter.YES_NO]: <RenderParameterLabel label="Yes/No" icon={<TonalityOutlined />} />,
  [MandatoryParameter.NUMBER]: <RenderParameterLabel label="Number" icon={<Filter1Outlined />} />,
  [MandatoryParameter.CALCULATION]: (
    <RenderParameterLabel label="Calculation" icon={<FunctionsOutlined />} />
  ),
  [MandatoryParameter.DATE]: <RenderParameterLabel label="Date" icon={<DateRangeOutlined />} />,
  [MandatoryParameter.DATE_TIME]: (
    <RenderParameterLabel label="Date-Time" icon={<EventNoteOutlined />} />
  ),
  [MandatoryParameter.RESOURCE]: (
    <RenderParameterLabel label="Resource" icon={<LayersOutlined />} />
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
