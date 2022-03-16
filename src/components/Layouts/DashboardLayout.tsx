import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { setInternetConnectivity } from '#store/extras/action';
import { DEFAULT_SESSION_TIMEOUT_IN_MIN } from '#utils/constants';
import { setIdle } from '#views/Auth/actions';
import React, { FC, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const Layout = styled.div.attrs({
  className: 'main-layout-view',
})`
  display: grid;
  grid-template-areas:
    'header header'
    'nav-menu workarea';
  grid-template-rows: 50px 1fr;
  grid-template-columns: 120px 1fr;
  flex: 1;
  background-color: #fafafa;

  @media (max-width: 1200px) {
    grid-template-columns: 100px 1fr;
  }
`;

const DashboardLayout: FC = ({ children }) => {
  const dispatch = useDispatch();
  const { isIdle, isLoggedIn, settings } = useTypedSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isIdle && isLoggedIn) {
      dispatch(
        openOverlayAction({
          type: OverlayNames.SESSION_EXPIRE,
        }),
      );
    }

    const handleConnectivityChange = (connected: boolean) => {
      dispatch(setInternetConnectivity({ connected }));
    };

    window.addEventListener('online', () => handleConnectivityChange(true));
    window.addEventListener('offline', () => handleConnectivityChange(false));

    return () => {
      window.removeEventListener('online', () =>
        handleConnectivityChange(true),
      );
      window.removeEventListener('offline', () =>
        handleConnectivityChange(false),
      );
    };
  }, []);

  const handleOnIdle = () => {
    if (!isIdle && isLoggedIn) {
      dispatch(setIdle(true));
      dispatch(
        openOverlayAction({
          type: OverlayNames.SESSION_EXPIRE,
        }),
      );
    }
  };

  useIdleTimer({
    timeout:
      1000 *
      60 *
      (settings?.sessionIdleTimeoutInMinutes || DEFAULT_SESSION_TIMEOUT_IN_MIN),
    onIdle: handleOnIdle,
    debounce: 500,
  });

  return <Layout>{children}</Layout>;
};

export default DashboardLayout;
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
