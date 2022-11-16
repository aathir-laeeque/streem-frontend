import { TextInput } from '#components';
import { ActivityProps } from '#PrototypeComposer/Activity/types';
import { MandatoryActivity } from '#PrototypeComposer/checklist.types';
import React, { FC } from 'react';

const SingleLineTaskView: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  return (
    <TextInput
      disabled
      type={activity.type === MandatoryActivity.TEXTBOX ? 'text' : activity.type.toLowerCase()}
    />
  );
};

export default SingleLineTaskView;
