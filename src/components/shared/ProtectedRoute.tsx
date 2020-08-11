import { Redirect, RouteComponentProps } from '@reach/router';
import React, { FC } from 'react';

type Props = RouteComponentProps & {
  as: FC;
  isProtected?: boolean;
};

const SessionStates = {
  ACTIVE: 'ACTIVE',
  UNACTIVE: 'UNACTIVE',
  LOCKED: 'LOCKED',
};

export const ProtectedRoute: FC<Props> = ({
  as: Component,
  isProtected = true,
  ...props
}) => {
  const { ...rest } = props;

  // TODO Update From Store
  const currentState = SessionStates.ACTIVE;

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
