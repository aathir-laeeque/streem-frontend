import { Select, TextInput, NumberInput } from '#components';
import { Error } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC } from 'react';
import { PARAMETER_OPERATORS } from '#PrototypeComposer/constants';

import { ParameterWrapper } from './styles';
import { ActivityProps, ParameterActivityErrors } from './types';
import { useDispatch } from 'react-redux';
import { updateActivity } from './actions';

const ParameterActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();

  const activityErrors = activity.errors.filter(
    (error) => error.code in ParameterActivityErrors,
  );

  const isErrorPresent = !!activityErrors.length;

  return (
    <ParameterWrapper
      errorInSelect={(isErrorPresent && !activity.data.operator) || false}
    >
      {isErrorPresent ? (
        <div className="activity-error top">
          <Error />
          Activity Incomplete
        </div>
      ) : null}

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
        error={isErrorPresent && !activity.data.parameter}
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
        error={isErrorPresent && !activity.data.uom}
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
        error={isErrorPresent && !activity.data.operator}
      />

      {activity.data.operator === 'BETWEEN' ? (
        <div className="between-values">
          <NumberInput
            defaultValue={activity.data?.lowerValue}
            error={
              isErrorPresent
                ? activityErrors.find(
                    (error) => error.code === 'E416' || error.code === 'E417',
                  )?.message
                : null
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

          <NumberInput
            defaultValue={activity.data?.upperValue}
            error={
              isErrorPresent
                ? activityErrors.find(
                    (error) => error.code === 'E416' || error.code === 'E417',
                  )?.message
                : null
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
        <NumberInput
          defaultValue={activity.data.value}
          error={
            isErrorPresent
              ? activityErrors.find(
                  (error) => error.code === 'E416' || error.code === 'E417',
                )?.message
              : null
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
