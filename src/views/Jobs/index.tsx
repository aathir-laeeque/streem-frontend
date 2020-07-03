import { Router } from '@reach/router';
import React, { FC } from 'react';

import ChecklistComposer from '../Checklists/ChecklistComposer';
import {
  ChecklistState,
  TemplateMode,
} from '../Checklists/ChecklistComposer/types';
import ListView from './ListView';
import { JobsViewProps } from './types';

const JobsView: FC<JobsViewProps> = () => (
  <Router>
    <ListView path="/" />
    <ChecklistComposer
      path=":jobId"
      checklistState={ChecklistState.EXECUTING}
      templateMode={TemplateMode.NON_EDITABLE}
    />
  </Router>
);

export default JobsView;
