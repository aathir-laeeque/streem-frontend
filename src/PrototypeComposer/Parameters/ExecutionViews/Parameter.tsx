import { Button, FormGroup } from '#components';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { InputTypes } from '#utils/globalTypes';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

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
  const { register, watch, setValue } = form;
  const data = watch('data', {});

  register('data', {
    required: true,
  });

  const generateText = (data, label) => {
    if (data.operator === 'BETWEEN') {
      return `${data.parameter} should be between ${data.lowerValue} ${data.uom} and ${data.upperValue} ${data.uom}`;
    } else {
      let operatorString: string;

      switch (data.operator) {
        case 'EQUAL_TO':
          operatorString = '(=) equal to';
          break;
        case 'LESS_THAN':
          operatorString = '(<) less than';
          break;
        case 'LESS_THAN_EQUAL_TO':
          operatorString = '(≤) less than equal to';
          break;
        case 'MORE_THAN':
          operatorString = '(>) more than';
          break;
        case 'MORE_THAN_EQUAL_TO':
          operatorString = '(≥) more than equal to';
          break;
        default:
          return;
      }
      return `${label} should be ${operatorString} ${data?.value ?? 50} ${data.uom}`;
    }
  };

  const observedValueChecker = (input, data) => {
    if (inputValue !== '') {
      if (data.operator === 'BETWEEN') {
        if (input > data.lowerValue && input < data.upperValue) {
          return false;
        }
      } else {
        let warningFlag: boolean;

        switch (data.operator) {
          case 'EQUAL_TO':
            warningFlag = input === data.value ? false : true;
            break;
          case 'LESS_THAN':
            warningFlag = input < data.value ? false : true;
            break;
          case 'LESS_THAN_EQUAL_TO':
            warningFlag = input <= data.value ? false : true;
            break;
          case 'MORE_THAN':
            warningFlag = input > data.value ? false : true;
            break;
          case 'MORE_THAN_EQUAL_TO':
            warningFlag = input >= data.value ? false : true;
            break;
          default:
            return;
        }
        return warningFlag;
      }
    }
  };

  return (
    <Wrapper>
      <div className="parameter-text">{generateText(parameter?.data, parameter.label)}</div>
      <FormGroup
        style={{ padding: 0 }}
        inputs={[
          {
            type: InputTypes.NUMBER,
            props: {
              onChange: (value: any) => {
                setInputValue(value.value);
                setValue(
                  'data',
                  {
                    ...data,
                    [parameter.id]: {
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
                  },
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  },
                );
              },
              placeholder: 'Enter Observed Value',
            },
          },
        ]}
      />
      {observedValueChecker(inputValue, parameter?.data) && (
        <div className="parameter-textarea">
          <div className="warning-label">
            Warning! {generateText(parameter?.data, parameter.label)}
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
