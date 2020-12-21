import React, { FC, useEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from '@reach/router';
import { useTypedSelector } from '#store';
import { useDispatch } from 'react-redux';
import checkPermission from '#services/uiPermissions';
import { refreshTokenPoll } from '#views/Auth/actions';

type Props = RouteComponentProps & {
  as: FC | FC<RouteComponentProps<{ id: string }>>;
  isProtected?: boolean;
};

enum SessionStates {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

const OtherTabs = [
  'jobs/print/:jobId',
  'users-activity/print',
  'job-activity/print/:jobId',
];

export const CustomRoute: FC<Props> = ({
  as: Component,
  isProtected = true,
  ...props
}) => {
  const { isRefreshing, isLoggedIn } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [currentState, setCurrentState] = useState<SessionStates | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      if (!isRefreshing && !OtherTabs.includes(props.path || OtherTabs[0]))
        dispatch(refreshTokenPoll());
      setCurrentState(SessionStates.ACTIVE);
    } else {
      setCurrentState(SessionStates.INACTIVE);
    }
  }, [isLoggedIn]);

  switch (currentState) {
    case null:
      return <div>Loading</div>;
    case SessionStates.ACTIVE:
      return isProtected ? (
        <Component {...props} />
      ) : checkPermission(['sidebar', 'inbox']) ? (
        <Redirect from="" to="/inbox" noThrow />
      ) : (
        <Redirect from="" to="/user-access" noThrow />
      );
    default:
      return !isProtected ? (
        <Component {...props} />
      ) : (
        <Redirect from="" to="/auth/login" noThrow />
      );
  }
};
