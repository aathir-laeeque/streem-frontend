import React, { FC, useState } from 'react';
import { FormGroup, ToggleSwitch } from '#components';
import { InputTypes } from '#utils/globalTypes';
import { UseFormMethods } from 'react-hook-form';

const LeastCount: FC<{ form: UseFormMethods<any>; isReadOnly: boolean }> = ({
  form,
  isReadOnly,
}) => {
  const { register, watch } = form;
  const formData = watch('data');
  const [leastCountEnabled, setLeastCountEnabled] = useState(formData?.leastCount);

  return (
    <div style={{ marginBottom: '24px' }}>
      <ToggleSwitch
        height={24}
        width={48}
        offLabel="Enable least count validation"
        onColor="#24a148"
        onChange={(isChecked) => {
          setLeastCountEnabled(isChecked);
        }}
        onLabel="Enable least count validation"
        checked={leastCountEnabled}
        disabled={isReadOnly}
      />
      {leastCountEnabled && (
        <FormGroup
          style={{ marginTop: '24px', width: '160px' }}
          inputs={[
            {
              type: InputTypes.NUMBER,
              props: {
                style: { width: '100%' },
                id: 'leastCount',
                label: 'Enter Least Count Value',
                placeholder: '0',
                disabled: isReadOnly,
                name: 'data.leastCount',
                ref: register({
                  min: 0,
                  validate: (value) => {
                    if (leastCountEnabled) {
                      return !!value;
                    }
                    return true;
                  },
                }),
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default LeastCount;
