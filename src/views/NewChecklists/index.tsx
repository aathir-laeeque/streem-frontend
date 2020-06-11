import React, { FC } from 'react';
import { Router } from '@reach/router';
import ListView from './ListView';
import ChecklistComposer from './ChecklistComposer';

const ChecklistView: FC = () => (
  <Router>
    <ListView path="/" />
    <ChecklistComposer path=":checklistId" />
  </Router>
);

export default ChecklistView;
