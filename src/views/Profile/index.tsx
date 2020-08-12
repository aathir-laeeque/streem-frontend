import React, { FC } from 'react';
import { useTabs } from '#components';
import { Composer } from './styles';
import styled from 'styled-components';
import { ProfileProps } from './types';

const TabContent = styled.div`
  display: flex;
  flex: 1;
`;

const Profile: FC<ProfileProps> = () => {
  const passThroughTabContentProps = {};
  const { renderTabsContent, renderTabsHeader } = useTabs([
    {
      label: 'My Profile',
      active: true,
      TabContent,
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
