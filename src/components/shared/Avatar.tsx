import { User as UserType } from '#store/users/types';
import { getFullName, getInitials } from '#utils/stringUtils';
import React, { FC, MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import { closeOverlayAction, openOverlayAction } from '../OverlayContainer/actions';
import { OverlayNames } from '../OverlayContainer/types';

type User = Pick<UserType, 'id' | 'firstName' | 'lastName' | 'employeeId'>;

type Color = 'blue' | 'default';

type Props = {
  color?: Color;
  size?: 'small' | 'medium' | 'large';
  borderColor?: string;
  backgroundColor?: string;
  user: User;
  allowMouseEvents?: boolean;
};

const Wrapper = styled.div.attrs({
  className: 'avatar',
})<Pick<Props, 'size' | 'color' | 'borderColor' | 'backgroundColor'>>`
  align-items: center;
  background-color: ${({ backgroundColor }) => `${backgroundColor}`};
  border: 1px solid ${({ borderColor }) => `${borderColor}`};
  border-radius: 50%;
  color: ${({ color = 'default' }) => (color === 'default' ? '#333333' : '#1d84ff')};
  display: flex;
  justify-content: center;

  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          font-size: 12px;
          line-height: 12px;
          height: 24px;
          width: 24px;
        `;

      case 'medium':
        return css`
          font-size: 12px;
          line-height: 12px;
          height: 32px;
          width: 32px;
        `;
      case 'large':
        return css`
          font-size: 16px;
          line-height: 16px;
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
  borderColor = '#999999',
  backgroundColor = '#dadada',
  user,
  allowMouseEvents = true,
}) => {
  const dispatch = useDispatch();

  return (
    <Wrapper
      color={color}
      size={size}
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      {...(allowMouseEvents
        ? {
            onMouseEnter: (event: MouseEvent) => {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.ASSIGNED_USER_DETAIL,
                  popOverAnchorEl: event.currentTarget,
                  props: { users: [user] },
                }),
              );
            },
            onMouseLeave: () => {
              dispatch(closeOverlayAction(OverlayNames.ASSIGNED_USER_DETAIL));
            },
          }
        : {})}
    >
      {getInitials(getFullName(user))}
    </Wrapper>
  );
};

export type AvatarExtrasProps = Pick<
  Props,
  'size' | 'color' | 'borderColor' | 'backgroundColor'
> & {
  users: User[];
};

export const AvatarExtras: FC<AvatarExtrasProps> = ({
  color = 'default',
  size = 'medium',
  borderColor = '#999999',
  backgroundColor = '#dadada',
  users,
}) => {
  const dispatch = useDispatch();

  return (
    <Wrapper
      color={color}
      size={size}
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      onMouseEnter={(event: MouseEvent) => {
        dispatch(
          openOverlayAction({
            type: OverlayNames.ASSIGNED_USER_DETAIL,
            popOverAnchorEl: event.currentTarget,
            props: { users },
          }),
        );
      }}
    >
      +{users.length}
    </Wrapper>
  );
};
