import { Header, NavigationMenu, WorkArea } from '#components';
import { DashboardLayout } from '#components/Layouts';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
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
import { Router, RouteComponentProps } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch } from 'react-redux';

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
