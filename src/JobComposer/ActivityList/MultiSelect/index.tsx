import { get, isArray } from 'lodash';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { executeActivityLeading, fixActivityLeading } from '../actions';
import { ActivityProps, Selections } from '../types';
import { customSelectStyles } from './commonStyles';
import { Wrapper } from './styles';

const MultiSelectActivity: FC<ActivityProps & { isMulti: boolean }> = ({
  activity,
  isCorrectingError,
  isMulti,
}) => {
  const dispatch = useDispatch();

  const options = activity.data.map((el) => ({ label: el.name, value: el.id }));

  return (
    <Wrapper>
      <div className="activity-header">
        {isMulti ? 'Multi Select' : 'Single Select'}
      </div>

      <Select
        isMulti={isMulti}
        className="multi-select"
        options={options}
        value={options.filter(
          (el) =>
            get(activity?.response?.choices, el.value) === Selections.SELECTED,
        )}
        placeholder={
          isMulti
            ? 'Select one or more options'
            : 'You can select one option here'
        }
        styles={customSelectStyles}
        onChange={(options) => {
          let newData;

          if (isArray(options)) {
            newData = {
              ...activity,
              data: activity.data.map((el) => ({
                ...el,
                ...(options.findIndex((e) => e.value === el.id) > -1
                  ? { state: Selections.SELECTED }
                  : { state: Selections.NOT_SELECTED }),
              })),
            };
          } else {
            newData = {
              ...activity,
              data: activity.data.map((el) => ({
                ...el,
                ...(options.value === el.id
                  ? { state: Selections.SELECTED }
                  : { state: Selections.NOT_SELECTED }),
              })),
            };
          }

          if (isCorrectingError) {
            dispatch(fixActivityLeading(newData));
          } else {
            dispatch(executeActivityLeading(newData));
          }
        }}
      />
    </Wrapper>
  );
};

export default MultiSelectActivity;
