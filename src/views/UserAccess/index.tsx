import { Router } from '@reach/router';
import React, { FC } from 'react';

import AddUser from './AddUser';
import ViewUser from './ViewUser';
import EditUser from './EditUser';
import ListView from './ListView';
import { UserAccessViewProps } from './types';

//TODO Rename EditUser to ViewUser and change edit-user path to view-user if Curreent ViewUser isn't get used.

const UserAccessView: FC<UserAccessViewProps> = () => (
  <Router>
    <ListView path="/" />
    <AddUser path="add-user" />
    <ViewUser path="view-user" />
    <EditUser path="edit-user" />
  </Router>
);

export default UserAccessView;
