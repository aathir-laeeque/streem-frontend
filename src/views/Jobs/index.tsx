import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import { Router } from '@reach/router';
import React, { FC } from 'react';

import NewComposer from '../Checklists/NewComposer';
import ListView from './ListView';
import { JobsViewProps } from './types';

import Composer from '../../Composer';
import { Entity } from '../../Composer/types';

const JobsView: FC<JobsViewProps> = () => (
  <Router>
    <ListView path="/" />
    {/* <NewComposer path="/:jobId" composerState={ComposerState.EXECUTING} /> */}

    <Composer path="/:id" entity={Entity.JOB} />
  </Router>
);

export default JobsView;
