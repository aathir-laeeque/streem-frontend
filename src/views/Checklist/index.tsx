import { Router } from '@reach/router';
import React, { FC } from 'react';

import AddEditView from './AddEditView';
import ListView from './ListView';

import { ChecklistViewProps } from './types';

const ChecklistView: FC<ChecklistViewProps> = () => (
  <Router>
    <ListView path="/" />
    <AddEditView path=":checklistId" />
  </Router>
);

export default ChecklistView;
