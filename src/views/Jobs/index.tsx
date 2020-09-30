import { Router } from '@reach/router';
import React, { FC } from 'react';

import Composer from '../../Composer';
import { Entity } from '../../Composer/composer.types';
import ListView from './ListView';
import { JobsViewProps } from './types';

const JobsView: FC<JobsViewProps> = () => (
  <Router>
    <ListView path="/" />

    <Composer path="/:id" entity={Entity.JOB} />
  </Router>
);

export default JobsView;
