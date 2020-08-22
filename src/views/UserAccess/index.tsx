import { Router } from '@reach/router';
import React, { FC } from 'react';

import AddUser from './AddUser';
import ViewUser from './ViewUser';
import ListView from './ListView';
import { UserAccessViewProps } from './types';

const UserAccessView: FC<UserAccessViewProps> = () => (
  <Router>
    <ListView path="/" />
    <AddUser path="add-user" />
    <ViewUser path="view-user" />
  </Router>
);

export default UserAccessView;
