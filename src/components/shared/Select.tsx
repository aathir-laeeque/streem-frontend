import {
  ArrowDropDown,
  ArrowDropUp,
  SvgIconComponent,
} from '@material-ui/icons';
import React, { ComponentPropsWithRef, FC, useState } from 'react';
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
    cursor: pointer;
    display: flex;
    padding: 10px 16px;

    span {
      &.placeholder-text {
        color: #999999;
      }

      &.selected-option {
        color: #000000;
      }
    }

    > .icon {
      margin-left: auto;
    }

    #select-button-icon {
      margin-left: 0;
      margin-right: 12px;
    }
  }

  .option-list {
    background-color: #f4f4f4;
    border: 1px solid #1d84ff;
    border-radius: 4px;
    box-shadow: 1px 2px 8px 0 rgba(29, 132, 255, 0.2);
    display: flex;
    flex-direction: column;
    max-height: 300px;
    overflow: scroll;
    padding: 0 16px;
    position: absolute;
    width: 100%;
    z-index: 99;

    &-item {
      border: 1px solid transparent;
      border-bottom-color: #bababa;
      cursor: pointer;
      padding: 10px 0;
      text-align: start;
    }
  }

  .field-error {
    color: #eb5757;
    margin-top: 8px;
  }
`;

export type Option = { label: string; value: string | number };

type SelectProps = {
  disabled?: boolean;
  error?: boolean | string;
  label?: string;
  onChange?: (option: Option) => void;
  optional?: boolean;
  options: Option[];
  OptionsItemAfterIcon?: SvgIconComponent;
  optionsItemAfterIconClass?: string;
  OptionsItemBeforeIcon?: SvgIconComponent;
  optionsItemBeforeIconClass?: string;
  placeHolder?: string;
  persistValue?: boolean;
  SelectButtonIcon?: SvgIconComponent;
  selectButtonIconClass?: string;
  selectedValue?: Option;
} & ComponentPropsWithRef<'select'>;

const Select: FC<SelectProps> = (props) => {
  const {
    disabled = false,
    error = false,
    label,
    onChange,
    optional = false,
    options,
    OptionsItemAfterIcon,
    optionsItemAfterIconClass,
    OptionsItemBeforeIcon,
    optionsItemBeforeIconClass,
    placeHolder = 'Placeholder Text',
    persistValue = true,
    SelectButtonIcon,
    selectButtonIconClass,
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
        {SelectButtonIcon ? (
          <SelectButtonIcon
            className={`icon ${
              selectButtonIconClass ? selectButtonIconClass : ''
            }`}
            id="select-button-icon"
          />
        ) : null}

        <span
          className={selectedOption ? 'selected-label' : 'placeholder-text'}
        >
          {selectedOption ? selectedOption.label : placeHolder}
        </span>

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
                if (typeof onChange === 'function') {
                  onChange(option);
                }

                if (persistValue) {
                  setSelectedOption(option);
                }

                toggleOpen(!isOpen);
              }}
            >
              {OptionsItemBeforeIcon ? (
                <OptionsItemBeforeIcon
                  className={`icon ${
                    optionsItemBeforeIconClass ? optionsItemBeforeIconClass : ''
                  }`}
                  id="option-list-item-before-icon"
                />
              ) : null}

              <span>{option.label}</span>

              {OptionsItemAfterIcon ? (
                <OptionsItemAfterIcon
                  className={`icon ${
                    optionsItemAfterIconClass ? optionsItemAfterIconClass : ''
                  }`}
                  id="option-list-item-after-icon"
                />
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </Wrapper>
  );
};

export default Select;
