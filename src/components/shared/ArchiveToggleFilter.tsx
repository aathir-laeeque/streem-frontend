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
  value?: boolean;
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
  offColor = '#dadada',
  offHandleColor = '#ffffff',
  onColor = '#1d84ff',
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
      <label className="label">
        {value ? 'Showing Archived' : 'Show Archived'}
      </label>
    </Wrapper>
  );
};

export default ArchiveToggle;
