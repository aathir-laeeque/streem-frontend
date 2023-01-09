import { FormGroup } from '#components';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import React, { FC } from 'react';
import moment from 'moment';
import { InputTypes } from '#utils/globalTypes';

const SingleLineTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, form }) => {
  const { setValue } = form;

  const valueChecker = (value, type) => {
    let date;
    switch (type) {
      case InputTypes.DATE:
        date = moment.unix(parseInt(value));
        return date.format('Do MMM YYYY');
      case InputTypes.DATE_TIME:
        date = moment.unix(parseInt(value));
        return date.format('Do MMM YYYY h:mm:ss A');
      case InputTypes.SINGLE_LINE:
      case InputTypes.MULTI_LINE:
      case InputTypes.NUMBER:
        return value;
      default:
        return;
    }
  };

  return (
    <FormGroup
      style={{ padding: 0 }}
      inputs={[
        {
          type: parameter.type,
          props: {
            onChange: (value: any) => {
              setValue(
                `data.${parameter.id}`,
                {
                  ...parameter,
                  data: { ...parameter.data, input: valueChecker(value.value, parameter.type) },
                  response: {
                    value: valueChecker(value.value, parameter.type),
                    reason: '',
                    state: 'EXECUTED',
                    choices: {},
                    medias: [],
                    parameterValueApprovalDto: null,
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
