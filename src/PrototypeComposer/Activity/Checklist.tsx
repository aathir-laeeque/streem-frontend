import { ActivityItemInput, AddNewItem } from '#components';
import { CheckBoxOutlineBlankSharp, Close } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { updateActivity } from './actions';
import { ChecklistWrapper } from './styles';
import { ActivityProps } from './types';

const ChecklistActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();

  const activityError = activity.errors.find((error) => error.code === 'E414');

  return (
    <ChecklistWrapper>
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

        {activityError ? (
          <div className="activity-error">{activityError?.message}</div>
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
