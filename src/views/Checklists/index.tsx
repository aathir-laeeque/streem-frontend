import { RouteComponentProps, Router } from '@reach/router';
import React, { FC } from 'react';

import ListView from './ListView';
import NewComposer from './NewComposer';

const ChecklistView: FC<RouteComponentProps> = () => (
  <Router>
    <ListView path="/" />
    <NewComposer path="/:checklistId" />
  </Router>
);

export default ChecklistView;
