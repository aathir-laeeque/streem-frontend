import { Redirect, RouteComponentProps } from '@reach/router';
import React, { FC } from 'react';

type Props = RouteComponentProps & {
  as: FC;
};

const SessionStates = {
  ACTIVE: 'ACTIVE',
  UNACTIVE: 'UNACTIVE',
  LOCKED: 'LOCKED',
};

export const ProtectedRoute: FC<Props> = ({ as: Component, ...props }) => {
  const { ...rest } = props;

  // TODO Update From Store
  const currentState = SessionStates.UNACTIVE;
  switch (currentState) {
    case SessionStates.ACTIVE:
      return <Component {...rest} />;
    case SessionStates.UNACTIVE:
      return <Redirect from="" to="/auth/register" noThrow />;
    case SessionStates.LOCKED:
      return <Redirect from="" to="/auth/locked" noThrow />;
    default:
      return <Redirect from="" to="/auth/register" noThrow />;
  }
};
