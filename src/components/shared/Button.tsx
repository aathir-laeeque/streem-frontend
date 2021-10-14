import React, { ComponentPropsWithRef, forwardRef } from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  type?: string;
}

export const Button = styled.button.attrs<ButtonProps>(
  ({ type, disabled = false }) => ({
    disabled,
    type: type ? type : 'button',
  }),
)<ButtonProps>`
  border-radius: 3px;
  background-color: #1d84ff;
  color: #ffffff;
  line-height: 0.75;
  padding: 10px 16px;
  border: none;
  outline: none;
  margin-right: 8px;
  cursor: pointer;
  :disabled {
    opacity: 0.4;
    cursor: unset;
  }
`;

export const FlatButton = styled.button`
  border-radius: 3px;
  background-color: #fff;
  border: 1px solid #1d84ff;
  color: #1d84ff;
  display: flex;
  align-items: center;
  line-height: 0.75;
  cursor: pointer;
  padding: 5px 8px 5px 16px;
  outline: none;
  font-size: 14px;
  margin-right: 16px;
`;

export type ButtonVariant = 'primary' | 'secondary' | 'textOnly';
export type ButtonColor = 'blue' | 'green' | 'red' | 'dark';

type Button1Props = {
  color?: ButtonColor;
  variant?: ButtonVariant;
} & ComponentPropsWithRef<'button'>;

const ColorMap = {
  blue: {
    activeBackgroundColor: '#00387a',
    backgroundColor: '#1d84ff',
    borderColor: '#1d84ff',
    hoverBackgroundColor: '#005dcc',
    textColor: '#1d84ff',
  },
  green: {
    activeBackgroundColor: '#427a00',
    backgroundColor: '#5aa700',
    borderColor: '#5aa700',
    hoverBackgroundColor: '#5aa700',
    textColor: '#5aa700',
  },
  red: {
    activeBackgroundColor: '#cc5656',
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
    hoverBackgroundColor: '#ff6b6b',
    textColor: '#ff6b6b',
  },
  dark: {
    activeBackgroundColor: '#999999',
    backgroundColor: '#333333',
    borderColor: '#333333',
    hoverBackgroundColor: '#666666',
    textColor: '#ffffff',
  },
};

const ButtonWrapper = styled.button.attrs(
  ({ type = 'button', disabled = false }) => ({ type, disabled }),
)<Omit<Button1Props, 'loading'>>`
  align-items: center;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  justify-content: center;
  margin-right: 24px;
  outline: none;
  padding: 12px 24px;

  :last-of-type {
    margin-right: 0;
  }

  :disabled {
    cursor: not-allowed;
  }

  ${({ variant = 'primary', color = 'blue' }) => {
    const colors = ColorMap[color];

    switch (variant) {
      case 'primary':
        return css`
          background-color: ${colors.backgroundColor};
          color: #ffffff;

          > .icon {
            color: #ffffff;
          }

          :hover {
            background-color: ${colors.hoverBackgroundColor};
          }

          :active {
            background-color: ${colors.activeBackgroundColor};
          }
        `;

      case 'secondary':
        return css`
          background-color: #ffffff;
          border-color: ${colors.borderColor};
          color: ${colors.textColor};

          > .icon {
            color: ${colors.textColor} !important;
          }

          :hover {
            background-color: ${colors.hoverBackgroundColor};
            color: #ffffff;

            > .icon {
              color: #ffffff !important;
            }
          }

          :active {
            background-color: ${colors.activeBackgroundColor};
          }
        `;

      case 'textOnly':
        return css`
          background-color: transparent;
          color: ${colors.textColor};
          padding: 4px 8px;

          :hover,
          :active {
            background-color: #fafafa;
          }
        `;
      default:
        return null;
    }
  }}

  ${({ disabled, variant = 'primary' }) =>
    disabled
      ? variant === 'secondary'
        ? css`
            border-color: #bbbbbb;
            color: #bbbbbb;
            background-color: #fff;

            :hover {
              background-color: #fff;
              color: #bbbbbb;
            }
          `
        : css`
            background-color: #eeeeee;
            border-color: transparent;
            color: #dadada;
            pointer-events: none;
          `
      : null}
`;

export const Button1 = forwardRef<HTMLButtonElement, Button1Props>(
  ({ children, ...props }, ref) => (
    <ButtonWrapper ref={ref} {...props}>
      {children}
    </ButtonWrapper>
  ),
);

Button1.displayName = 'Button';
