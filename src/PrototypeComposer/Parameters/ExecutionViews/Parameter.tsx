import { Button, FormGroup } from '#components';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { InputTypes } from '#utils/globalTypes';
import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { generateShouldBeText } from '#utils/stringUtils';

const Wrapper = styled.div`
  .parameter-text {
    color: rgb(0, 0, 0);
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 24px;
  }

  .parameter-textarea {
    display: flex;
    flex-direction: column;
    margin-top: 16px;

    .input-label {
      font-size: 14px;
      color: rgb(22, 22, 22);
      letter-spacing: 0.16px;
      line-height: 1.29;
      margin-bottom: 8px;
    }

    .warning-label {
      color: rgb(255, 107, 107);
      font-size: 12px;
      margin-bottom: 32px;
    }

    .footer {
      margin-top: 16px;
      display: flex;
    }
  }
`;

const ShouldBeTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, form }) => {
  const [inputValue, setInputValue] = useState('');
  const { setValue } = form;

  const observedValueChecker = (input, data) => {
    if (inputValue !== '') {
      let warningFlag: boolean;

      switch (data.operator) {
        case 'EQUAL_TO':
          warningFlag = input === Number(data.value) ? false : true;
          break;
        case 'LESS_THAN':
          warningFlag = input < Number(data.value) ? false : true;
          break;
        case 'LESS_THAN_EQUAL_TO':
          warningFlag = input <= Number(data.value) ? false : true;
          break;
        case 'MORE_THAN':
          warningFlag = input > Number(data.value) ? false : true;
          break;
        case 'MORE_THAN_EQUAL_TO':
          warningFlag = input >= Number(data.value) ? false : true;
          break;
        case 'BETWEEN':
          if (input > Number(data.lowerValue) && input < Number(data.upperValue)) {
            warningFlag = false;
          } else {
            warningFlag = true;
          }
          break;
        default:
          return;
      }
      return warningFlag;
    }
  };

  return (
    <Wrapper>
      <div className="parameter-text">{generateShouldBeText(parameter.label, parameter?.data)}</div>
      <FormGroup
        style={{ padding: 0 }}
        inputs={[
          {
            type: InputTypes.NUMBER,
            props: {
              onChange: (value: any) => {
                setInputValue(value.value);
                setValue(
                  parameter.id,
                  {
                    ...parameter,
                    data: { ...parameter.data, input: value.value },
                    response: {
                      value: value.value,
                      reason: '',
                      state: 'EXECUTED',
                      choices: {},
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
              ['data-id']: parameter.id,
              ['data-type']: parameter.type,
              placeholder: 'Enter Observed Value',
            },
          },
        ]}
      />
      {observedValueChecker(Number(inputValue), parameter?.data) && (
        <div className="parameter-textarea">
          <div className="warning-label">
            Warning! {generateShouldBeText(parameter.label, parameter?.data)}
          </div>
          <div className="input-label">State your Reason</div>
          <FormGroup
            style={{ padding: 0 }}
            inputs={[
              {
                type: InputTypes.MULTI_LINE,
                props: {
                  placeholder: 'Reason For Change',
                  rows: '4',
                  onChange: (value: any) => {
                    setValue(
                      'data',
                      {
                        ...data,
                        [parameter.id]: {
                          ...parameter,
                          data: { ...parameter.data, input: inputValue },
                          response: {
                            value: inputValue,
                            reason: value.value,
                            state: 'EXECUTED',
                            choices: {},
                            medias: [],
                            parameterValueApprovalDto: null,
                          },
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
          <div className="footer">
            <Button variant="secondary">Submit</Button>
            <Button variant="secondary" color="red" onClick={() => setInputValue('')}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default ShouldBeTaskView;
