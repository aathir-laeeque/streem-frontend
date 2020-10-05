import { AddNewItem, Select, TextInput } from '#components';
import { MandatoryActivity } from '#Composer-new/checklist.types';
import { Close } from '@material-ui/icons';
import { debounce, noop } from 'lodash';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { updateActivity } from './actions';
import { MultiSelectWrapper } from './styles';
import { ActivityProps } from './types';

const MultiSelectActivity: FC<Omit<ActivityProps, 'taskId'>> = ({
  activity,
}) => {
  const dispatch = useDispatch();

  return (
    <MultiSelectWrapper>
      <Select
        disabled
        label={
          activity.type === MandatoryActivity.MULTISELECT
            ? 'Creating a Multi Choice'
            : 'Creating a single choice'
        }
        options={[]}
        onChange={noop}
        placeHolder="User can select one or more options"
      />

      <ul className="options-list">
        {activity?.data?.map((item, index) => (
          <li className="options-list-item" key={index}>
            <TextInput
              defaultValue={item.name}
              onChange={debounce(({ value }) => {
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
              }, 500)}
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
    </MultiSelectWrapper>
  );
};

export default MultiSelectActivity;
