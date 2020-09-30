import React, { ComponentPropsWithRef, forwardRef, FC } from 'react';
import styled, { css } from 'styled-components';

type OnChangeArgs = {
  name: string;
  value: string | number;
};

type InputProps = {
  error?: boolean | string;
  label?: string;
  optional?: boolean;
  onChange: ({ name, value }: OnChangeArgs) => void;
} & ComponentPropsWithRef<'input'>;

type WrapperProps = {
  hasError: boolean;
};

const Wrapper = styled.div.attrs({
  className: 'input',
})<WrapperProps>`
  display: flex;
  flex-direction: column;

  .input-label {
    color: #161616;
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

  input[type='text'],
  input[type='number'] {
    background-color: #f4f4f4;
    border: 1px solid transparent;
    border-bottom-color: #bababa;
    outline: none;
    padding: 10px 16px;

    :active,
    :focus {
      border-color: #1d84ff;
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
    margin-top: 8px;
  }
`;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    defaultValue = '',
    error = '',
    label,
    name,
    onChange,
    optional = false,
    placeholder = 'Placeholder Text',
    type = 'text',
  } = props;

  return (
    <Wrapper hasError={!!error}>
      {label ? (
        <label className="input-label">
          {label}
          {optional ? <span className="optional-badge">Optional</span> : null}
        </label>
      ) : null}

      <input
        defaultValue={defaultValue}
        name={name}
        onChange={({ target: { name, value } }) => {
          if (typeof onChange === 'function') {
            onChange({ name, value });
          }
        }}
        placeholder={placeholder}
        ref={ref}
        type={type}
      />

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
