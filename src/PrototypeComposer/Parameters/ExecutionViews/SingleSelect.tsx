import { FormGroup } from '#components';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { InputTypes } from '#utils/globalTypes';
import React, { FC } from 'react';
import { FormatOptionLabelContext } from 'react-select';

const SingleSelectTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, form }) => {
  const { setValue } = form;

  const typeOfSelect = (type) => {
    if (type === 'MULTISELECT') {
      return InputTypes.MULTI_SELECT;
    } else return InputTypes.SINGLE_SELECT;
  };

  const optionChosen = (selectedOptions: any, optionsList: any) => {
    let choices = {};
    if (Array.isArray(selectedOptions)) {
      const selectedOptionsMap = new Map();
      selectedOptions.forEach((currOption) => {
        selectedOptionsMap.set(currOption.value, currOption.label);
      });

      optionsList.forEach((currOption: any) => {
        choices = selectedOptionsMap.has(currOption.id)
          ? { ...choices, [currOption.id]: 'SELECTED' }
          : { ...choices, [currOption.id]: 'NOT_SELECTED' };
      });
    } else {
      optionsList.forEach((currOption: any) => {
        choices =
          currOption.id === selectedOptions.value
            ? { ...choices, [currOption.id]: 'SELECTED' }
            : { ...choices, [currOption.id]: 'NOT_SELECTED' };
      });
    }
    return choices;
  };

  const selectedData = (selectedOptions: any, optionsList: any) => {
    if (Array.isArray(selectedOptions)) {
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
    } else {
      return optionsList.map((currOption) => {
        return currOption.id === selectedOptions.value
          ? {
              ...currOption,
              state: 'SELECTED',
            }
          : { ...currOption, state: 'NOT_SELECTED' };
      });
    }
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

            formatOptionLabel: (
              option: any,
              { context }: { context: FormatOptionLabelContext },
            ) => {
              if (context === 'menu' || context === 'value') {
                return option.label;
              }
              return <div />;
            },
            onChange: (value: any) => {
              setValue(
                `data.${parameter.id}`,
                {
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
                },
                {
                  shouldDirty: true,
                  shouldValidate: true,
                },
              );
            },
            isSearchable: false,
            placeholder: '',
          },
        },
      ]}
    />
  );
};

export default SingleSelectTaskView;