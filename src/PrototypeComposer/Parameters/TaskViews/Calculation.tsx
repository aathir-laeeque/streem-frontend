import { TextInput } from '#components';
import { ActivityProps } from '#PrototypeComposer/Activity/types';
import React, { FC } from 'react';

const CalculationTaskView: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  return <TextInput disabled placeholder="" value={activity.data.expression} />;
};

export default CalculationTaskView;
