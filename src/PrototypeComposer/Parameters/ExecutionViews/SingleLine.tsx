import { FormGroup, TextInput } from '#components';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import React, { FC } from 'react';

const SingleLineTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, form }) => {
  const { register, watch, setValue } = form;
  const data = watch('data', {});

  register('data', {
    required: true,
  });

  console.log('zero five two', parameter);

  return (
    <FormGroup
      style={{ padding: 0 }}
      inputs={[
        {
          type: parameter.type,
          props: {
            onChange: (value: any) => {
              setValue(
                'data',
                {
                  ...data,
                  [parameter.id]: {
                    ...parameter,
                    data: { ...parameter.data, input: value.value },
                    response: {
                      value: value.value,
                      reason: '',
                      state: 'EXECUTED',
                      choices: {},
                      medias: [],
                      parameterValueApprovalDto: null,
                    },
                  },
                },
                {
                  shouldDirty: true,
                  shouldValidate: true,
                },
              );
            },
          },
        },
      ]}
    />
  );
};

export default SingleLineTaskView;
