import { Redirect, RouteComponentProps } from '@reach/router';
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

  // TODO Update From Store
  const currentState = SessionStates.INACTIVE;

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
