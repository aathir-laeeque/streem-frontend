import { PARAMETER_OPERATORS } from '#PrototypeComposer/constants';
import { FormGroup } from '#components';
import { InputTypes } from '#utils/globalTypes';
import React, { FC, useEffect } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { CommonWrapper } from './styles';

const ParameterParameter: FC<{ form: UseFormMethods<any>; isReadOnly: boolean }> = ({
  form,
  isReadOnly,
}) => {
  const { register, watch, setValue } = form;
  register('data.operator', { required: true });
  register('data.id');
  const operator = watch('data.operator');
  const data = watch('data');

  useEffect(() => {
    if (!data?.id) {
      setValue('data.id', uuidv4(), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, []);

  return (
    <CommonWrapper>
      <FormGroup
        inputs={[
          {
            type: InputTypes.SINGLE_LINE,
            props: {
              id: 'uom',
              label: 'Unit of Measurement',
              placeholder: 'Write here in smallcase characters',
              name: 'data.uom',
              disabled: isReadOnly,
              optional: true,
              ref: register({
                pattern: /^[a-z]+$/, // This regex allows only lowercase letters
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
              isDisabled: isReadOnly,
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
                    type: 'number',
                    name: 'data.lowerValue',
                    disabled: isReadOnly,
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
                    type: 'number',
                    name: 'data.upperValue',
                    disabled: isReadOnly,
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
                    type: 'number',
                    name: 'data.value',
                    disabled: isReadOnly,
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
