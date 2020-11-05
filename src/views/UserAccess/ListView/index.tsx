import { useTabs } from '#components';
import React, { FC } from 'react';
import { UsersState, UserState } from '#store/users/types';

import { Composer } from './styles';
import TabContent from './TabContent';
import SessionActivity from './SessionActivity/index';
import { ListViewProps } from './types';
import { useTypedSelector } from '#store';
import checkPermission from '#services/uiPermissions';
import { Tab } from '#components/shared/useTabs';

const ListView: FC<ListViewProps> = () => {
  const { selectedState }: Partial<UsersState> = useTypedSelector(
    (state) => state.users,
  );

  const shownTabs: Tab[] = [];
  if (checkPermission(['usersAndAccess', 'activeUsers']))
    shownTabs.push({
      label: `${UserState.ACTIVE} Users`,
      active: selectedState === UserState.ACTIVE,
      TabContent,
      passThroughTabContentProps: {
        selectedState: UserState.ACTIVE,
      },
    });

  if (checkPermission(['usersAndAccess', 'archivedUsers']))
    shownTabs.push({
      label: `${UserState.ARCHIVED} Users`,
      active: selectedState === UserState.ARCHIVED,
      TabContent,
      passThroughTabContentProps: {
        selectedState: UserState.ARCHIVED,
      },
    });

  if (checkPermission(['usersAndAccess', 'sessionActivity']))
    shownTabs.push({
      label: 'Session Activity',
      active: false,
      TabContent: SessionActivity,
      passThroughTabContentProps: {},
    });

  const { renderTabsContent, renderTabsHeader } = useTabs(shownTabs);

  return (
    <Composer>
      {renderTabsHeader()}
      {renderTabsContent()}
    </Composer>
  );
};

export default ListView;
