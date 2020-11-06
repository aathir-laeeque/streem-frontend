import { Router } from '@reach/router';
import React, { FC } from 'react';

import Composer from '../../Composer';
import { Entity } from '../../Composer/composer.types';
// import ListView from './ListView';
import NewListView from './NewListView';
import { JobsViewProps } from './types';

const JobsView: FC<JobsViewProps> = () => (
  <Router>
    {/* <ListView path="/" /> */}
    <NewListView path="/" />

    <Composer path="/:id" entity={Entity.JOB} />
  </Router>
);

export default JobsView;
