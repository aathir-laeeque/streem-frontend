import { Select, TextInput, NumberInput } from '#components';
import { Error } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { PARAMETER_OPERATORS } from '#PrototypeComposer/constants';

import { ParameterWrapper } from './styles';
import { ActivityProps, ParameterActivityErrors } from './types';
import { useDispatch } from 'react-redux';
import { updateActivityApi, updateStoreActivity } from './actions';
import { Option } from '#components/shared/Select';

const ParameterActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();
  const [componentLoaded, updateComponentLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (componentLoaded) {
      dispatch(updateActivityApi(activity));
    } else if (activity) {
      updateComponentLoaded(true);
    }
  }, [activity]);

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
          dispatch(updateStoreActivity(value, activity.id, ['data', name]));
        }, 500)}
        error={
          isErrorPresent && !activity.data.parameter
            ? activityErrors.find((error) => error.code === 'E431')?.message
            : null
        }
      />

      <TextInput
        label="Unit of Measurement"
        defaultValue={activity.data.uom}
        name="uom"
        onChange={debounce(({ name, value }) => {
          dispatch(updateStoreActivity(value, activity.id, ['data', name]));
        }, 500)}
        error={
          isErrorPresent && !activity.data.uom
            ? activityErrors.find((error) => error.code === 'E430')?.message
            : null
        }
      />

      <Select
        label="Criteria"
        placeholder="Select"
        options={PARAMETER_OPERATORS}
        onChange={(option) => {
          dispatch(
            updateStoreActivity((option as Option).value, activity.id, [
              'data',
              'operator',
            ]),
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
              isErrorPresent && !activity.data?.lowerValue
                ? activityErrors.find((error) => error.code === 'E417')?.message
                : isErrorPresent
                ? activityErrors.find((error) => error.code === 'E432')?.message
                : null
            }
            label="Value"
            name="lowerValue"
            onChange={debounce(({ name, value }) => {
              dispatch(updateStoreActivity(value, activity.id, ['data', name]));
            }, 500)}
          />

          <span>And</span>

          <NumberInput
            defaultValue={activity.data?.upperValue}
            error={
              isErrorPresent && !activity.data?.upperValue
                ? activityErrors.find((error) => error.code === 'E417')?.message
                : null
            }
            label="Value"
            name="upperValue"
            onChange={debounce(({ name, value }) => {
              dispatch(updateStoreActivity(value, activity.id, ['data', name]));
            }, 500)}
          />
        </div>
      ) : (
        <NumberInput
          defaultValue={activity.data.value}
          error={
            isErrorPresent && !activity.data?.value
              ? activityErrors.find((error) => error.code === 'E417')?.message
              : null
          }
          label="Value"
          name="value"
          onChange={debounce(({ name, value }) => {
            dispatch(updateStoreActivity(value, activity.id, ['data', name]));
          }, 500)}
        />
      )}
    </ParameterWrapper>
  );
};

export default ParameterActivity;
