import { TextInput } from '#components';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { MandatoryParameter } from '#PrototypeComposer/checklist.types';
import React, { FC } from 'react';

const SingleLineTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter }) => {
  return (
    <TextInput
      disabled
      type={
        parameter.type === MandatoryParameter.MULTI_LINE ? 'text' : parameter.type.toLowerCase()
      }
    />
  );
};

export default SingleLineTaskView;
