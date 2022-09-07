import { ActivityItemInput } from '#components';
import { Error } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateActivityApi, updateStoreActivity } from './actions';
import { YesNoWrapper } from './styles';
import { ActivityProps, YesNoActivityErrors } from './types';

const YesNoActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();

  const [componentLoaded, updateComponentLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (componentLoaded) {
      dispatch(updateActivityApi(activity));
    } else if (activity) {
      updateComponentLoaded(true);
    }
  }, [activity]);

  const activityErrors = activity.errors.filter((error) => error.code in YesNoActivityErrors);

  const isErrorPresent = !!activityErrors.length;

  return (
    <YesNoWrapper>
      {isErrorPresent ? (
        <div className="activity-error top">
          <Error />
          Activity Incomplete
        </div>
      ) : null}

      <ActivityItemInput
        defaultValue={activity.label}
        error={
          isErrorPresent && !activity.label
            ? activityErrors.find((error) => error.code === 'E409')?.message
            : null
        }
        label="Ask a question"
        name="label"
        customOnChange={(value) => {
          dispatch(updateStoreActivity(value, activity.id, ['label']));
        }}
      />

      <div className="options-container">
        {activity.data
          .sort((a, b) => (a.type > b.type ? -1 : 1))
          .map((item, index: number) => (
            <ActivityItemInput
              defaultValue={item.name}
              error={
                isErrorPresent && !item.name
                  ? activityErrors.find((error) => error.code === 'E407')?.message
                  : null
              }
              key={index}
              label={item.type === 'yes' ? 'Positive Response' : 'Negative Response'}
              name={item.type}
              customOnChange={(value) => {
                dispatch(updateStoreActivity(value, activity.id, ['data', index, 'name']));
              }}
            />
          ))}
      </div>
    </YesNoWrapper>
  );
};

export default YesNoActivity;
