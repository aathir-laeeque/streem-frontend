import { Router } from '@reach/router';
import React, { FC } from 'react';

import Composer from './ChecklistComposer';
import ListView from './ListView';
import { ChecklistState } from './types';

const ChecklistView: FC = () => (
  <Router>
    <ListView path="/" />
    {/* This ChecklistState prop is temporary for now, will be taken care properly when editing mode is done */}
    <Composer path=":checklistId" checklistState={ChecklistState.VIEW} />
  </Router>
);

export default ChecklistView;
