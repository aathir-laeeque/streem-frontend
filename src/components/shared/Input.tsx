import { InputTypes } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { Error as ErrorIcon, SvgIconComponent } from '@material-ui/icons';
import { getUnixTime, parseISO, set } from 'date-fns';
import { noop } from 'lodash';
import React, { ComponentPropsWithRef, forwardRef, useMemo } from 'react';
import styled, { css } from 'styled-components';
import InfoIcon from '#assets/svg/info-icon.svg';
import { withStyles } from '@material-ui/styles';
import { Tooltip } from '@material-ui/core';

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
  error?: boolean | string | null;
  label?: string;
  optional?: boolean;
  onChange?: ({ name, value }: OnChangeType) => void;
  secondaryAction?: {
    text: string;
    action: () => void;
  };
  disabled?: boolean;
  description?: string;
  type?: InputTypes;
  tooltipLabel?: string;
} & Omit<ComponentPropsWithRef<'input'>, 'onChange' | 'type'>;

type WrapperProps = {
  hasError: boolean;
};

const CustomTooltip = withStyles({
  tooltip: {
    width: '205px',
    backgroundColor: '#393939',
    borderRadius: '0px',
    color: '#fff',
    textAlign: 'center',
    fontSize: '14px',
  },
  arrow: {
    color: '#393939',
  },
})(Tooltip);

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex: 1;
  flex-direction: column;

  .label-wrapper {
    display: flex;

    .input-label {
      align-items: center;
      color: #525252;
      display: flex;
      font-size: 12px;
      justify-content: flex-start;
      letter-spacing: 0.32px;
      line-height: 1.33;
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

    .info-icon-wrapper {
      height: 16px;
      width: 16px;
      margin-left: 6px;
    }
  }

  .input-wrapper {
    align-items: center;
    background-color: #fff;
    border: 1px solid #ccc;
    display: flex;
    flex: 1;
    padding: 8px 16px;

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
      padding: 0;
      line-height: 1;

      :disabled {
        color: hsl(0, 0%, 20%);
      }
    }

    ${({ hasError }) =>
      hasError
        ? css`
            border-color: #eb5757;
          `
        : null}
  }

  .field-error {
    font-size: 12px;
    color: #eb5757;
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
  }

  .description {
    font-size: 12px;
    line-height: 1.33;
    letter-spacing: 0.32px;
    color: #6f6f6f;
    margin-top: 8px;
  }
`;

const TextInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
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
    key,
    // NATIVE HTML INPUT PROPS
    optional = false,
    defaultValue = '',
    disabled = false,
    placeholder = 'Write here',
    type = InputTypes.SINGLE_LINE,
    name,
    onChange,
    className,
    secondaryAction,
    description = '',
    tooltipLabel,
    ...rest
  } = props;

  const formatByType =
    type === InputTypes.DATE
      ? 'yyyy-MM-dd'
      : type === InputTypes.TIME
      ? 'HH:mm'
      : 'yyyy-MM-dd HH:mm';

  const onChangeHandler = ({ target }: any) => {
    let { name, value } = target;
    if (
      [InputTypes.DATE, InputTypes.TIME, InputTypes.DATE_TIME].includes(
        type as unknown as InputTypes,
      )
    ) {
      if (InputTypes.TIME === type) {
        const [hours, minutes] = value.split(':');
        value = hours && minutes ? getUnixTime(set(new Date(), { hours, minutes })).toString() : '';
      } else {
        value = value ? getUnixTime(parseISO(value)).toString() : '';
      }
    }
    if (typeof onChange === 'function') {
      onChange({ name, value });
    }
  };

  const propsByType = useMemo(() => {
    const isDateOrTime = [InputTypes.DATE, InputTypes.TIME, InputTypes.DATE_TIME].includes(type);
    const valueKey = rest.value ? 'value' : defaultValue ? 'defaultValue' : null;
    return {
      type:
        type === InputTypes.SINGLE_LINE
          ? 'text'
          : type === InputTypes.DATE_TIME
          ? 'datetime-local'
          : type.toLowerCase(),
      ...(isDateOrTime && {
        max: type === InputTypes.DATE_TIME ? '2999-12-31T00:00' : '2999-12-31',
      }),
      ...(valueKey && {
        [valueKey]: isDateOrTime
          ? formatDateTime({ value: (rest.value || defaultValue) as number, format: formatByType })
          : rest.value || defaultValue,
      }),
      ...(type === InputTypes.NUMBER && {
        step: 'any',
      }),
    };
  }, [type, rest.value]);

  return (
    <Wrapper
      hasError={!!error}
      className={`input ${className ? className : ''}`}
      key={key}
      onWheel={(e) => (e.target as HTMLInputElement).blur()}
    >
      <div className="label-wrapper">
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
        {tooltipLabel && (
          <span className="info-icon-wrapper">
            <CustomTooltip title={tooltipLabel} arrow placement="right">
              <img src={InfoIcon}></img>
            </CustomTooltip>
          </span>
        )}
      </div>

      <div className="input-wrapper">
        {BeforeElement ? (
          <BeforeElement
            className={`icon ${beforeElementClass ? beforeElementClass : ''}`}
            id="before-icon"
            data-testid="input-element-before-icon"
            onClick={beforeElementClick}
          />
        ) : null}

        <input
          data-testid="input-element"
          {...rest}
          name={name}
          onChange={onChangeHandler}
          placeholder={placeholder}
          ref={ref}
          disabled={disabled}
          {...propsByType}
        />

        {afterElementWithoutError ? (
          <AfterElement
            className={`icon ${afterElementClass ? afterElementClass : ''}`}
            id="after-icon"
            data-testid="input-element-after-icon"
            onClick={afterElementClick}
          />
        ) : null}

        {error ? (
          <AfterElement
            className={`icon ${afterElementClass ? afterElementClass : ''}`}
            id="after-icon"
            data-testid="input-element-error-icon"
            onClick={afterElementClick}
          />
        ) : null}
      </div>
      {description && <span className="description">{description}</span>}
      {typeof error === 'string' && !!error ? <span className="field-error">{error}</span> : null}
    </Wrapper>
  );
});

export { TextInput };
