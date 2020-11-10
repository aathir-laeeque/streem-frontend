import React, { FC, useEffect, useState } from 'react';
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
  offColor?: string;
  offHandleColor?: string;
  offLabel: string;
  onColor?: string;
  onHandleColor?: string;
  onLabel: string;
  showCheckedIcon?: boolean;
  showUncheckedIcon?: boolean;
  updateFilter: (isChecked: boolean) => void;
  value?: boolean;
};

const ToggleSwitch: FC<Props> = ({
  offColor = '#dadada',
  offHandleColor = '#ffffff',
  offLabel,
  onColor = '#1d84ff',
  onHandleColor = '#ffffff',
  onLabel,
  showCheckedIcon = false,
  showUncheckedIcon = false,
  updateFilter,
  value = false,
}) => {
  const [isChecked, toggleIsChecked] = useState(value);

  return (
    <Wrapper>
      <Switch
        activeBoxShadow=""
        checked={isChecked}
        checkedIcon={showCheckedIcon}
        height={16}
        offColor={offColor}
        offHandleColor={offHandleColor}
        onColor={onColor}
        onHandleColor={onHandleColor}
        onChange={() => {
          toggleIsChecked((val) => !val);
          updateFilter(!isChecked);
        }}
        uncheckedIcon={showUncheckedIcon}
        width={32}
      />
      <label className="label">{value ? onLabel : offLabel}</label>
    </Wrapper>
  );
};

export default ToggleSwitch;
