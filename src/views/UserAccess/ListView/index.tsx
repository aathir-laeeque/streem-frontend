import { useTabs } from '#components';
import React, { FC } from 'react';
import { UserStatus } from '#store/users/types';

import { Composer } from './styles';
import TabContent from './TabContent';
import SessionActivity from './SessionActivity/index';
import { ListViewProps } from './types';

const ListView: FC<ListViewProps> = () => {
  const { renderTabsContent, renderTabsHeader } = useTabs([
    {
      label: `${UserStatus.ACTIVE} Users`,
      active: true,
      TabContent,
      passThroughTabContentProps: {
        selectedStatus: UserStatus.ACTIVE,
      },
    },
    {
      label: `${UserStatus.ARCHIVED} Users`,
      active: false,
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
