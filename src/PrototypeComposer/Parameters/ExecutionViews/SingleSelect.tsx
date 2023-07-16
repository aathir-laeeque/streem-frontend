import { FormGroup } from '#components';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { InputTypes } from '#utils/globalTypes';
import React, { FC } from 'react';

const SingleSelectTaskView: FC<Omit<ParameterProps, 'taskId' | 'isReadOnly'>> = ({
  parameter,
  form,
  onChangeHandler,
}) => {
  const { setValue } = form;

  const typeOfSelect = (type) => {
    if (type === 'MULTISELECT') {
      return InputTypes.MULTI_SELECT;
    } else return InputTypes.SINGLE_SELECT;
  };

  const optionChosen = (selectedOptions: any, optionsList: any) => {
    let choices = {};
    const selectedOptionsMap = new Map();
    selectedOptions.forEach((currOption) => {
      selectedOptionsMap.set(currOption.value, currOption.label);
    });

    optionsList.forEach((currOption: any) => {
      choices = selectedOptionsMap.has(currOption.id)
        ? { ...choices, [currOption.id]: 'SELECTED' }
        : { ...choices, [currOption.id]: 'NOT_SELECTED' };
    });
    return choices;
  };

  const selectedData = (selectedOptions: any, optionsList: any) => {
    const selectedOptionsMap = new Map();
    selectedOptions.forEach((currOption) => {
      selectedOptionsMap.set(currOption.value, currOption.label);
    });

    return optionsList.map((currOption: any) => {
      return selectedOptionsMap.has(currOption.id)
        ? {
            ...currOption,
            state: 'SELECTED',
          }
        : { ...currOption, state: 'NOT_SELECTED' };
    });
  };

  return (
    <FormGroup
      inputs={[
        {
          type: typeOfSelect(parameter.type),
          props: {
            id: parameter.id,
            options: parameter.data.map((option: any) => ({
              label: option.name,
              value: option.id,
            })),
            menuPortalTarget: document.body,
            menuPosition: 'fixed',
            menuShouldBlockScroll: true,
            isClearable: true,
            ['data-id']: parameter.id,
            ['data-type']: parameter.type,
            placeholder:
              parameter.type === 'MULTISELECT'
                ? 'Select one or more options'
                : 'You can select one option here',
            onChange: (_value: any) => {
              const value = _value ? (Array.isArray(_value) ? _value : [_value]) : [];
              const parameterData = {
                ...parameter,
                data: selectedData(value, parameter.data),
                response: {
                  value: null,
                  reason: '',
                  state: 'EXECUTED',
                  choices: optionChosen(value, parameter.data),
                  medias: [],
                  parameterValueApprovalDto: null,
                },
              };
              setValue(parameter.id, value.length ? parameterData : null, {
                shouldDirty: true,
                shouldValidate: true,
              });
              onChangeHandler(parameterData);
            },
            isSearchable: false,
          },
        },
      ]}
    />
  );
};

export default SingleSelectTaskView;
