import { Router } from '@reach/router';
import React, { FC } from 'react';

import AddUser from './AddUser';
import UserAccess from './ListView';
import { UserAccessViewProps } from './types';

const UserAccessView: FC<UserAccessViewProps> = () => (
  <Router>
    <UserAccess path="/" />
    <AddUser path="add-user" />
  </Router>
);

export default UserAccessView;
