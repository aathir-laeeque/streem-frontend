import { RouteComponentProps, Router } from '@reach/router';
import React, { FC } from 'react';

import ChecklistComposer from './ChecklistComposer';
import ListView from './ListView';

import { ChecklistState, TemplateMode } from './ChecklistComposer/types';

const ChecklistView: FC<RouteComponentProps> = () => (
  <Router>
    <ListView path="/" />
    <ChecklistComposer
      path=":checklistId"
      checklistState={ChecklistState.EXECUTING}
      templateMode={TemplateMode.NON_EDITABLE}
    />
  </Router>
);

export default ChecklistView;
