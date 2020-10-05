import React, { FC } from 'react';

import { TextboxWrapper } from './styles';
import { ActivityProps } from './types';

const TextboxActivity: FC<Omit<ActivityProps, 'taskId'>> = ({}) => {
  return (
    <TextboxWrapper>
      <label>User Comments Box</label>
      <div className="textbox">Users will write comment here</div>
    </TextboxWrapper>
  );
};

export default TextboxActivity;
