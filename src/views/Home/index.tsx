import { Header, NavigationMenu, WorkArea } from '#components';
import { DashboardLayout } from '#components/Layouts';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
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
import { Router, RouteComponentProps } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch } from 'react-redux';

const HomeView: FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { isIdle, isLoggedIn, sessionIdleTimeoutInMinutes } = useTypedSelector(
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
  }, []);

  const handleOnIdle = () => {
    // console.log('user is idle');
    if (!isIdle && isLoggedIn) {
      dispatch(setIdle(true));
      dispatch(
        openOverlayAction({
          type: OverlayNames.SESSION_EXPIRE,
        }),
      );
    }
  };

  const handleOnActive = (event: any) => {
    // console.log('user is active', event);
    // console.log('time remaining', getRemainingTime());
  };

  const handleOnAction = (event: any) => {
    // console.log('user did something');
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * (sessionIdleTimeoutInMinutes || 10),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  });

  return (
    <DashboardLayout>
      <Header />
      <NavigationMenu />
      <WorkArea>
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
