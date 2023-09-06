import { Select } from '#components';
import { get } from 'lodash';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
// import { customSelectStyles } from './commonStyles';
import { Selections } from '#types';
import { jobActions } from '#views/Job/jobStore';
import { ParameterProps } from '../Parameter';
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
        // styles={customSelectStyles}
        isClearable={true}
        onChange={(_options) => {
          const options = _options ? (Array.isArray(_options) ? _options : [_options]) : [];
          const newData = {
            ...parameter,
            data: parameter.data.map((el) => ({
              ...el,
              ...(options.findIndex((e) => e.value === el.id) > -1
                ? { state: Selections.SELECTED }
                : { state: Selections.NOT_SELECTED }),
            })),
          };

          if (isCorrectingError) {
            dispatch(jobActions.fixParameter({ parameter: newData }));
          } else {
            dispatch(jobActions.executeParameter({ parameter: newData }));
          }
        }}
      />
    </Wrapper>
  );
};

export default MultiSelectParameter;
