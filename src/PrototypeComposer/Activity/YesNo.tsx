import { ActivityItemInput } from '#components';
import { Error } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivity } from './actions';
import { YesNoWrapper } from './styles';
import { ActivityProps } from './types';

const YesNoActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();

  const activityError = activity.errors.find((error) => error.code === 'E407');

  return (
    <YesNoWrapper>
      {activityError ? (
        <div className="activity-error top">
          <Error />
          Activity Incomplete
        </div>
      ) : null}
      <ActivityItemInput
        defaultValue={activity.label}
        error={
          !activity.label &&
          activity.errors.find((error) => error.code === 'E409')?.message
        }
        label="Ask a question"
        name="label"
        customOnChange={(value) => {
          dispatch(updateActivity({ ...activity, label: value }));
        }}
      />

      <div className="options-container">
        {activity.data
          .sort((a, b) => (a.type > b.type ? -1 : 1))
          .map((item, index) => (
            <ActivityItemInput
              defaultValue={item.name}
              error={!item.name && activityError?.message}
              key={index}
              label={
                item.type === 'yes' ? 'Positive Response' : 'Negative Response'
              }
              name={item.type}
              customOnChange={(value) => {
                dispatch(
                  updateActivity({
                    ...activity,
                    data: [
                      ...activity.data.slice(0, index),
                      { ...item, name: value },
                      ...activity.data.slice(index + 1),
                    ],
                  }),
                );
              }}
            />
          ))}
      </div>
    </YesNoWrapper>
  );
};

export default YesNoActivity;
