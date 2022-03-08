import Composer from '#PrototypeComposer';
import ActivityView from '#PrototypeComposer/ChecklistActivity';
import { ComposerEntity } from '#PrototypeComposer/types';
import { RouteComponentProps, Router } from '@reach/router';
import React, { FC } from 'react';
import ListView from './ListView';
import NewPrototype from './NewPrototype';

const ChecklistView: FC<RouteComponentProps> = () => (
  <Router>
    <ListView path="/" />
    <Composer path="/:id" entity={ComposerEntity.CHECKLIST} />
    <ActivityView path="/:id/activites" />
    <NewPrototype path="/prototype" />
  </Router>
);

export default ChecklistView;
