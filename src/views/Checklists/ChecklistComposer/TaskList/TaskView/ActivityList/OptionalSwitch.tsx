import { useTypedSelector } from '#store';
import { Switch, FormControlLabel } from '@material-ui/core';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivity } from './Activity/actions';
import { OptionalSwitchProps } from './types';

const OptionalSwitch: FC<OptionalSwitchProps> = ({ activityId }) => {
  const activity = useTypedSelector(
    (state) => state.checklist.composer.activities.list[activityId],
  );

  const dispatch = useDispatch();

  const handleChange = () =>
    dispatch(updateActivity({ ...activity, mandatory: !activity.mandatory }));

  if (activity) {
    return (
      <div className="optional-switch">
        <FormControlLabel
          className="optional-switch-label"
          control={
            <Switch
              color="default"
              checked={activity.mandatory}
              onChange={handleChange}
            />
          }
          label="Optional"
          labelPlacement="start"
          value="start"
        />
      </div>
    );
  } else {
    return null;
  }
};

export default OptionalSwitch;
