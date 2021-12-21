import { Header, NavigationMenu, WorkArea } from '#components';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { DashboardLayout } from '#components/Layouts';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { setInternetConnectivity } from '#store/extras/action';
import { DEFAULT_SESSION_TIMEOUT_IN_MIN } from '#utils/constants';
import { ChecklistView, InboxView, JobsView, UserAccessView } from '#views';
import { setIdle } from '#views/Auth/actions';
import { Router, RouteComponentProps } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch } from 'react-redux';
import NotificationBanner from '../../components/NotificationBanner';

const HomeView: FC<RouteComponentProps> = () => {
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

  return (
    <DashboardLayout>
      <Header />
      <NavigationMenu />
      <WorkArea>
        <ErrorBoundary>
          <NotificationBanner />
          <Router>
            <ChecklistView path="checklists/*" />
            <InboxView path="inbox/*" />
            <JobsView path="jobs/*" />
            <UserAccessView path="users/*" />
          </Router>
        </ErrorBoundary>
      </WorkArea>
    </DashboardLayout>
  );
};

export default HomeView;
