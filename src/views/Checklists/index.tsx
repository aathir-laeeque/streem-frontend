import { RouteComponentProps, Router } from '@reach/router';
import React, { FC } from 'react';

import ListView from './ListView';
import NewComposer from './NewComposer';
import Composer from '../../Composer';
import { Entity } from '../../Composer/composer.types';

const ChecklistView: FC<RouteComponentProps> = () => (
  <Router>
    <ListView path="/" />
    {/* <NewComposer path="/:checklistId" /> */}

    <Composer path="/:id" entity={Entity.CHECKLIST} />
  </Router>
);

export default ChecklistView;
