import { Add, Remove } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivity } from './actions';
import { ActivityProps, Activity } from './types';
import { useTypedSelector } from '#store';

const Material: FC<ActivityProps> = ({ activity }) => {
  const { isChecklistEditable } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  const dispatch = useDispatch();

  const update = (data: Activity) => dispatch(updateActivity(data));

  // TODO: look into any type
  return (
    <ol className="material-interaction">
      {!isChecklistEditable ? (
        <div className="header">
          <span>NAME</span>
          <span>QUANTITY</span>
        </div>
      ) : null}
      {activity.data.map((el: any, idx: number) => (
        <li key={idx} className="material-interaction-item">
          <img src={el.link} className="material-interaction-item-image" />

          <input
            className="form-field-input"
            type="text"
            name="material"
            value={el.name}
            onChange={(e) =>
              update({
                ...activity,
                data: activity.data.map((ele: any, i: number) => ({
                  ...ele,
                  ...(i === idx && { name: e.target.value }),
                })),
              })
            }
            {...(!isChecklistEditable && { disabled: true })}
          />

          <div
            className={`material-interaction-item-controls${
              !isChecklistEditable ? ' no-border' : ''
            }`}
          >
            <Remove
              className={`icon${!isChecklistEditable ? ' hide' : ''}`}
              onClick={() =>
                update({
                  ...activity,
                  data: activity.data.map((ele: any, i: number) => ({
                    ...ele,
                    ...(i === idx && { quantity: (el.quantity || 0) - 1 }),
                  })),
                })
              }
            />
            <span
              className={`quantity${!isChecklistEditable ? ' no-border' : ''}`}
            >
              {el.quantity || 0}
            </span>
            <Add
              className={`icon${!isChecklistEditable ? ' hide' : ''}`}
              onClick={() =>
                update({
                  ...activity,
                  data: activity.data.map((ele: any, i: number) => ({
                    ...ele,
                    ...(i === idx && { quantity: (el.quantity || 0) + 1 }),
                  })),
                })
              }
            />
          </div>
        </li>
      ))}

      {isChecklistEditable ? (
        <div
          className="add-new-item"
          onClick={() =>
            update({
              ...activity,
              data: [...activity.data, { name: '', quantity: 0, link: '' }],
            })
          }
        >
          <Add className="icon" />
          Add new Item
        </div>
      ) : null}
    </ol>
  );
};

export default Material;
