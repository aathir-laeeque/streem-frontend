import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import { Router } from '@reach/router';
import React, { FC } from 'react';

import ChecklistComposer from '../Checklists/ChecklistComposer';
import NewComposer from '../Checklists/NewComposer';
import { ChecklistState } from '../Checklists/types';
import ListView from './ListView';
import { JobsViewProps } from './types';

const JobsView: FC<JobsViewProps> = () => (
  <Router>
    <ListView path="/" />
    <ChecklistComposer
      path=":jobId"
      checklistState={ChecklistState.EXECUTING}
    />

    <NewComposer path="/new/:jobId" composerState={ComposerState.EXECUTING} />
  </Router>
);

export default JobsView;
