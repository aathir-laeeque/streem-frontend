import { TextInput } from '#components';
import React, { FC } from 'react';

import { YesNoWrapper } from './styles';
import { ActivityProps } from './types';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { updateActivity } from './actions';

const YesNoActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();

  return (
    <YesNoWrapper>
      <TextInput
        defaultValue={activity.label}
        error={
          !activity.label &&
          activity.errors.find((error) => error.code === 'E409')?.message
        }
        label="Ask a question"
        name="label"
        onChange={debounce(({ value }) => {
          dispatch(updateActivity({ ...activity, label: value }));
        }, 500)}
      />

      <div className="options-container">
        {activity.data
          .sort((a, b) => (a.type > b.type ? -1 : 1))
          .map((item, index) => (
            <TextInput
              defaultValue={item.name}
              error={
                !item.name &&
                activity.errors.find((error) => error.code === 'E407')?.message
              }
              key={index}
              label={
                item.type === 'yes' ? 'Positive Response' : 'Negative Response'
              }
              name={item.type}
              onChange={debounce(({ value }) => {
                dispatch(
                  updateActivity({
                    ...activity,
                    data: [
                      ...activity.data.slice(0, index),
                      { ...item, name: value },
                      ...activity.data.slice(index + 1),
                    ],
                  }),
                );
              }, 500)}
            />
          ))}
      </div>
    </YesNoWrapper>
  );
};

export default YesNoActivity;
