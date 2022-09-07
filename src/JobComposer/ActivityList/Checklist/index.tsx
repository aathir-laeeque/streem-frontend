import { CheckboxWithLabel } from '#components';
import { Entity } from '#JobComposer/composer.types';
import { useTypedSelector } from '#store';
import { Close } from '@material-ui/icons';
import { get } from 'lodash';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { executeActivity, fixActivity, updateExecutedActivity } from '../actions';
import { ActivityProps, Selections } from '../types';
import { Wrapper } from './styles';

const ChecklistActivity: FC<ActivityProps> = ({ activity, isCorrectingError }) => {
  const metaInfo = useRef<{
    shouldCallApi?: boolean;
  }>({});
  const { entity } = useTypedSelector((state) => state.composer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (metaInfo.current?.shouldCallApi) {
      metaInfo.current.shouldCallApi = false;
      if (activity?.response?.choices) {
        const data = activity.data.map((d: any) => {
          return {
            ...d,
            state: get(activity?.response?.choices, d.id, Selections.NOT_SELECTED),
          };
        });
        if (isCorrectingError) {
          dispatch(
            fixActivity({
              ...activity,
              data,
            }),
          );
        } else {
          dispatch(
            executeActivity({
              ...activity,
              data,
            }),
          );
        }
      }
    }
  }, [activity?.response?.choices]);

  const handleExecution = (id: string, choice: Selections) => {
    metaInfo.current.shouldCallApi = true;
    dispatch(
      updateExecutedActivity({
        ...activity,
        response: {
          ...activity.response,
          audit: undefined,
          choices: {
            ...activity.response?.choices,
            ...activity.data.reduce((acc: any, d: any) => {
              if (d.id === id) {
                acc[d.id] = choice;
              }
              return acc;
            }, {}),
          },
        },
      }),
    );
  };

  if (entity === Entity.JOB) {
    return (
      <Wrapper>
        <ul className="list-container">
          {activity.data.map((el, index) => {
            const isItemSelected = get(activity?.response?.choices, el.id) === Selections.SELECTED;

            return (
              <li key={index} className="list-item">
                <div
                  className="item-content"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleExecution(
                      el.id,
                      isItemSelected ? Selections.NOT_SELECTED : Selections.SELECTED,
                    );
                  }}
                >
                  <CheckboxWithLabel isChecked={isItemSelected} label={el.name} />
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
