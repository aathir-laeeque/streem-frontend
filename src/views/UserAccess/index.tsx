import { Router } from '@reach/router';
import React, { FC } from 'react';

import { PAGE_TYPE } from './ManageUser/types';
import EditUser from './ManageUser';
import ListView from './ListView';
import { UserAccessViewProps } from './types';

const UserAccessView: FC<UserAccessViewProps> = () => (
  <Router>
    <ListView path="/" />
    <EditUser path="add" pageType={PAGE_TYPE.ADD} />
    <EditUser path="profile/:id" pageType={PAGE_TYPE.PROFILE} />
    <EditUser path="edit/:id" pageType={PAGE_TYPE.EDIT} />
  </Router>
);

export default UserAccessView;
