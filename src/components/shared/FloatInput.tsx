import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { capitalize } from 'lodash';

interface FloatInputProps {
  id: string;
  label: string;
  value?: string;
  placeHolder: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (id: string, value: string) => void;
}

const Wrapper = styled.div.attrs({})`
  .wrapper {
    display: flex;
    position: relative;
    flex-direction: column;
    flex: 1;
    margin-top: 22px;

    .input {
      font-size: 16px;
      padding: 4px 0px;
      color: #666666;
      border: none;
      outline: none;
      border-bottom: 1px solid #999999;
      ::-webkit-input-placeholder {
        color: #666666;
      }
      :-moz-placeholder {
        color: #666666;
      }
      ::-moz-placeholder {
        color: #666666;
      }
      :-ms-input-placeholder {
        color: #666666;
      }

      :disabled {
        background-color: #fff;
      }
    }

    .input-active {
      border: none;
      border-bottom: 2px solid #1d84ff;
      ::-webkit-input-placeholder {
        color: #bababa;
      }
      :-moz-placeholder {
        color: #bababa;
      }
      ::-moz-placeholder {
        color: #bababa;
      }
      :-ms-input-placeholder {
        color: #bababa;
      }
    }
  }

  .wrapper > label {
    position: absolute;
    top: -13px;
    left: 0;
    font-size: 16px;
    color: blue;
    transition: all 0.2s linear;
    opacity: 0;
    font-weight: bold;
  }

  .wrapper > label.on {
    font-size: 8px;
    opacity: 1;
  }

  .optional-text {
    color: #666666;
    font-size: 9px;
    text-align: left;
    padding: 3px 0px;
  }
`;

export const FloatInput: FC<FloatInputProps> = ({
  label,
  placeHolder,
  required,
  disabled,
  value,
  onChange,
  id,
}) => {
  const [error, setError] = useState(false);
  const [className, setClassName] = useState(disabled ? 'on' : '');
  const [placeHolderText, setPlaceHolderText] = useState(label);

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === '') {
      if (required) {
        setError(true);
      }
    } else {
      setError(false);
    }
    onChange(id, event.target.value);
  };

  const onFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    // setError(false);
    if (event.target.value === '') {
      setClassName('on');
    }
    setPlaceHolderText(placeHolder);
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    if (event.target.value === '') {
      if (required) {
        setError(true);
      }
    }
    setPlaceHolderText('');
  };

  const isActive = placeHolderText === placeHolder;
  let opacity = {};
  if (disabled) {
    opacity = {
      opacity: 0.4,
    };
  }

  return (
    <Wrapper>
      <div className="wrapper">
        <label
          style={{
            color: error ? '#ff6b6b' : isActive ? '#1d84ff' : '#666666',
            ...opacity,
          }}
          className={className}
        >
          {label}
        </label>
        <input
          name={id}
          className={isActive ? 'input input-active' : 'input'}
          onChange={onChangeInput}
          value={value || ''}
          placeholder={(placeHolderText && placeHolderText) || placeHolder}
          onFocus={onFocus}
          data-testid={id}
          onBlur={onBlur}
          type="text"
          style={{
            opacity: disabled ? 0.4 : 1,
            borderColor: error ? '#ff6b6b' : isActive ? '#1d84ff' : '#666666',
          }}
          disabled={disabled || false}
        />
        {error && (
          <span className="optional-text" style={{ color: '#ff6b6b' }}>
            {capitalize(label)} is mandatory.
          </span>
        )}
        {!required && <span className="optional-text">Optional</span>}
      </div>
    </Wrapper>
  );
};
