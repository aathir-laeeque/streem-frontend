import { Button, FormGroup } from '#components';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { InputTypes } from '#utils/globalTypes';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const YesNoTaskViewWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .parameter-header {
    display: flex;
  }

  .parameter-textarea {
    margin-top: 16px;

    .input-label {
      font-size: 14px;
      color: rgb(22, 22, 22);
      letter-spacing: 0.16px;
      line-height: 1.29;
      margin-bottom: 8px;
    }
  }

  .yes-label {
    color: #24a148;
    border-color: #24a148;
  }
  .no-label {
    color: #da1e28;
    border-color: #da1e28;
  }
`;

const YesNoTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, form }) => {
  const [selection, setSelection] = useState('');
  const { setValue } = form;

  const selectedData = (selectedOptions: any, optionsList: any) => {
    return optionsList.map((currOption) => {
      return currOption.id === selectedOptions.id
        ? {
            ...currOption,
            state: 'SELECTED',
          }
        : { ...currOption, state: 'NOT_SELECTED' };
    });
  };

  return (
    <YesNoTaskViewWrapper>
      <div className="parameter-header">
        <Button
          variant="secondary"
          color="green"
          onClick={() => {
            setSelection(parameter.data[0].name);
            setValue(
              `data.${parameter.id}`,
              {
                ...parameter,
                data: selectedData(parameter.data[0], parameter.data),
                response: {
                  value: null,
                  reason: '',
                  state: 'EXECUTED',
                  choices: {
                    [parameter.data[0].id]: 'SELECTED',
                    [parameter.data[1].id]: 'NOT_SELECTED',
                  },
                  medias: [],
                  parameterValueApprovalDto: null,
                },
              },
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            );
          }}
        >
          {parameter.data[0].name}
        </Button>
        <Button
          variant="secondary"
          color="red"
          onClick={() => {
            setSelection(parameter.data[1].name);
          }}
        >
          {parameter.data[1].name}
        </Button>
      </div>
      {selection === parameter.data[1].name && (
        <div className="parameter-textarea">
          <div className="input-label">State your Reason</div>
          <FormGroup
            style={{ padding: 0 }}
            inputs={[
              {
                type: InputTypes.MULTI_LINE,
                props: {
                  placeholder: 'Write Here',
                  rows: '4',
                  onChange: (value: any) => {
                    setValue(
                      `data.${parameter.id}`,
                      {
                        ...parameter,
                        data: selectedData(parameter.data[1], parameter.data),
                        response: {
                          value: null,
                          reason: value.value,
                          state: 'EXECUTED',
                          choices: {
                            [parameter.data[1].id]: 'SELECTED',
                            [parameter.data[0].id]: 'NOT_SELECTED',
                          },
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
                },
              },
            ]}
          />
        </div>
      )}
    </YesNoTaskViewWrapper>
  );
};

export default YesNoTaskView;
