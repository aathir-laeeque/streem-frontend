import { Router } from '@reach/router';
import React, { FC } from 'react';

import ListView from './ListView';
import { InboxViewProps } from './types';

import Composer from '#JobComposer';
import { Entity } from '#JobComposer/composer.types';

const InboxView: FC<InboxViewProps> = () => (
  <Router>
    <ListView path="/" />
    <Composer path="/:id" entity={Entity.JOB} />
  </Router>
);

export default InboxView;
