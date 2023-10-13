import { Router } from '@reach/router';
import React, { FC } from 'react';
import Job from '#views/Job';
import ListView from './ListView';
import { InboxViewProps } from './types';

const InboxView: FC<InboxViewProps> = () => (
  <Router>
    <ListView path="/" />
    <Job path="/:id" />
  </Router>
);

export default InboxView;
