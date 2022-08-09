import React, { FC } from 'react';
import ActivityLabelInput from './ActivityLabelInput';
import { TextboxWrapper } from './styles';
import { ActivityProps } from './types';

const NumberActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  return (
    <TextboxWrapper>
      <label>Number Activity</label>
      <ActivityLabelInput activity={activity} />
      <div className="textbox" style={{ padding: 20 }}>
        Users will write their input here
      </div>
    </TextboxWrapper>
  );
};

export default NumberActivity;
