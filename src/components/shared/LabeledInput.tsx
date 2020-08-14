import React, { FC, useState } from 'react';
import styled from 'styled-components';

interface LabeledInputProps {
  id: string;
  type?: string;
  label: string;
  refFun?: any;
  placeHolder: string;
  disabled?: boolean;
  icon?: JSX.Element;
  error?: string;
}

const Wrapper = styled.div.attrs({})`
  flex: 1;

  .wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    border-radius: 4px;
    background-color: #f4f4f4;
    opacity: 1;

    label {
      font-size: 8px;
      color: #999999;
      font-weight: 600;
      padding: 4px;
    }

    .input {
      font-size: 16px;
      padding: 4px 8px;
      color: #666666;
      border: none;
      outline: none;
      background-color: transparent;
      ::-webkit-input-placeholder {
        color: #999999;
      }
      :-moz-placeholder {
        color: #999999;
      }
      ::-moz-placeholder {
        color: #999999;
      }
      :-ms-input-placeholder {
        color: #999999;
      }
    }
  }

  .wrapper.active {
    border: none;
    border-bottom: 2px solid #1d84ff;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    opacity: 1;

    label {
      color: #1d84ff;
    }
  }

  .wrapper.error {
    border: none;
    border-bottom: 2px solid #ff6b6b;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    opacity: 1;

    label {
      color: #ff6b6b;
    }
  }

  .wrapper.disabled {
    border: 1px dashed #999999;
    opacity: 0.6;
  }

  .optional-text {
    color: #ff6b6b;
    font-size: 9px;
    text-align: left;
    padding: 3px 0px;
  }

  .icon {
    position: absolute;
    right: 10px;
    top: 25%;
  }
`;

export const LabeledInput: FC<LabeledInputProps> = ({
  label,
  placeHolder,
  disabled,
  refFun,
  id,
  type = 'text',
  icon,
  error,
}) => {
  const [isActive, setIsActive] = useState(false);

  const onFocus = (): void => {
    setIsActive(true);
  };

  const onBlur = (): void => {
    setIsActive(false);
  };

  return (
    <Wrapper>
      <div className="outerwrapper">
        <div
          className={`wrapper ${isActive ? 'active' : ''}
          ${error ? 'error' : ''}
          ${disabled ? 'disabled' : ''}`}
        >
          <label>{label}</label>
          <input
            name={id}
            className="input"
            ref={refFun}
            placeholder={placeHolder}
            onFocus={onFocus}
            data-testid={id}
            onBlur={onBlur}
            type={type}
            autoComplete="off"
            disabled={disabled || false}
          />
          {icon && <div className="icon">{icon}</div>}
        </div>
        {error && <span className="optional-text">{error}</span>}
      </div>
    </Wrapper>
  );
};
