import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  flex: 1;
  padding: 10px;
  padding-left: 0;
  border-bottom: 1px solid #8d8d8d;

  label {
    align-items: center;
    display: flex;
    flex: 1;

    input {
      background: transparent;
    }

    input[type='text'] {
      border: none;
      flex: 1;
      margin-left: 10px;
      outline: none;
    }
  }
`;

interface CheckboxProps {
  label?: string;
  isChecked?: boolean;
  handleCheckboxChange?: () => void;
  handleLabelChange?: (label: string) => void;
  disabled?: boolean;
}

const Checkbox: FC<CheckboxProps> = ({
  label,
  isChecked,
  handleCheckboxChange,
  handleLabelChange,
  disabled,
}) => (
  <Wrapper>
    <label>
      <input
        type="checkbox"
        value={label}
        checked={isChecked}
        disabled={disabled}
        onChange={() => handleCheckboxChange && handleCheckboxChange()}
      />

      {label !== undefined && (
        <input
          name="item-label"
          type="text"
          value={label}
          disabled={disabled}
          onChange={(e) =>
            handleLabelChange && handleLabelChange(e.target.value)
          }
          placeholder="Type Here..."
        />
      )}
    </label>
  </Wrapper>
);

Checkbox.defaultProps = {
  isChecked: false,
  disabled: false,
};

export default Checkbox;
