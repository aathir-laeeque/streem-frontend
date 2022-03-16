import { Header, NavigationMenu, WorkArea } from '#components';
import { DashboardLayout } from '#components/Layouts';
import { ChecklistView, InboxView, JobsView, UserAccessView } from '#views';
import { RouteComponentProps, Router } from '@reach/router';
import React, { FC } from 'react';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import NotificationBanner from '../../components/NotificationBanner';

const UseCaseSelectionView: FC<RouteComponentProps> = () => (
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

export default UseCaseSelectionView;
