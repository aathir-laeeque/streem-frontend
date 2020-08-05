import { AddNewItem } from '#components';
import { useTypedSelector } from '#store';
import {
  ArrowDropDown,
  ArrowDropUp,
  Close,
  ImageOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivity } from '../actions';
import { Activity, ActivityProps } from '../types';
import { Wrapper } from './styles';
import { MaterialActivityData } from './types';
import { ChecklistState } from '#views/Checklists/types';

const Material: FC<ActivityProps> = ({ activity }) => {
  const { isChecklistEditable, state } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  const dispatch = useDispatch();

  const isFieldDisabled =
    state === ChecklistState.EXECUTING || state === ChecklistState.VIEW;

  const update = (data: Activity) => dispatch(updateActivity(data));

  return (
    <Wrapper>
      <div className={`list-header ${!isFieldDisabled ? 'hide' : ''}`}>
        <span>NAME</span>
        <span>QUANTITY</span>
      </div>

      {(activity.data as Array<MaterialActivityData>).map((el, idx) => (
        <li key={idx} className="list-item">
          {el.link ? (
            <img src={el.link} className="list-item-image" />
          ) : (
            <div className="list-item-image">
              <ImageOutlined className="icon" />
            </div>
          )}

          <input
            className="form-field-input"
            type="text"
            name="material"
            value={el.name}
            placeholder="Type Here..."
            onChange={(e) =>
              update({
                ...activity,
                data: activity.data.map((ele: any, i: number) => ({
                  ...ele,
                  ...(i === idx && { name: e.target.value }),
                })),
              })
            }
            disabled={isFieldDisabled}
          />

          <div
            className={`quantity-controls ${
              !isChecklistEditable ? 'no-background' : ''
            }`}
          >
            <ArrowDropDown
              className={`icon ${!isChecklistEditable ? 'hide' : ''}`}
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
              className={`quantity ${!isChecklistEditable ? 'no-border' : ''}`}
            >
              {(el.quantity || 0).toString().padStart(2, '0')}
            </span>
            <ArrowDropUp
              className={`icon ${!isChecklistEditable ? 'hide' : ''}`}
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

          <Close
            className={`icon ${!isChecklistEditable ? 'hide' : ''}`}
            fontSize="small"
          />
        </li>
      ))}

      {isChecklistEditable ? (
        <AddNewItem
          onClick={() =>
            update({
              ...activity,
              data: [...activity.data, { name: '', quantity: 0, link: '' }],
            })
          }
        />
      ) : null}
    </Wrapper>
  );
};

export default Material;
