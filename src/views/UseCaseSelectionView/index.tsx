import { Header, NavigationMenu, WorkArea } from '#components';
import { DashboardLayout } from '#components/Layouts';
import { ComposerEntity } from '#PrototypeComposer/types';
import { useTypedSelector } from '#store';
import { fetch } from '#store/properties/actions';
import { ChecklistView, InboxView, JobsView, UserAccessView } from '#views';
import { RouteComponentProps, Router } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import NotificationBanner from '../../components/NotificationBanner';

const UseCaseSelectionView: FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { selectedUseCase } = useTypedSelector((state) => state.auth);

  useEffect(() => {
    if (selectedUseCase) {
      dispatch(
        fetch(
          [ComposerEntity.JOB, ComposerEntity.CHECKLIST],
          selectedUseCase.id,
        ),
      );
    }
  }, [selectedUseCase]);

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

export default UseCaseSelectionView;
