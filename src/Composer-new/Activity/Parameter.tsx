import { Select, TextInput } from '#components';
import { debounce } from 'lodash';
import React, { FC } from 'react';

import { ParameterWrapper } from './styles';
import { ActivityProps } from './types';

const OPERATORS = [
  { label: '( = ) Equal to', value: 'EQUAL_TO' },
  { label: '( < ) Less than', value: 'LESS_THAN' },
  { label: '( <= ) Less than equal to', value: 'LESS_THAN_EQUAL_TO' },
  { label: '( > ) More than', value: 'MORE_THAN' },
  { label: '( >= ) More than equal to', value: 'MORE_THAN_EQUAL_TO' },
  { label: '( <-> ) Between', value: 'BETWEEN' },
];

const ParameterActivity: FC<ActivityProps> = ({ activity }) => {
  console.log('parameter activity :: ', activity);

  return (
    <ParameterWrapper>
      <TextInput
        label="Parameter"
        defaultValue={activity.data.parameter}
        name="parameter"
        onChange={debounce(({ name, value }) => {
          console.log('field name :: ', name);
          console.log('updated value :: ', value);
        }, 500)}
      />

      <TextInput
        label="Unit of Measurement"
        defaultValue={activity.data.uom}
        name="uom"
        onChange={debounce(({ name, value }) => {
          console.log('field name :: ', name);
          console.log('updated value :: ', value);
        }, 500)}
      />

      <Select
        label="Criteria"
        placeHolder="Select"
        options={OPERATORS}
        onChange={(option) => {
          console.log('selected option  :: ', option);
        }}
        selectedValue={OPERATORS.find(
          (option) => option.value === activity.data.operator,
        )}
      />

      {activity.data.operator === 'BETWEEN' ? (
        <div className="between-values">
          <TextInput
            label="Value"
            defaultValue={activity.data.value}
            name="value"
            onChange={debounce(({ name, value }) => {
              console.log('field name :: ', name);
              console.log('updated value :: ', value);
            }, 500)}
          />

          <span>And</span>

          <TextInput
            label="Value"
            defaultValue={activity.data.value}
            name="value"
            onChange={debounce(({ name, value }) => {
              console.log('field name :: ', name);
              console.log('updated value :: ', value);
            }, 500)}
          />
        </div>
      ) : (
        <TextInput
          label="Value"
          defaultValue={activity.data.value}
          name="value"
          onChange={debounce(({ name, value }) => {
            console.log('field name :: ', name);
            console.log('updated value :: ', value);
          }, 500)}
        />
      )}
    </ParameterWrapper>
  );
};

export default ParameterActivity;
