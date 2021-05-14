import React, { FC } from 'react';
import { Redirect, RouteComponentProps } from '@reach/router';
import { useTypedSelector } from '#store';
import checkPermission from '#services/uiPermissions';

type Props = RouteComponentProps & {
  as: FC | FC<RouteComponentProps<{ id: string }>>;
  isProtected?: boolean;
};

export const CustomRoute: FC<Props> = ({
  as: Component,
  isProtected = true,
  ...props
}) => {
  const { isLoggedIn, selectedFacility } = useTypedSelector(
    (state) => state.auth,
  );

  if (isLoggedIn) {
    if (selectedFacility || props.path === 'facility/selection') {
      return isProtected && props.location?.pathname !== '/' ? (
        <Component {...props} />
      ) : checkPermission(['sidebar', 'inbox']) ? (
        <Redirect from="" to="/inbox" noThrow />
      ) : (
        <Redirect from="" to="/users" noThrow />
      );
    }

    return <Redirect from="" to="/facility/selection" noThrow />;
  }

  return !isProtected ? (
    <Component {...props} />
  ) : (
    <Redirect from="" to="/auth/login" noThrow />
  );
};
