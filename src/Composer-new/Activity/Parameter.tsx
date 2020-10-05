import { Select, TextInput } from '#components';
import { debounce } from 'lodash';
import React, { FC } from 'react';
import { PARAMETER_OPERATORS } from '#Composer-new/constants';

import { ParameterWrapper } from './styles';
import { ActivityProps } from './types';
import { useDispatch } from 'react-redux';
import { updateActivity } from './actions';

const ParameterActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();

  return (
    <ParameterWrapper>
      <TextInput
        label="Parameter"
        defaultValue={activity.data.parameter}
        name="parameter"
        onChange={debounce(({ name, value }) => {
          dispatch(
            updateActivity({
              ...activity,
              data: { ...activity.data, [name]: value },
            }),
          );
        }, 500)}
      />

      <TextInput
        label="Unit of Measurement"
        defaultValue={activity.data.uom}
        name="uom"
        onChange={debounce(({ name, value }) => {
          dispatch(
            updateActivity({
              ...activity,
              data: { ...activity.data, [name]: value },
            }),
          );
        }, 500)}
      />

      <Select
        label="Criteria"
        placeHolder="Select"
        options={PARAMETER_OPERATORS}
        onChange={(option) => {
          dispatch(
            updateActivity({
              ...activity,
              data: { ...activity.data, operator: option.value },
            }),
          );
        }}
        selectedValue={PARAMETER_OPERATORS.find(
          (option) => option.value === activity.data.operator,
        )}
      />

      {activity.data.operator === 'BETWEEN' ? (
        <div className="between-values">
          <TextInput
            label="Value"
            defaultValue={activity.data?.lowerValue}
            name="lowerValue"
            onChange={debounce(({ name, value }) => {
              dispatch(
                updateActivity({
                  ...activity,
                  data: { ...activity.data, [name]: value },
                }),
              );
            }, 500)}
          />

          <span>And</span>

          <TextInput
            label="Value"
            defaultValue={activity.data?.upperValue}
            name="uperValue"
            onChange={debounce(({ name, value }) => {
              dispatch(
                updateActivity({
                  ...activity,
                  data: { ...activity.data, [name]: value },
                }),
              );
            }, 500)}
          />
        </div>
      ) : (
        <TextInput
          label="Value"
          defaultValue={activity.data.value}
          name="value"
          onChange={debounce(({ name, value }) => {
            dispatch(
              updateActivity({
                ...activity,
                data: { ...activity.data, [name]: value },
              }),
            );
          }, 500)}
        />
      )}
    </ParameterWrapper>
  );
};

export default ParameterActivity;
