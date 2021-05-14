import { Error as ErrorIcon, SvgIconComponent } from '@material-ui/icons';
import { noop } from 'lodash';
import React, { ComponentPropsWithRef, forwardRef } from 'react';
import styled, { css } from 'styled-components';

type OnChangeType = {
  name: string;
  value: string | number;
};

type InputProps = {
  AfterElement?: SvgIconComponent;
  afterElementClass?: string;
  afterElementClick?: () => void;
  afterElementWithoutError?: boolean;
  BeforeElement?: SvgIconComponent;
  beforeElementClass?: string;
  beforeElementClick?: () => void;
  error?: boolean | string;
  label?: string;
  optional?: boolean;
  onChange?: ({ name, value }: OnChangeType) => void;
  secondaryAction?: {
    text: string;
    action: () => void;
  };
  disabled?: boolean;
} & ComponentPropsWithRef<'input'>;

type WrapperProps = {
  hasError: boolean;
};

const Wrapper = styled.div.attrs(({ className }) => ({
  className: `input ${className ? className : ''}`,
}))<WrapperProps>`
  display: flex;
  flex: 1;
  flex-direction: column;

  .input-label {
    align-items: center;
    color: #161616;
    display: flex;
    font-size: 14px;
    justify-content: flex-start;
    letter-spacing: 0.16px;
    line-height: 1.29;
    margin-bottom: 8px;

    .optional-badge {
      color: #999999;
      font-size: 12px;
      margin-left: 4px;
    }

    .secondary-action {
      color: #1d84ff;
      cursor: pointer;
      margin-left: auto;
    }
  }

  .input-wrapper {
    align-items: center;
    background-color: #f4f4f4;
    border: 1px solid transparent;
    border-bottom-color: #bababa;
    display: flex;
    flex: 1;
    padding: 10px 16px;

    @media (max-width: 1200px) {
      padding: 8px;
      font-size: 14px;
    }

    :focus-within {
      border-color: #1d84ff;
    }

    > .icon {
      &#before-icon {
        margin-left: 0;
        margin-right: 12px;
      }

      &#after-icon {
        margin-left: 12px;
        margin-right: 0;
      }

      &.error {
        color: #eb5757;
      }
    }

    input {
      background: transparent;
      border: none;
      flex: 1;
      outline: none;
    }

    ${({ hasError }) =>
      hasError
        ? css`
            border-color: #eb5757;
          `
        : null}
  }

  .field-error {
    color: #eb5757;
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
  }
`;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    AfterElement = ErrorIcon,
    afterElementClass = 'error',
    afterElementClick = noop,
    afterElementWithoutError = false,
    BeforeElement,
    beforeElementClass,
    beforeElementClick = noop,
    error = '',
    label,
    // NATIVE HTML INPUT PROPS
    optional = false,
    defaultValue = '',
    disabled = false,
    placeholder = 'Write here',
    type = 'text',
    name,
    onChange,
    className,
    secondaryAction,
    ...rest
  } = props;

  return (
    <Wrapper hasError={!!error} className={className}>
      {label ? (
        <label className="input-label">
          {label}
          {optional ? <span className="optional-badge">Optional</span> : null}
          {secondaryAction && (
            <span className="secondary-action" onClick={secondaryAction.action}>
              {secondaryAction.text}
            </span>
          )}
        </label>
      ) : null}

      <div className="input-wrapper">
        {BeforeElement ? (
          <BeforeElement
            className={`icon ${beforeElementClass ? beforeElementClass : ''}`}
            id="before-icon"
            onClick={beforeElementClick}
          />
        ) : null}

        <input
          {...rest}
          defaultValue={defaultValue}
          name={name}
          onChange={({ target: { name, value } }) => {
            if (typeof onChange === 'function') {
              onChange({ name, value });
            }
          }}
          placeholder={placeholder}
          ref={ref}
          disabled={disabled}
          type={type}
        />

        {afterElementWithoutError ? (
          <AfterElement
            className={`icon ${afterElementClass ? afterElementClass : ''}`}
            id="after-icon"
            onClick={afterElementClick}
          />
        ) : null}

        {error ? (
          <AfterElement
            className={`icon ${afterElementClass ? afterElementClass : ''}`}
            id="after-icon"
            onClick={afterElementClick}
          />
        ) : null}
      </div>

      {typeof error === 'string' && !!error ? (
        <span className="field-error">{error}</span>
      ) : null}
    </Wrapper>
  );
});

Input.displayName = 'Input';

const TextInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <Input type="text" ref={ref} {...props} />
));

TextInput.displayName = 'TextInput';

const NumberInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <Input type="number" ref={ref} {...props} />
));

NumberInput.displayName = 'NumberInput';

export { Input, TextInput, NumberInput };
