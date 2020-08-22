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
  required?: boolean;
  onFocusInput?: () => void;
}

const Wrapper = styled.div.attrs({})`
  flex: 1;

  .wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    opacity: 1;
    background-color: #fff;
    border-bottom: 1px solid #999999;
    border-radius: 0px;

    > label {
      position: absolute;
      top: -13px;
      color: #999999;
      left: 4px;
      font-size: 16px;
      transition: all 0.2s linear;
      opacity: 0;
    }

    > label.on {
      font-size: 9px;
      opacity: 1;
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
    border: none;
    border-bottom: 1px dashed #999999;
    opacity: 0.4;
  }

  .optional-text {
    color: #666666;
    font-size: 9px;
    text-align: left;
    padding: 3px 0px;
  }

  .optional-text.error {
    color: #ff6b6b;
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
  required = true,
  onFocusInput,
}) => {
  const [state, setState] = useState({
    isActive: false,
    placeHolderText: label,
    className: disabled ? 'on' : '',
  });

  const onFocus = (): void => {
    if (onFocusInput) onFocusInput();
    setState({
      isActive: true,
      placeHolderText: placeHolder,
      className: 'on',
    });
  };

  const onBlur = (): void => {
    setState({
      ...state,
      isActive: false,
      placeHolderText: '',
    });
  };

  return (
    <Wrapper>
      <div className="outerwrapper">
        <div
          className={`wrapper ${state.isActive ? 'active' : ''}
          ${error ? 'error' : ''}
          ${disabled ? 'disabled' : ''}`}
        >
          <label className={state.className}>{label}</label>
          <input
            name={id}
            id={id}
            className="input"
            ref={refFun}
            placeholder={
              state.placeHolderText ? state.placeHolderText : placeHolder
            }
            onFocus={onFocus}
            data-testid={id}
            onBlur={onBlur}
            type={type}
            autoComplete="off"
            disabled={disabled || false}
          />
          {icon && <div className="icon">{icon}</div>}
        </div>
        {error && <span className="optional-text error">{error}</span>}
        {!required && <span className="optional-text">Optional</span>}
      </div>
    </Wrapper>
  );
};
