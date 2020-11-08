import { AddNewItem, Select, TextInput } from '#components';
import { MandatoryActivity } from '#Composer-new/checklist.types';
import {
  CheckBoxOutlineBlankSharp,
  Close,
  RadioButtonUnchecked,
} from '@material-ui/icons';
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

  const isMultiSelect = activity.type === MandatoryActivity.MULTISELECT;

  const activityError = activity.errors.find(
    (error) =>
      error.code === 'E410' ||
      error.code === 'E411' ||
      error.code === 'E412' ||
      error.code === 'E413',
  );

  return (
    <MultiSelectWrapper>
      <Select
        disabled
        label={
          isMultiSelect ? 'Creating a Multi Choice' : 'Creating a single choice'
        }
        options={[]}
        onChange={noop}
        placeholder={
          isMultiSelect
            ? 'User can select one or more options'
            : 'User can select one option here'
        }
      />

      <ul className="options-list">
        {activity?.data?.map((item, index) => (
          <li className="options-list-item" key={index}>
            <TextInput
              BeforeElement={
                isMultiSelect ? CheckBoxOutlineBlankSharp : RadioButtonUnchecked
              }
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

        {activityError ? (
          <div className="activity-error">{activityError?.message}</div>
        ) : null}

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
