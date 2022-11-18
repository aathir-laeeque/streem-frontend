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
  margin-bottom: 16px;

  @media (min-width: 1920px) {
    max-width: 1200px;
    margin: 0 auto 32px;
  }
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
