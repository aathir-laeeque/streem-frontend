import { Header, NavigationMenu, WorkArea } from '#components';
import { DashboardLayout } from '#components/Layouts';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { setInternetConnectivity } from '#store/extras/action';
import { DEFAULT_SESSION_TIMEOUT_IN_MIN } from '#utils/constants';
import {
  // AuditLogsView,
  ChecklistView,
  // DashboardView,
  JobsView,
  InboxView,
  // ReportsView,
  UserAccessView,
  ProfileView,
} from '#views';
import { setIdle } from '#views/Auth/actions';
import { Info } from '@material-ui/icons';
import { Router, RouteComponentProps } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: unset !important;
  flex: unset !important;

  .alert {
    padding: 4px;
    border-radius: 4px;
    border: solid 1px #ff6b6b;
    background-color: rgba(255, 107, 107, 0.16);
    display: flex;
    flex-direction: row;
    flex: unset;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    overflow: auto;

    span {
      font-weight: bold;
      color: #000;
      line-height: 12px;
      margin: 0px 4px 0px 8px;
    }

    svg {
      color: #cc5656;
      font-size: 16px;
      line-height: 14px;
    }
  }
`;

const HomeView: FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { isIdle, isLoggedIn, settings } = useTypedSelector(
    (state) => state.auth,
  );
  const { connected } = useTypedSelector((state) => state.extras);

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
        {!connected && (
          <HeaderWrapper>
            <div className="alert">
              <Info />
              <span>NO INTERNET. </span>
              Please make sure your are connected to internet to use the CLEEN
              App.
            </div>
          </HeaderWrapper>
        )}
        <Router>
          {/* <DashboardView path="/" /> */}
          {/* <AuditLogsView path="audit/*" /> */}
          <ChecklistView path="checklists/*" />
          {/* <ReportsView path="reports/*" /> */}
          <JobsView path="jobs/*" />
          <InboxView path="inbox/*" />
          <UserAccessView path="user-access/*" />
          <ProfileView path="profile" />
        </Router>
      </WorkArea>
    </DashboardLayout>
  );
};

export default HomeView;
