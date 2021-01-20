import { SvgIconComponent, Error } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { ComponentPropsWithRef, forwardRef } from 'react';
import styled from 'styled-components';

import Textarea from './Textarea';

type Props = ComponentPropsWithRef<'textarea'> & {
  Icon?: SvgIconComponent;
  error?: string | boolean;
  label?: string;
  optional?: boolean;
  customOnChange: (value: string) => void;
};

const Wrapper = styled.div.attrs(({ className }) => ({
  className: `input ${className ? className : ''}`,
}))<Props>`
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

  .input-wrapper {
    background-color: #f4f4f4;
    border: 1px solid transparent;
    border-bottom-color: #bababa;

    display: flex;

    flex: 1;

    :focus-within {
      border-color: #1d84ff;
    }

    .icon {
      color: #000000;

      margin-top: 14px;
      margin-left: 14px;
    }
  }

  .field-error {
    align-items: center;
    color: #eb5757;
    display: flex;
    font-size: 14px;
    justify-content: flex-start;
    margin-top: 8px;

    .icon.error {
      color: #eb5757;
      font-size: 16px;
      margin-right: 8px;
    }
  }
`;

// NOTE: THIS IS A TEXTAREA ONLY. DONT CHANGE TEXTAREA TO ANY THING ELSE.
const ActivityItemInput = forwardRef<HTMLTextAreaElement, Props>(
  (props, ref) => {
    const {
      Icon,
      customOnChange,
      defaultValue = '',
      disabled = false,
      error,
      label,
      name,
      optional = false,
      placeholder = 'Write here',
      rows = 1,
    } = props;

    return (
      <Wrapper>
        {label ? (
          <label className="input-label">
            {label}
            {optional ? <span className="optional-badge">Optional</span> : null}
          </label>
        ) : null}

        <div className="input-wrapper">
          {Icon ? <Icon className="icon activity-input-item" /> : null}

          <Textarea
            activityItemInput
            defaultValue={defaultValue}
            disabled={disabled}
            name={name}
            onChange={debounce(({ value }) => {
              customOnChange(value as string);
            }, 500)}
            placeholder={placeholder}
            ref={ref}
            rows={rows}
          />
        </div>

        {typeof error === 'string' && !!error ? (
          <span className="field-error">
            <Error className="icon error" />
            {error}
          </span>
        ) : null}
      </Wrapper>
    );
  },
);

ActivityItemInput.displayName = 'activity-item-input';

export default ActivityItemInput;
