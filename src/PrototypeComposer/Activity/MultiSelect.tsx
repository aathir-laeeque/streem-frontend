import { ActivityItemInput, AddNewItem, Select } from '#components';
import { MandatoryActivity } from '#PrototypeComposer/checklist.types';
import {
  CheckBoxOutlineBlankSharp,
  Close,
  Error,
  RadioButtonUnchecked,
} from '@material-ui/icons';
import { noop } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  addStoreActivityItem,
  removeStoreActivityItem,
  updateActivityApi,
  updateStoreActivity,
} from './actions';
import { MultiSelectWrapper } from './styles';
import { ActivityProps, SelectActivityErrors } from './types';

const MultiSelectActivity: FC<Omit<ActivityProps, 'taskId'>> = ({
  activity,
}) => {
  const dispatch = useDispatch();
  const [componentLoaded, updateComponentLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (componentLoaded) {
      dispatch(updateActivityApi(activity));
    } else if (activity) {
      updateComponentLoaded(true);
    }
  }, [activity]);

  const isMultiSelect = activity.type === MandatoryActivity.MULTISELECT;

  const activityErrors = activity.errors.filter(
    (error) => SelectActivityErrors,
  );

  const isErrorPresent = !!activityErrors.length;

  return (
    <MultiSelectWrapper>
      {isErrorPresent ? (
        <div className="activity-error top">
          <Error />
          Activity Incomplete
        </div>
      ) : null}

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
          <li className="options-list-item" key={item.id}>
            <ActivityItemInput
              Icon={
                isMultiSelect ? CheckBoxOutlineBlankSharp : RadioButtonUnchecked
              }
              defaultValue={item.name}
              customOnChange={(value) => {
                dispatch(
                  updateStoreActivity(value, activity.id, [
                    'data',
                    index,
                    'name',
                  ]),
                );
              }}
              error={isErrorPresent && !item.name}
            />

            <Close
              className="icon"
              id="remove-item"
              onClick={() => {
                dispatch(removeStoreActivityItem(activity.id, item.id));
              }}
            />
          </li>
        ))}

        {isErrorPresent ? (
          <div className="activity-error">
            {
              activityErrors.find((error) =>
                error.code === isMultiSelect ? 'E411' : 'E413',
              )?.message
            }
          </div>
        ) : null}

        <AddNewItem
          onClick={() => {
            dispatch(
              addStoreActivityItem(activity.id, { id: uuidv4(), name: '' }),
            );
          }}
        />
      </ul>
    </MultiSelectWrapper>
  );
};

export default MultiSelectActivity;
