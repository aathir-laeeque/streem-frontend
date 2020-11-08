// import { useTabs } from '#components';
import useTabsNew, { Tab } from '#components/shared/useTabsNew';
import checkPermission from '#services/uiPermissions';
import { UserState } from '#store/users/types';
import { ViewWrapper } from '#views/Checklists/ListView/styles';
import React, { FC } from 'react';

import NewTabContent from './NewTabContent';
import SessionActivity from './SessionActivity';
import { ListViewProps } from './types';

const ListView: FC<ListViewProps> = () => {
  const shownTabs: Tab[] = [];
  if (checkPermission(['usersAndAccess', 'activeUsers']))
    shownTabs.push({
      label: `${UserState.ACTIVE} Users`,
      tabContent: NewTabContent,
      values: [UserState.ACTIVE],
    });

  if (checkPermission(['usersAndAccess', 'archivedUsers']))
    shownTabs.push({
      label: `${UserState.ARCHIVED} Users`,
      tabContent: NewTabContent,
      values: [UserState.ARCHIVED],
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
        {/* {renderTabsHeader()} */}
        {/* {renderTabsContent()} */}
      </div>
    </ViewWrapper>
  );
};

export default ListView;
