import { Select } from '#components';
import { get, isArray } from 'lodash';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { executeParameterLeading, fixParameterLeading } from '../actions';
import { ParameterProps, Selections } from '../types';
import { customSelectStyles } from './commonStyles';
import { Wrapper } from './styles';

const MultiSelectParameter: FC<ParameterProps & { isMulti: boolean }> = ({
  parameter,
  isCorrectingError,
  isMulti,
}) => {
  const dispatch = useDispatch();

  const options = parameter.data.map((el) => ({ label: el.name, value: el.id }));

  return (
    <Wrapper>
      <Select
        isMulti={isMulti}
        className="multi-select"
        data-id={parameter.id}
        data-type={parameter.type}
        options={options}
        value={options.filter(
          (el) => get(parameter?.response?.choices, el.value) === Selections.SELECTED,
        )}
        placeholder={isMulti ? 'Select one or more options' : 'You can select one option here'}
        styles={customSelectStyles}
        onChange={(options) => {
          let newData;

          if (isArray(options)) {
            newData = {
              ...parameter,
              data: parameter.data.map((el) => ({
                ...el,
                ...(options.findIndex((e) => e.value === el.id) > -1
                  ? { state: Selections.SELECTED }
                  : { state: Selections.NOT_SELECTED }),
              })),
            };
          } else {
            newData = {
              ...parameter,
              data: parameter.data.map((el) => ({
                ...el,
                ...(options.value === el.id
                  ? { state: Selections.SELECTED }
                  : { state: Selections.NOT_SELECTED }),
              })),
            };
          }

          if (isCorrectingError) {
            dispatch(fixParameterLeading(newData));
          } else {
            dispatch(executeParameterLeading(newData));
          }
        }}
      />
    </Wrapper>
  );
};

export default MultiSelectParameter;
