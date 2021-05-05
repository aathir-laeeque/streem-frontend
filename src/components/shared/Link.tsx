import { ArrowBack, ArrowForward } from '@material-ui/icons';
import { navigate } from '@reach/router';
import React from 'react';
import styled, { css } from 'styled-components';

type Props = {
  // custom className to target and style this component from outside
  className?: string;
  // to place icon before or after the text provided in the label key
  iconPosition?: 'before' | 'after';
  label: string;
  // link to redirect to, defaults to -1 i.e previous route (behaves as go back)
  link?: string;
  withIcon?: boolean;
};

type WrapperProps = Pick<Props, 'withIcon' | 'className'>;

const Wrapper = styled.div.attrs(({ className }) => ({
  className: className ?? 'link',
}))<WrapperProps>`
  align-items: center;
  cursor: pointer;
  display: flex;
  margin: 8px 0 16px;

  .icon {
    color: #1d84ff;
    font-size: 16px;

    &.before {
      margin-right: 8px;
    }

    &.after {
      margin-left: 8px;
    }

    ${({ withIcon }) =>
      withIcon
        ? css`
            display: block;
          `
        : css`
            display: none;
          `}
  }

  .label {
    color: #1d84ff;
    font-size: 14px;
  }
`;

export const Link = ({
  className,
  label,
  link,
  withIcon = true,
  iconPosition = 'before',
}: Props) => (
  <Wrapper
    className={className}
    onClick={() => navigate((link as string) ?? -1)}
    withIcon={withIcon}
  >
    {iconPosition === 'before' ? <ArrowBack className="icon before" /> : null}

    <span className="label">{label}</span>

    {iconPosition === 'after' ? <ArrowForward className="icon after" /> : null}
  </Wrapper>
);
