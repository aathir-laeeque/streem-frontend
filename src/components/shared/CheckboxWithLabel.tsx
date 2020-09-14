import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  /* The container */
  .container {
    position: relative;
    padding-left: 35px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    text-decoration: ${({ isChecked }) =>
      isChecked ? 'line-through' : 'none'};
    font-size: 14px;
  }

  /* Hide the browser's default checkbox */
  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 16px;
    width: 16px;
    border: 1px solid #000000;
  }

  /* On mouse-over, add a grey background color */
  .container:hover input ~ .checkmark {
    background-color: #ffffff;
  }

  /* When the checkbox is checked, add a blue background */
  .container input:checked ~ .checkmark {
    background-color: #1d84ff;
    border: none;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .container input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .container .checkmark:after {
    left: 5px;
    top: 1px;
    width: 3px;
    height: 8px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

interface CheckboxProps {
  label?: string;
  isChecked?: boolean;
}

const Checkbox: FC<CheckboxProps> = ({ label, isChecked = false }) => (
  <Wrapper isChecked={isChecked}>
    <label className="container">
      {label}
      <input type="checkbox" checked={isChecked} readOnly />
      <span className="checkmark"></span>
    </label>
  </Wrapper>
);

export default Checkbox;
