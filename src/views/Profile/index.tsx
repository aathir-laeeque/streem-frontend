import { useTabs } from '#components';
import React, { FC } from 'react';

import AccountSecurity from './AccountSecurity';
import MyProfile from './MyProfile';
import { Composer } from './styles';
import { ProfileProps } from './types';

const Profile: FC<ProfileProps> = () => {
  const { renderTabsContent, renderTabsHeader } = useTabs([
    {
      label: 'My Profile',
      active: true,
      TabContent: MyProfile,
    },
    {
      label: 'Account Security',
      active: false,
      TabContent: AccountSecurity,
    },
  ]);

  return (
    <Composer>
      {renderTabsHeader()}
      {renderTabsContent()}
    </Composer>
  );
};

export default Profile;
