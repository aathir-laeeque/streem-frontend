import { RouteComponentProps, Router } from '@reach/router';
import React, { FC } from 'react';

import ChecklistComposer from './ChecklistComposer';
import ListView from './ListView';

const ChecklistView: FC<RouteComponentProps> = () => (
  <Router>
    <ListView path="/" />
    <ChecklistComposer path=":checklistId" />
  </Router>
);

export default ChecklistView;
