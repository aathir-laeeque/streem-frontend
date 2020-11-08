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
        placeholder="Select"
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
            defaultValue={activity.data?.lowerValue}
            error={
              !activity.data?.lowerValue &&
              activity.errors.find((error) => error.code === 'E416')?.message
            }
            label="Value"
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
            defaultValue={activity.data?.upperValue}
            error={
              !activity.data?.upperValue &&
              activity.errors.find((error) => error.code === 'E416')?.message
            }
            label="Value"
            name="upperValue"
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
          defaultValue={activity.data.value}
          error={
            !activity.data?.value &&
            activity.errors.find((error) => error.code === 'E416')?.message
          }
          label="Value"
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
