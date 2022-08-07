import { ActivityItemInput, AddNewItem } from '#components';
import { CheckBoxOutlineBlankSharp, Close, Error } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  addStoreActivityItem,
  removeStoreActivityItem,
  updateActivityApi,
  updateStoreActivity,
} from './actions';
import ActivityLabelInput from './ActivityLabelInput';
import { ChecklistWrapper } from './styles';
import { ActivityProps, ChecklistActivityErrors } from './types';

const ChecklistActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
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
    (error) => error.code in ChecklistActivityErrors,
  );

  const isErrorPresent = !!activityErrors.length;

  return (
    <ChecklistWrapper>
      {isErrorPresent ? (
        <div className="activity-error top">
          <Error />
          Activity Incomplete
        </div>
      ) : null}

      <label>Creating a checklist</label>

      <ActivityLabelInput activity={activity} isControlled />

      <ul className="checklist-list">
        {activity?.data?.map((item, index) => (
          <li className="checklist-list-item" key={item.id}>
            <ActivityItemInput
              Icon={CheckBoxOutlineBlankSharp}
              defaultValue={item.name}
              customOnChange={(value) => {
                dispatch(
                  updateStoreActivity(value, activity.id, [
                    'data',
                    index,
                    'name',
                  ]),
                );
              }}
              error={isErrorPresent && !item.name}
            />

            <Close
              className="icon"
              id="remove-item"
              onClick={() => {
                dispatch(removeStoreActivityItem(activity.id, item.id));
              }}
            />
          </li>
        ))}

        {isErrorPresent ? (
          <div className="activity-error">
            {activityErrors.find((error) => error.code === 'E415')?.message}
          </div>
        ) : null}

        <AddNewItem
          onClick={() => {
            dispatch(
              addStoreActivityItem(activity.id, { id: uuidv4(), name: '' }),
            );
          }}
        />
      </ul>
    </ChecklistWrapper>
  );
};

export default ChecklistActivity;
