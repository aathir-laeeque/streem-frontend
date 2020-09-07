import React, { FC } from 'react';
import styled from 'styled-components';

import { TaskViewProps } from '../types';
import TaskCard from './TaskCard';
import MediaCard from './MediaCard';

const Wrapper = styled.div.attrs({
  className: 'task-list-item',
})`
  display: grid;
  grid-column-gap: 16px;
  grid-template-areas: 'task-card task-media-card';
  grid-template-columns: 1.75fr 1fr;
  margin-bottom: 32px;
`;

const TaskView: FC<TaskViewProps> = ({ task, isActive }) => (
  <Wrapper>
    <TaskCard task={task} isActive={isActive} />

    <MediaCard medias={task.medias} isTaskActive={isActive} />
  </Wrapper>
);

export default TaskView;
