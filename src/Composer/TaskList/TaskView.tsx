import React, { FC } from 'react';
import styled from 'styled-components';

import { TaskViewProps } from './types';

const Wrapper = styled.div.attrs({
  className: 'task-list-item',
})`
  margin-bottom: 16px;
`;

const TaskView: FC<TaskViewProps> = ({ task, isActive }) => {
  return <Wrapper>{task.name}</Wrapper>;
};

export default TaskView;
