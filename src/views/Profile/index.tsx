import React, { FC } from 'react';
import { useTabs } from '#components';
import { Composer } from './styles';
import MyProfile from './MyProfile';
import AccountSecurity from './AccountSecurity';
import { ProfileProps } from './types';

const Profile: FC<ProfileProps> = () => {
  const passThroughTabContentProps = {};
  const { renderTabsContent, renderTabsHeader } = useTabs([
    {
      label: 'My Profile',
      active: true,
      TabContent: MyProfile,
      passThroughTabContentProps,
    },
    {
      label: 'Account Security',
      active: false,
      TabContent: AccountSecurity,
      passThroughTabContentProps,
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
