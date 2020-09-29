import { useTabs } from '#components';
import React, { FC } from 'react';
import { UsersState, UserStatus } from '#store/users/types';

import { Composer } from './styles';
import TabContent from './TabContent';
import SessionActivity from './SessionActivity/index';
import { ListViewProps } from './types';
import { useTypedSelector } from '#store';

const ListView: FC<ListViewProps> = () => {
  const { selectedStatus }: Partial<UsersState> = useTypedSelector(
    (state) => state.users,
  );
  const { renderTabsContent, renderTabsHeader } = useTabs([
    {
      label: `${UserStatus.ACTIVE} Users`,
      active: selectedStatus === UserStatus.ACTIVE,
      TabContent,
      passThroughTabContentProps: {
        selectedStatus: UserStatus.ACTIVE,
      },
    },
    {
      label: `${UserStatus.ARCHIVED} Users`,
      active: selectedStatus === UserStatus.ARCHIVED,
      TabContent,
      passThroughTabContentProps: {
        selectedStatus: UserStatus.ARCHIVED,
      },
    },
    {
      label: 'Session Activity',
      active: false,
      TabContent: SessionActivity,
      passThroughTabContentProps: {},
    },
  ]);

  return (
    <Composer>
      {renderTabsHeader()}
      {renderTabsContent()}
    </Composer>
  );
};

export default ListView;
