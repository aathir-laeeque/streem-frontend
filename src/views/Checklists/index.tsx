import Composer from '#PrototypeComposer';
import { ComposerEntity } from '#PrototypeComposer/types';
import { RouteComponentProps, Router } from '@reach/router';
import React, { FC } from 'react';

import ListView from './ListView';
import NewPrototype from './NewPrototype';

const ChecklistView: FC<RouteComponentProps> = () => (
  <Router>
    <ListView path="/" />

    <Composer path="/:id" entity={ComposerEntity.CHECKLIST} />

    <NewPrototype path="/prototype" />
  </Router>
);

export default ChecklistView;
