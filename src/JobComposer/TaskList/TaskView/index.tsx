import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { TaskViewProps } from '../types';
import TaskCard from './TaskCard';

const Wrapper = styled.div.attrs({
  className: 'task-list-item',
})`
  display: grid;
  grid-column-gap: 16px;
  grid-template-areas: 'task-card ';
  grid-template-columns: 1fr;
  overflow: hidden;
`;

type Ref = HTMLDivElement;

const TaskView = forwardRef<Ref, TaskViewProps>((props, ref) => {
  return (
    <Wrapper ref={ref}>
      <TaskCard {...props} />
    </Wrapper>
  );
});

TaskView.displayName = 'TaskView';

export default TaskView;
