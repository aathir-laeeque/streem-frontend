import useTabsNew, { Tab } from '#components/shared/useTabsNew';
import checkPermission from '#services/uiPermissions';
import { UsersListType } from '#store/users/types';
import { ViewWrapper } from '#views/Jobs/NewListView/styles';
import React, { FC } from 'react';

import SessionActivity from './SessionActivity';
import TabContent from './TabContent';
import { ListViewProps } from './types';

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

  const { renderTabContent, renderTabHeader } = useTabsNew({
    tabs: shownTabs,
  });

  return (
    <ViewWrapper>
      <div className="header">
        <div className="heading">Users</div>
        <div className="sub-heading">Add, Remove or Edit Users</div>
      </div>

      <div className="list-table">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </ViewWrapper>
  );
};

export default ListView;
