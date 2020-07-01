import { Router } from '@reach/router';
import React, { FC } from 'react';

import ChecklistComposer from '../Checklists/ChecklistComposer';
import {
  ChecklistState,
  TemplateMode,
} from '../Checklists/ChecklistComposer/types';
import ListView from './ListView';
import { TasksViewProps } from './types';

const TasksView: FC<TasksViewProps> = () => (
  <Router>
    <ListView path="/" />
    <ChecklistComposer
      path=":taskId"
      checklistState={ChecklistState.EXECUTING}
      templateMode={TemplateMode.NON_EDITABLE}
    />
  </Router>
);

export default TasksView;
