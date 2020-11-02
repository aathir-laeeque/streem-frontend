import { useTabs } from '#components';
import React, { FC } from 'react';
import { UsersState, UserState } from '#store/users/types';

import { Composer } from './styles';
import TabContent from './TabContent';
import SessionActivity from './SessionActivity/index';
import { ListViewProps } from './types';
import { useTypedSelector } from '#store';

const ListView: FC<ListViewProps> = () => {
  const { selectedState }: Partial<UsersState> = useTypedSelector(
    (state) => state.users,
  );
  const { renderTabsContent, renderTabsHeader } = useTabs([
    {
      label: `${UserState.ACTIVE} Users`,
      active: selectedState === UserState.ACTIVE,
      TabContent,
      passThroughTabContentProps: {
        selectedState: UserState.ACTIVE,
      },
    },
    {
      label: `${UserState.ARCHIVED} Users`,
      active: selectedState === UserState.ARCHIVED,
      TabContent,
      passThroughTabContentProps: {
        selectedState: UserState.ARCHIVED,
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
