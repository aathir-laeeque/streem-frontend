import { Router } from '@reach/router';
import React, { FC } from 'react';

import ListView from './ListView';

import { TasksViewProps } from './types';

const TasksView: FC<TasksViewProps> = () => (
  <Router>
    <ListView path="/" />
  </Router>
);

export default TasksView;
