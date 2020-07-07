import { Router } from '@reach/router';
import React, { FC } from 'react';

import Composer from './ChecklistComposer';
import ListView from './ListView';

const ChecklistView: FC = () => (
  <Router>
    <ListView path="/" />
    <Composer path=":checklistId" />
  </Router>
);

export default ChecklistView;
