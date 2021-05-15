import React, { FC } from 'react';
import { Redirect, RouteComponentProps } from '@reach/router';
import { useTypedSelector } from '#store';
import checkPermission from '#services/uiPermissions';
import { logout } from '#views/Auth/actions';
import { useDispatch } from 'react-redux';

type Props = RouteComponentProps & {
  as: FC | FC<RouteComponentProps<{ id: string }>>;
  isProtected?: boolean;
};

export const CustomRoute: FC<Props> = ({
  as: Component,
  isProtected = true,
  ...props
}) => {
  const {
    isLoggedIn,
    selectedFacility,
    hasSetChallengeQuestion,
    token,
  } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { location } = props;

  if (isLoggedIn) {
    if (!hasSetChallengeQuestion) {
      if (location?.pathname !== '/auth/register/recovery') {
        if (token)
          return <Redirect from="" to="/auth/register/recovery" noThrow />;
        dispatch(logout());
      }
    } else {
      if (selectedFacility || props.path === 'facility/selection') {
        return isProtected && location?.pathname !== '/' ? (
          <Component {...props} />
        ) : checkPermission(['sidebar', 'inbox']) ? (
          <Redirect from="" to="/inbox" noThrow />
        ) : (
          <Redirect from="" to="/users" noThrow />
        );
      }

      return <Redirect from="" to="/facility/selection" noThrow />;
    }
  }

  return !isProtected ? (
    <Component {...props} />
  ) : (
    <Redirect from="" to="/auth/login" noThrow />
  );
};
