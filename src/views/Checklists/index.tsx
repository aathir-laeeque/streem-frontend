import { RouteComponentProps, Router } from '@reach/router';
import React, { FC } from 'react';

import Composer from './ChecklistComposer';
import ListView from './ListView';
import NewComposer from './NewComposer';

const ChecklistView: FC<RouteComponentProps> = () => (
  <Router>
    <ListView path="/" />
    <Composer path=":checklistId" />

    <NewComposer path="/new/:checklistId" />
  </Router>
);

export default ChecklistView;
