import { Button1 } from '#components';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { executeActivity, fixActivity } from './actions';
import { ActivityProps } from './types';

const CalculationActivity: FC<ActivityProps> = ({
  activity,
  isCorrectingError,
  isTaskCompleted,
}) => {
  const dispatch = useDispatch();
  const {
    activities: { activitiesById },
  } = useTypedSelector((state) => state.composer);

  return (
    <div className="calculation-activity">
      <span className="head">Calculation</span>
      <span className="expression">
        {activity.label} = {activity.data.expression}
      </span>
      <span className="head">Input(s)</span>
      {Object.entries(activity.data.variables).map(([key, value]: any) => {
        return (
          <span className="variable">
            <span className="name">{key}</span>
            {value.label && (
              <span className="value">
                : {activitiesById?.[value.activityId]?.response?.value || '-N/A-'}
              </span>
            )}
          </span>
        );
      })}
      {(isCorrectingError || !isTaskCompleted) && (
        <Button1
          style={{ marginTop: 24, maxWidth: 100 }}
          variant="secondary"
          onClick={() => {
            if (isCorrectingError) {
              dispatch(fixActivity(activity));
            } else {
              dispatch(executeActivity(activity));
            }
          }}
        >
          Calculate
        </Button1>
      )}
      {activity?.response?.value && (
        <>
          <span className="head" style={{ marginTop: 24 }}>
            Result
          </span>
          <span className="result">
            {activity.label} = {activity.response.value} {activity.data.uom}
          </span>
        </>
      )}
    </div>
  );
};

export default CalculationActivity;
