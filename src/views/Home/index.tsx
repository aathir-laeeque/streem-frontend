import { Header, NavigationMenu, WorkArea } from '#components';
import { DashboardLayout } from '#components/Layouts';
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
import { Router, RouteComponentProps } from '@reach/router';
import React, { FC } from 'react';

const HomeView: FC<RouteComponentProps> = () => {
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
