import { ViewWrapper } from '#views/Jobs/ListView/styles';
import { Button, DataTable, Select } from '#components';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { ListViewProps } from '#views/Jobs/ListView/types';
import React, { FC, useState } from 'react';
import AddUserDrawer from './AddUserDrawer';

const Permissions: FC<ListViewProps> = ({ location }) => {
  const [addUserDrawer, setAddUserDrawer] = useState<string | boolean>('');

  const selectedProcessName = location?.state?.processFilter?.processName;

  return (
    <ViewWrapper>
      <div className="header">
        <div className="heading">
          {selectedProcessName ? `${selectedProcessName} Permission` : 'Permission'}
        </div>
      </div>
      <TabContentWrapper>
        <div className="filters">
          <Select placeholder="Object Relation" />
          <Select placeholder="Permission Set" className="process-filter" />
          <Button
            onClick={() => {
              setAddUserDrawer(true);
            }}
            id="create"
          >
            Add User
          </Button>
        </div>
        <DataTable
          columns={[
            {
              id: 'userName',
              label: 'User Name',
              minWidth: 100,
            },
            {
              id: 'permissionSet',
              label: 'Permission Set',
              minWidth: 100,
              format: (item) => {
                return 'value';
              },
            },
            {
              id: 'actions',
              label: 'Actions',
              minWidth: 100,
              format: (item) => {
                return 'value';
              },
            },
          ]}
          rows={['hello']}
          emptyTitle="No Permissions Found"
        />
        {addUserDrawer && <AddUserDrawer label={addUserDrawer} onCloseDrawer={setAddUserDrawer} />}
      </TabContentWrapper>
    </ViewWrapper>
  );
};

export default Permissions;
