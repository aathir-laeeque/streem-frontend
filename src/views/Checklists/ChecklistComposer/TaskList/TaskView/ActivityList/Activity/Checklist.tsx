import { Add, Close } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Checkbox } from '#components';

import { ActivityProps, Activity } from './types';
import { updateActivity } from './actions';
import { useTypedSelector } from '#store';

const Checklist: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { isChecklistEditable } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  const update = (updatedActivity: Activity) =>
    dispatch(updateActivity(updatedActivity));

  return (
    <div className="checklist-interaction">
      <div className="form-field">
        <input
          className="form-field-input"
          type="text"
          name="label"
          value={activity.label}
          onChange={(e) => update({ ...activity, label: e.target.value })}
          placeholder="Enter a title for the checklist"
        />
      </div>

      <div className="checklist-container">
        {activity.data.map((el: any, idx: number) => (
          <div className="list-item" key={idx}>
            <Checkbox
              checked={isChecklistEditable ? false : true}
              onClick={() => {
                if (!isChecklistEditable) {
                  console.log('trigger on click hadler for checkbox');
                }
              }}
            />

            <input
              className="form-field-input"
              type="text"
              name="item-label"
              value={el.name}
              onChange={(e) =>
                update({
                  ...activity,
                  data: activity.data.map((d: any, i: number) => ({
                    ...d,
                    ...(i === idx && { name: e.target.value }),
                  })),
                })
              }
              disabled={isChecklistEditable ? false : true}
            />

            {isChecklistEditable ? (
              <Close
                className={`icon`}
                onClick={() =>
                  update({
                    ...activity,
                    data: activity.data.filter(
                      (_: any, i: number) => i !== idx,
                    ),
                  })
                }
              />
            ) : null}
          </div>
        ))}

        {isChecklistEditable ? (
          <div
            className="add-new-item"
            onClick={() =>
              update({
                ...activity,
                data: [...activity.data, { name: '' }],
              })
            }
          >
            <Add className="icon" />
            Add new Item
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Checklist;
