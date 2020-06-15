import React, { FC } from 'react';
import styled from 'styled-components';

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onClick: () => void;
}

const Wrapper = styled.div.attrs({
  className: 'checkbox-input',
})`
  .container {
    display: block;
    position: relative;
    padding-left: 35px;
    cursor: pointer;
    font-size: 16px;
    color: #666666;
    user-select: none;
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
    height: 15px;
    width: 15px;
    background-color: #dadada;
    border: 1px solid #bababa;
    border-radius: 50%;
  }

  /* On mouse-over, add a grey background color */
  .container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .container input:checked ~ .checkmark {
    background-color: #12aab3;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: '';
    position: absolute;
    display: block;
  }

  /* Show the checkmark when checked */
  /* .container input:checked ~ .checkmark:after {
    display: block;
  } */

  /* Style the checkmark/indicator */
  .container .checkmark:after {
    left: 5px;
    top: 2px;
    width: 3px;
    height: 7px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

export const Checkbox: FC<CheckboxProps> = ({ label, checked, onClick }) => (
  <Wrapper>
    <label className="container">
      {label}
      <input type="checkbox" checked={checked} onChange={onClick} />
      <span className="checkmark"></span>
    </label>
  </Wrapper>
);