import { Button, FormGroup } from '#components';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { InputTypes } from '#utils/globalTypes';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const YesNoTaskViewWrapper = styled.div<{ type: string }>`
  display: flex;
  flex-direction: column;

  .parameter-header {
    display: flex;

    button:first-child {
      background-color: ${(p) => (p.type === 'yes' ? '#5aa700' : '#ffffff')};
      color: ${(p) => (p.type === 'yes' ? '#ffffff' : '#5aa700')};
    }

    button:last-child {
      background-color: ${(p) => (p.type === 'no' ? '#ff6b6b' : '#ffffff')};
      color: ${(p) => (p.type === 'no' ? '#ffffff' : '#ff6b6b')};
    }
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
`;

type InitialState = {
  id: string;
  name: string;
  type: string;
};

const YesNoTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, form }) => {
  const initialState: InitialState = { id: '', name: '', type: '' };
  const [selection, setSelection] = useState(initialState);
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
    <YesNoTaskViewWrapper type={selection?.type} data-id={parameter.id} data-type={parameter.type}>
      <div className="parameter-header">
        <Button
          variant="secondary"
          color="green"
          onClick={() => {
            setSelection(parameter.data[0]);
            setValue(
              parameter.id,
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
            setSelection(parameter.data[1]);
          }}
        >
          {parameter.data[1].name}
        </Button>
      </div>
      {selection?.name === parameter.data[1].name && (
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
                      parameter.id,
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
