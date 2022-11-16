import { FormGroup } from '#components';
import { PARAMETER_OPERATORS } from '#PrototypeComposer/constants';
import { InputTypes } from '#utils/globalTypes';
import React, { FC } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { CommonWrapper } from './styles';

const ParameterParameter: FC<{ form: UseFormMethods<any> }> = ({ form }) => {
  const { register, watch, setValue } = form;
  register('data.operator', { required: true });
  const operator = watch('data.operator');

  return (
    <CommonWrapper>
      <FormGroup
        inputs={[
          {
            type: InputTypes.SINGLE_LINE,
            props: {
              id: 'uom',
              label: 'Unit of Measurement',
              placeholder: 'Write Here',
              name: 'data.uom',
              ref: register({
                required: true,
              }),
            },
          },
          {
            type: InputTypes.SINGLE_SELECT,
            props: {
              id: 'operator',
              label: 'Criteria',
              options: PARAMETER_OPERATORS,
              defaultValue: operator
                ? PARAMETER_OPERATORS.filter((o) => operator === o.value)
                : undefined,
              isSearchable: false,
              placeholder: 'Choose an option',
              onChange: (value: any) => {
                setValue('data.operator', value.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              },
            },
          },
        ]}
      />
      <FormGroup
        className="form-row"
        inputs={
          operator === 'BETWEEN'
            ? [
                {
                  type: InputTypes.SINGLE_LINE,
                  props: {
                    id: 'lowerValue',
                    label: 'Lower Value',
                    placeholder: 'Write Here',
                    name: 'data.lowerValue',
                    ref: register({
                      required: true,
                    }),
                  },
                },
                {
                  type: InputTypes.SINGLE_LINE,
                  props: {
                    id: 'upperValue',
                    label: 'Upper Value',
                    placeholder: 'Write Here',
                    name: 'data.upperValue',
                    ref: register({
                      required: true,
                    }),
                  },
                },
              ]
            : [
                {
                  type: InputTypes.SINGLE_LINE,
                  props: {
                    id: 'value',
                    label: 'Value',
                    placeholder: 'Write Here',
                    name: 'data.value',
                    ref: register({
                      required: true,
                    }),
                  },
                },
              ]
        }
      />
    </CommonWrapper>
  );
};

export default ParameterParameter;
