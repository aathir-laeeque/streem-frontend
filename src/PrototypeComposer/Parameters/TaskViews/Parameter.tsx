import { FormGroup } from '#components';
import { ActivityProps } from '#PrototypeComposer/Activity/types';
import { PARAMETER_OPERATORS } from '#PrototypeComposer/constants';
import { InputTypes } from '#utils/globalTypes';
import React, { FC } from 'react';
import { FormatOptionLabelContext } from 'react-select';

const ShouldBeTaskView: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const selectedOperator = PARAMETER_OPERATORS.filter((o) => activity.data.operator === o.value);
  return (
    <FormGroup
      inputs={[
        {
          type: InputTypes.SINGLE_LINE,
          props: {
            id: 'uom',
            label: 'Unit of Measurement',
            placeholder: '',
            value: activity.data.uom,
            disabled: true,
          },
        },
        {
          type: InputTypes.SINGLE_SELECT,
          props: {
            id: 'operator',
            label: 'Criteria',
            options: PARAMETER_OPERATORS,
            value: selectedOperator,
            isSearchable: false,
            placeholder: 'Choose an option',
            formatOptionLabel: (
              option: any,
              { context }: { context: FormatOptionLabelContext },
            ) => {
              if (context === 'menu') {
                return option.label;
              }
              return selectedOperator[0].label;
            },
          },
        },
        {
          type: InputTypes.SINGLE_LINE,
          props: {
            id: 'value',
            label: 'Value',
            placeholder: '',
            value: activity.data.value,
            disabled: true,
          },
        },
      ]}
    />
  );
};

export default ShouldBeTaskView;
