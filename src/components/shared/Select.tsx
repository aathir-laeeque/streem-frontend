import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div.attrs({
  className: 'select',
})`
  position: relative;

  .select-label {
    color: #161616;
    display: block;
    font-size: 14px;
    letter-spacing: 0.16px;
    line-height: 1.29;
    margin-bottom: 8px;

    .optional-badge {
      color: #999999;
      font-size: 12px;
      margin-left: 4px;
    }
  }

  .button {
    align-items: center;
    background-color: #f4f4f4;
    border: 1px solid transparent;
    border-bottom-color: #bababa;
    display: flex;
    padding: 10px 16px;

    > .icon {
      margin-left: auto;
    }
  }

  .option-list {
    background-color: #f4f4f4;
    border: 1px solid #1d84ff;
    border-radius: 4px;
    box-shadow: 1px 2px 8px 0 rgba(29, 132, 255, 0.2);
    display: flex;
    flex-direction: column;
    padding: 0 16px;
    position: absolute;
    width: 100%;
    z-index: 99;

    &-item {
      border: 1px solid transparent;
      border-bottom-color: #bababa;
      padding: 10px 0;
    }
  }

  .field-error {
    color: #eb5757;
    margin-top: 8px;
  }
`;

type Option = { label: string; value: string };

type SelectProps = {
  disabled?: boolean;
  error?: boolean | string;
  label?: string;
  onChange: (option: any) => void;
  optional?: boolean;
  options: any[];
  placeHolder?: string;
  persistValue?: boolean;
  selectedValue?: Option;
};

const Select: FC<SelectProps> = (props) => {
  const {
    disabled = false,
    error = false,
    label,
    onChange,
    optional = false,
    options,
    placeHolder = 'Placeholder Text',
    persistValue = true,
    selectedValue,
  } = props;

  const [isOpen, toggleOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    selectedValue,
  );

  return (
    <Wrapper>
      {label ? (
        <label className="select-label">
          {label}
          {optional ? <span className="optional-badge">Optional</span> : null}
        </label>
      ) : null}

      <div
        className="button"
        onClick={() => {
          if (!disabled) {
            toggleOpen(!isOpen);
          }
        }}
      >
        {selectedOption ? selectedOption.label : placeHolder}

        {isOpen ? (
          <ArrowDropUp className="icon" />
        ) : (
          <ArrowDropDown className="icon" />
        )}
      </div>

      {typeof error === 'string' && !!error ? (
        <span className="field-error">{error}</span>
      ) : null}

      {isOpen ? (
        <div className="option-list">
          {options.map((option, index) => (
            <div
              className="option-list-item"
              key={index}
              onClick={() => {
                onChange(option);
                if (persistValue) {
                  setSelectedOption(option);
                }
                toggleOpen(!isOpen);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      ) : null}
    </Wrapper>
  );
};

export default Select;
