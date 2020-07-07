import { Add, Remove } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivity } from './actions';
import { ActivityProps, Activity } from './types';

const Material: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const update = (data: Activity) => dispatch(updateActivity(data));

  // TODO: look into any type
  return (
    <ol className="material-interaction">
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
          />

          <div className="material-interaction-item-controls">
            <Remove
              className="icon"
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
            <span className="quantity">{el.quantity || 0}</span>
            <Add
              className={`icon`}
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
    </ol>
  );
};

export default Material;
