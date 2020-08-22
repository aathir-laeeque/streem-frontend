import React, { FC } from 'react';
import {
  Button,
  Role,
  HeaderWithBack,
  Thumbnail,
  LabeledInfo,
} from '#components';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '#store';
import { navigate } from '@reach/router';
import { Composer } from './styles';
import { ViewUserProps } from './types';
import { permissions, roles } from '../AddUser/temp';

const ViewUser: FC<ViewUserProps> = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useTypedSelector((state) => state.users);
  if (!selectedUser) {
    return <div>Loading...</div>;
  }

  return (
    <Composer>
      <HeaderWithBack
        heading={`${selectedUser.firstName} ${selectedUser.lastName}`}
        actionText="Back to User Management"
        onActionPress={() => navigate(-1)}
      />
      <div className="main">
        <div className="content">
          <Thumbnail
            title={`${selectedUser?.firstName} ${selectedUser?.lastName}`}
            subTitle={selectedUser.employeeId}
            status={
              !selectedUser.verified && !selectedUser.archived
                ? 'Unregistered'
                : selectedUser.verified && !selectedUser.archived
                ? 'Active'
                : 'Archived'
            }
            source={{
              firstName: selectedUser?.firstName || '',
              lastName: selectedUser?.lastName || '',
            }}
            id="avatar"
            disabled
          />
          <div className="flex-row">
            <div className="sub-heading bold">Basic Information</div>
          </div>
          <div className="flex-row">
            <div className="flex-col right-gutter">
              <LabeledInfo label="Email ID" value={selectedUser.email} />
            </div>
            <div className="flex-col left-gutter">
              <LabeledInfo
                label="Department"
                value={selectedUser.department || '-N/A-'}
              />
            </div>
          </div>
          <div className="flex-row">
            <div className="flex-col right-gutter">
              <LabeledInfo label="Last Active" value="09 Jul 2020" />
            </div>
            <div className="flex-col left-gutter" />
          </div>
          <div className="partition" style={{ marginTop: '16px' }} />
          <div className="sub-heading bold">Roles</div>
          <div className="flex-row" style={{ paddingBottom: 0 }}>
            <div className="flex-col right-gutter">
              <Role
                permissions={permissions}
                roles={roles}
                placeHolder={
                  selectedUser?.roles && selectedUser?.roles[0]
                    ? selectedUser?.roles[0].name
                    : 'N/A'
                }
                label="Role"
                id="roles"
                disabled
                selected={
                  selectedUser?.roles && selectedUser?.roles[0]
                    ? selectedUser?.roles[0].id
                    : 3
                }
                viewing
              />
            </div>
            <div className="flex-col left-gutter" />
          </div>
          <div className="partition" />
          <div className="sub-heading bold">Facilities</div>
          <div className="flex-row">
            <div className="flex-col right-gutter">
              {selectedUser.facilities?.map((facility) => (
                <div className="facilities" key={`${facility.id}`}>
                  <span>•&nbsp;&nbsp;&nbsp;{facility.name}</span>
                </div>
              ))}
            </div>
            <div className="flex-col left-gutter" />
          </div>
        </div>
        <div className="actions">
          <Button className="primary-button">Save Changes</Button>
          <div className="flex-row">
            <Button
              className="primary-button flat"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Composer>
  );
};

export default ViewUser;
