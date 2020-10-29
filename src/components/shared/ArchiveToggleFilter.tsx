import React, { FC, useEffect, useState } from 'react';
import Switch from 'react-switch';
import styled from 'styled-components';

const Wrapper = styled.div.attrs({
  className: 'toggle-switch',
})`
  align-items: center;
  display: flex;
  margin-left: 24px;

  .label {
    color: #000000;
    font-size: 14px;
    margin-left: 8px;
  }
`;

type Props = {
  value?: boolean;
  label?: string;
  offColor?: string;
  offHandleColor?: string;
  onColor?: string;
  onHandleColor?: string;
  showCheckedIcon?: boolean;
  showUncheckedIcon?: boolean;
  updateFilter: (isChecked: boolean) => void;
};

const ArchiveToggle: FC<Props> = ({
  value = false,
  label = 'Show Archive',
  offColor = '#dadada',
  offHandleColor = '#ffffff',
  onColor = '#dadada',
  onHandleColor = '#ffffff',
  showCheckedIcon = false,
  showUncheckedIcon = false,
  updateFilter,
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
      <label className="label">{label}</label>
    </Wrapper>
  );
};

export default ArchiveToggle;
