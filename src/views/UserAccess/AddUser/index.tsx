import React, { FC } from 'react';
import { useTabs } from '#components';
import { Composer } from './styles';
import NewUser from './NewUser';
import { AddUserProps } from './types';

const AddUser: FC<AddUserProps> = () => {
  const passThroughTabContentProps = {};
  const { renderTabsContent, renderTabsHeader } = useTabs([
    {
      label: 'Add New User',
      active: true,
      TabContent: NewUser,
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

export default AddUser;
