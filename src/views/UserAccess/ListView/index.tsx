import useTabs, { Tab } from '#components/shared/useTabs';
import checkPermission from '#services/uiPermissions';
import { UsersListType } from '#store/users/types';
import { ViewWrapper } from '#views/Jobs/ListView/styles';
import React, { FC } from 'react';

import SessionActivity from './SessionActivity';
import TabContent from './TabContent';
import { ListViewProps } from './types';
import { GeneralHeader } from '#components';

const ListView: FC<ListViewProps> = () => {
  const shownTabs: Tab[] = [];
  if (checkPermission(['usersAndAccess', 'activeUsers']))
    shownTabs.push({
      label: `${UsersListType.ACTIVE} Users`,
      tabContent: TabContent,
      values: [UsersListType.ACTIVE],
    });

  if (checkPermission(['usersAndAccess', 'archivedUsers']))
    shownTabs.push({
      label: `${UsersListType.ARCHIVED} Users`,
      tabContent: TabContent,
      values: [UsersListType.ARCHIVED],
    });

  if (checkPermission(['usersAndAccess', 'sessionActivity']))
    shownTabs.push({
      label: 'Session Activity',
      tabContent: SessionActivity,
    });

  const { renderTabContent, renderTabHeader } = useTabs({
    tabs: shownTabs,
  });

  return (
    <ViewWrapper>
      <GeneralHeader heading="Users" subHeading="Add, Remove or Edit Users" />

      <div className="list-table">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </ViewWrapper>
  );
};

export default ListView;
