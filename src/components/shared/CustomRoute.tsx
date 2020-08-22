import { Redirect, RouteComponentProps } from '@reach/router';
import { useTypedSelector } from '#store';
import { useDispatch } from 'react-redux';
import { refreshTokenPoll } from '#views/Auth/actions';
import React, { FC } from 'react';

type Props = RouteComponentProps & {
  as: FC;
  isProtected?: boolean;
};

const SessionStates = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  LOCKED: 'LOCKED',
};

export const CustomRoute: FC<Props> = ({
  as: Component,
  isProtected = true,
  ...props
}) => {
  const { ...rest } = props;
  const { profile, isRefreshing } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();

  let currentState = SessionStates.INACTIVE;

  if (profile) {
    const { verified, archived } = profile;
    if (!isRefreshing) dispatch(refreshTokenPoll());
    if (verified) currentState = SessionStates.ACTIVE;
  }
  // console.log('active', active);
  // console.log('archived', archived);

  if (!isProtected) {
    switch (currentState) {
      case SessionStates.ACTIVE:
        return <Redirect from="" to="/" noThrow />;
      default:
        return <Component {...rest} />;
    }
  }

  switch (currentState) {
    case SessionStates.ACTIVE:
      return <Component {...rest} />;
    case SessionStates.LOCKED:
      return <Redirect from="" to="/auth/locked" noThrow />;
    default:
      return <Redirect from="" to="/auth/login" noThrow />;
  }
};
