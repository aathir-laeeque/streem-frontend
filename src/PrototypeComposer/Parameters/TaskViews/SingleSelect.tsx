import { FormGroup } from '#components';
import { ActivityProps } from '#PrototypeComposer/Activity/types';
import { InputTypes } from '#utils/globalTypes';
import React, { FC } from 'react';
import { FormatOptionLabelContext } from 'react-select';

const SingleSelectTaskView: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  return (
    <FormGroup
      inputs={[
        {
          type: InputTypes.SINGLE_SELECT,
          props: {
            id: activity.id,
            options: activity.data.map((option: any) => ({
              label: option.name,
              value: option.id,
            })),
            formatOptionLabel: (
              option: any,
              { context }: { context: FormatOptionLabelContext },
            ) => {
              if (context === 'menu') {
                return option.label;
              }
              return <div />;
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
