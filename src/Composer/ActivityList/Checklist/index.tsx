import { Entity } from '#Composer/types';
import { useTypedSelector } from '#store';
import { Close } from '@material-ui/icons';
import { get } from 'lodash';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityProps, Selections } from '../types';
import { Wrapper } from './styles';
import { executeActivity } from '../actions';

const ChecklistActivity: FC<ActivityProps> = ({ activity }) => {
  const { entity } = useTypedSelector((state) => state.composer);

  const dispatch = useDispatch();

  if (entity === Entity.JOB) {
    return (
      <Wrapper>
        <ul className="list-container">
          {activity.data.map((el, index) => {
            const isItemSelected =
              get(activity?.response?.choices, el.id) === Selections.SELECTED;

            return (
              <li key={index} className="list-item">
                <div
                  className="item-content"
                  onClick={() => {
                    console.log('original activity :: ', activity);
                    dispatch(
                      executeActivity({
                        ...activity,
                        data: activity.data.map((e) => ({
                          ...e,
                          ...(e.id === el.id
                            ? {
                                status: isItemSelected
                                  ? Selections.NOT_SELECTED
                                  : Selections.SELECTED,
                              }
                            : {
                                status:
                                  activity?.response?.choices[e.id] ||
                                  Selections.NOT_SELECTED,
                              }),
                        })),
                      }),
                    );
                  }}
                >
                  <div
                    className={`dummy-checkbox${
                      isItemSelected ? ' checked' : ''
                    }`}
                  />

                  <div className={isItemSelected ? 'selected' : ''}>
                    {el.name}
                  </div>
                </div>

                <Close className="icon" />
              </li>
            );
          })}
        </ul>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default ChecklistActivity;
