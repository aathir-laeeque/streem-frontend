import React, {
  ComponentPropsWithRef,
  createRef,
  forwardRef,
  useState,
  useEffect,
  ChangeEvent,
} from 'react';
import { Error as ErrorIcon } from '@material-ui/icons';
import styled, { css } from 'styled-components';

type OnChangeType = {
  name: string;
  value: string | number;
};

type TextareaProps = {
  activityItemInput?: boolean;
  allowResize?: boolean;
  error?: boolean | string;
  label?: string;
  onChange?: ({ name, value }: OnChangeType) => void;
  optional?: boolean;
  onBlur?: ({ name, value }: OnChangeType) => void;
} & ComponentPropsWithRef<'textarea'>;

type WrapperProps = {
  activityItemInput: boolean;
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

      @media (max-width: 1200px) {
        padding: 8px;
        font-size: 14px;
      }

      :disabled {
        background-color: #fafafa;
        border-color: transparent;
        color: #999999;
        resize: none;
      }

      ${({ activityItemInput }) =>
        !activityItemInput
          ? css`
              :active,
              :focus {
                border-color: #1d84ff;
              }
            `
          : css`
              border-bottom-color: transparent;
            `}

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
    align-items: center;
    color: #eb5757;
    display: flex;
    font-size: 12px;
    justify-content: flex-start;
    margin-top: 8px;

    .icon {
      font-size: 16px;
      color: #eb5757;
      margin-right: 5px;
    }
  }
`;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const {
      activityItemInput = false,
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
      onBlur,
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

    const onBlurHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (typeof onBlur === 'function') {
        console.log(e);
      }
    };

    return (
      <Wrapper
        activityItemInput={activityItemInput}
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
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            placeholder={placeholder}
            ref={ref ?? internalRef}
            rows={rows}
          />
        </div>

        {typeof error === 'string' && !!error ? (
          <span className="field-error">
            <ErrorIcon className="icon" />
            {error}
          </span>
        ) : null}
      </Wrapper>
    );
  },
);

Textarea.displayName = 'textarea';

export default Textarea;
