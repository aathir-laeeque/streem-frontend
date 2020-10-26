import { User as UserType } from '#store/users/types';
import { getFullName, getInitials } from '#utils/stringUtils';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';

type User = Pick<UserType, 'id' | 'firstName' | 'lastName' | 'employeeId'>;

type Color = 'blue' | 'default';

type Props = {
  color?: Color;
  size?: 'small' | 'medium' | 'large';
  user: User;
};

const Wrapper = styled.div<Pick<Props, 'size' | 'color'>>`
  align-items: center;
  background-color: #dadada;
  border: 1px solid #999999;
  border-radius: 50%;
  color: ${({ color = 'default' }) =>
    color === 'default' ? '#333333' : '#1d84ff'};
  display: flex;
  justify-content: center;

  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          font-size: 12px;
          height: 24px;
          width: 24px;
        `;

      case 'medium':
        return css`
          font-size: 14px;
          height: 32px;
          width: 32px;
        `;
      case 'large':
        return css`
          font-size: 16px;
          height: 40px;
          width: 40px;
        `;
      default:
        return null;
    }
  }}
`;

export const Avatar: FC<Props> = ({
  color = 'default',
  size = 'medium',
  user,
}) => (
  <Wrapper color={color} size={size}>
    {getInitials(getFullName(user))}
  </Wrapper>
);
