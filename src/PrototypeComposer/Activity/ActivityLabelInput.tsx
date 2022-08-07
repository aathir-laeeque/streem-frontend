import React, { useEffect, useState } from 'react';
import { TextInput } from '#components';
import { useDispatch } from 'react-redux';
import { updateActivityApi, updateStoreActivity } from './actions';
import { Activity } from './types';

const ActivityLabelInput = ({
  activity,
  isControlled = false,
}: {
  activity: Activity;
  isControlled?: boolean;
}) => {
  const [componentLoaded, updateComponentLoaded] = useState<boolean>(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isControlled) {
      if (componentLoaded) {
        dispatch(updateActivityApi(activity));
      } else if (activity) {
        updateComponentLoaded(true);
      }
    }
  }, [activity]);

  return (
    <TextInput
      placeholder="Enter Label For Activity"
      label="Enter Label For Activity"
      className="activity-label-input"
      defaultValue={activity?.label}
      error={
        (activity.errors.length &&
          activity.errors.find((error) => error.code === 'E439')?.message) ||
        null
      }
      onBlur={(e) => {
        dispatch(updateStoreActivity(e.target.value, activity.id, ['label']));
      }}
    />
  );
};

export default ActivityLabelInput;
