import React, {
  ComponentPropsWithRef,
  createRef,
  forwardRef,
  useState,
  useEffect,
  ChangeEvent,
} from 'react';
import styled, { css } from 'styled-components';

type OnChangeArgs = {
  name: string;
  value: string | number;
};

type TextareaProps = {
  allowResize?: boolean;
  error?: boolean | string;
  label?: string;
  onChange?: ({ name, value }: OnChangeArgs) => void;
  optional?: boolean;
} & ComponentPropsWithRef<'textarea'>;

type WrapperProps = {
  allowResize: boolean;
  hasError: boolean;
  parentHeight: string;
  textAreaHeight: string;
};

const Wrapper = styled.div.attrs(({ className }) => ({
  className: `textarea ${className ? className : ''}`,
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
  }

  .textarea-wrapper {
    ${({ parentHeight }) =>
      parentHeight
        ? css`
            height: ${parentHeight};
          `
        : null}

    textarea {
      background-color: #f4f4f4;
      border: 1px solid transparent;
      border-bottom-color: #bababa;
      color: #000000;
      outline: none;
      overflow: hidden;
      padding: 16px;
      width: 100%;

      :disabled {
        background-color: #fafafa;
        border-color: transparent;
        color: #999999;
        resize: none;
      }

      :active,
      :focus {
        border-color: #1d84ff;
      }

      :-webkit-input-placeholder {
        text-align: center;
        line-height: 74px;
        color: #a8a8a8;
      }

      :-moz-placeholder {
        text-align: center;
        line-height: 74px;
        color: #a8a8a8;
      }

      :-moz-placeholder {
        text-align: center;
        line-height: 74px;
        color: #a8a8a8;
      }

      :-ms-input-placeholder {
        text-align: center;
        line-height: 74px;
        color: #a8a8a8;
      }

      ${({ textAreaHeight }) =>
        textAreaHeight
          ? css`
              height: ${textAreaHeight};
            `
          : null}

      ${({ hasError }) =>
        hasError
          ? css`
              border-color: #eb5757;
            `
          : null}

        ${({ allowResize }) =>
        !allowResize
          ? css`
              resize: none;
            `
          : null}
    }
  }

  .field-error {
    color: #eb5757;
    margin-top: 8px;
  }
`;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const {
      allowResize = true,
      defaultValue,
      disabled = false,
      error,
      label,
      name,
      onChange,
      optional = false,
      placeholder = 'Write here',
      rows = 1,
    } = props;

    const internalRef = createRef<HTMLTextAreaElement>();

    const [text, setText] = useState(defaultValue);
    const [textAreaHeight, setTextAreaHeight] = useState('auto');
    const [parentHeight, setParentHeight] = useState('auto');

    useEffect(() => {
      setParentHeight(`${internalRef.current?.scrollHeight}px`);
      setTextAreaHeight(`${internalRef.current?.scrollHeight}px`);
    }, [text]);

    const onChangeHandler = ({
      target: { name, value },
    }: ChangeEvent<HTMLTextAreaElement>) => {
      setTextAreaHeight('auto');
      setParentHeight(`${internalRef.current?.scrollHeight}px`);
      setText(value);

      if (typeof onChange === 'function') {
        onChange({ name, value });
      }
    };

    return (
      <Wrapper
        allowResize={allowResize}
        hasError={!!error}
        parentHeight={parentHeight}
        textAreaHeight={textAreaHeight}
      >
        {label ? (
          <label className="input-label">
            {label}
            {optional ? <span className="optional-badge">Optional</span> : null}
          </label>
        ) : null}

        <div className="textarea-wrapper">
          <textarea
            defaultValue={defaultValue}
            disabled={disabled}
            name={name}
            onChange={onChangeHandler}
            placeholder={placeholder}
            ref={ref ?? internalRef}
            rows={rows}
          />
        </div>

        {typeof error === 'string' && !!error ? (
          <span className="field-error">{error}</span>
        ) : null}
      </Wrapper>
    );
  },
);

Textarea.displayName = 'textarea';

export default Textarea;