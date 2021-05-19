import { ActivityItemInput, AddNewItem } from '#components';
import { CheckBoxOutlineBlankSharp, Close, Error } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { updateActivity } from './actions';
import { ChecklistWrapper } from './styles';
import { ActivityProps, ChecklistActivityErrors } from './types';

const ChecklistActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();

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

      <ul className="checklist-list">
        {activity?.data?.map((item, index) => (
          <li className="checklist-list-item" key={item.id}>
            <ActivityItemInput
              Icon={CheckBoxOutlineBlankSharp}
              defaultValue={item.name}
              customOnChange={(value) => {
                dispatch(
                  updateActivity({
                    ...activity,
                    data: [
                      ...activity.data.slice(0, index),
                      { id: item.id, name: value },
                      ...activity.data.slice(index + 1),
                    ],
                  }),
                );
              }}
              error={isErrorPresent && !item.name}
            />

            <Close
              className="icon"
              id="remove-item"
              onClick={() => {
                dispatch(
                  updateActivity({
                    ...activity,
                    data: [...activity.data.filter((el) => el.id !== item.id)],
                  }),
                );
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
              updateActivity({
                ...activity,
                data: [...activity.data, { id: uuidv4(), name: '' }],
              }),
            );
          }}
        />
      </ul>
    </ChecklistWrapper>
  );
};

export default ChecklistActivity;
