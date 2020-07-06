import { Add, Close } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityProps, updateDataParams, updateActivityParams } from './types';
import { updateActivityData, updateActivity } from './actions';

const Checklist: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const update = (updatedActivity: updateActivityParams) =>
    dispatch(updateActivity(updatedActivity));

  const updateData = (updatedData: updateDataParams) =>
    dispatch(updateActivityData(updatedData));

  return (
    <div className="checklist-interaction">
      <div className="form-field">
        <input
          className={`form-input form-input-value`}
          type="text"
          name="label"
          value={activity.label}
          onChange={(e) => update({ label: e.target.value, id: activity.id })}
          placeholder="Enter a title for the checklist"
        />
      </div>

      <div className="checklist-container">
        {activity.data.map((el: any, idx: number) => (
          <div className="list-item" key={idx}>
            <input
              checked={false}
              className="form-field-input"
              onChange={() => console.log('toggle checkbox')}
              type="checkbox"
            />

            <input
              className="form-field-input"
              type="text"
              name="item-label"
              value={el.name}
              onChange={(e) =>
                /**
                 * TODO only send the updated data item to action
                 * TODO fix any type here
                 */
                updateData({
                  data: activity.data.map((d: any, i: number) => ({
                    ...d,
                    ...(i === idx && { name: e.target.value }),
                  })),
                  id: activity.id,
                })
              }
            />
            <Close
              className={`icon`}
              onClick={() =>
                updateData({
                  data: activity.data.filter((_: any, i: number) => i !== idx),
                  id: activity.id,
                })
              }
            />
          </div>
        ))}
        <div
          className="add-new-item"
          onClick={() =>
            updateData({
              data: [...activity.data, { name: '' }],
              id: activity.id,
            })
          }
        >
          <Add className="icon" />
          Add new Item
        </div>
      </div>
    </div>
  );
};

export default Checklist;
