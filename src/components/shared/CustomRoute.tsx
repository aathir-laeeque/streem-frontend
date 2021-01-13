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
  const { isLoggedIn } = useTypedSelector((state) => state.auth);

  if (isLoggedIn)
    return isProtected ? (
      <Component {...props} />
    ) : checkPermission(['sidebar', 'inbox']) ? (
      <Redirect from="" to="/inbox" noThrow />
    ) : (
      <Redirect from="" to="/user-access" noThrow />
    );

  return !isProtected ? (
    <Component {...props} />
  ) : (
    <Redirect from="" to="/auth/login" noThrow />
  );
};
