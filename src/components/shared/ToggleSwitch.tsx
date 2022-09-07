import React, { FC } from 'react';
import Switch from 'react-switch';
import styled from 'styled-components';

const Wrapper = styled.div.attrs({
  className: 'toggle-switch',
})`
  align-items: center;
  display: flex;
  margin-left: 24px;
  margin-bottom: 12px;

  .label {
    color: #000000;
    font-size: 14px;
    margin-left: 8px;
  }
`;

type Props = {
  checkedIcon?: false | JSX.Element;
  height?: number;
  offColor?: string;
  offHandleColor?: string;
  offLabel: string;
  onColor?: string;
  onHandleColor?: string;
  onLabel: string;
  onChange: (isChecked: boolean) => void;
  uncheckedIcon?: false | JSX.Element;
  value?: boolean;
  width?: number;
};

const ToggleSwitch: FC<Props> = ({
  checkedIcon = undefined,
  height = 16,
  offColor = '#dadada',
  offHandleColor = '#ffffff',
  offLabel,
  onColor = '#1d84ff',
  onHandleColor = '#ffffff',
  onLabel,
  onChange,
  value = false,
  width = 32,
}) => {
  return (
    <Wrapper>
      <Switch
        activeBoxShadow=""
        checked={value}
        checkedIcon={typeof checkedIcon === 'undefined' ? undefined : checkedIcon}
        handleDiameter={height - 6}
        height={height}
        offColor={offColor}
        offHandleColor={offHandleColor}
        onColor={onColor}
        onHandleColor={onHandleColor}
        onChange={() => {
          onChange(!value);
        }}
        uncheckedIcon={false}
        width={width}
      />
      <label className="label">{value ? onLabel : offLabel}</label>
    </Wrapper>
  );
};

export default ToggleSwitch;
