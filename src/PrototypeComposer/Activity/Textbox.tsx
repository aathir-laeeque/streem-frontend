import React, { FC } from 'react';
import ActivityLabelInput from './ActivityLabelInput';
import { TextboxWrapper } from './styles';
import { ActivityProps } from './types';

const TextboxActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  return (
    <TextboxWrapper>
      <label>User Comments Box</label>
      <ActivityLabelInput activity={activity} />
      <div className="textbox">Users will write their comments here</div>
    </TextboxWrapper>
  );
};

export default TextboxActivity;
