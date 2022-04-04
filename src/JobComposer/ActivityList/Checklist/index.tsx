import { CheckboxWithLabel } from '#components';
import { Entity } from '#JobComposer/composer.types';
import { useTypedSelector } from '#store';
import { Close } from '@material-ui/icons';
import { get } from 'lodash';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { executeActivity, fixActivity } from '../actions';
import { ActivityProps, Selections } from '../types';
import { Wrapper } from './styles';

const ChecklistActivity: FC<ActivityProps> = ({
  activity,
  isCorrectingError,
}) => {
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
                    const newData = {
                      ...activity,
                      data: activity.data.map((e) => ({
                        ...e,
                        ...(e.id === el.id
                          ? {
                              state: isItemSelected
                                ? Selections.NOT_SELECTED
                                : Selections.SELECTED,
                            }
                          : {
                              state:
                                get(activity?.response?.choices, e.id) ||
                                Selections.NOT_SELECTED,
                            }),
                      })),
                    };
                    if (isCorrectingError) {
                      dispatch(fixActivity(newData));
                    } else {
                      dispatch(executeActivity(newData));
                    }
                  }}
                >
                  <CheckboxWithLabel
                    isChecked={isItemSelected}
                    label={el.name}
                  />
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
