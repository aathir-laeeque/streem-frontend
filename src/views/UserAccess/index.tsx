import { Router } from '@reach/router';
import React, { FC } from 'react';

import AddUser from './AddUser';
import EditUser from './EditUser';
import ListView from './ListView';
import { UserAccessViewProps } from './types';

const UserAccessView: FC<UserAccessViewProps> = () => (
  <Router>
    <ListView path="/" />
    <AddUser path="add-user" />
    <EditUser path="edit-user" />
  </Router>
);

export default UserAccessView;
