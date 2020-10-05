import { BaseModal, NumberInput, Select } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Option } from '#components/shared/Select';
import { Delete, ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { noop } from 'lodash';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .modal {
    min-width: 400px !important;
    overflow: visible !important;
    padding: 0;

    &-body {
      padding: 0 !important;
    }
  }

  .header {
    align-items: center;
    background-color: #fafafa;
    color: #000000;
    display: flex;
    font-size: 20px;
    font-weight: bold;
    padding: 16px 24px;
  }

  .body {
    display: flex;
    flex-direction: column;
    position: relative;

    .select {
      &-label {
        text-align: start;
      }
    }

    > .icon {
      position: absolute;
      right: 24px;
      top: 24px;
    }

    .timer-option {
      padding: 24px;
    }

    .timer-values {
      border-top: 1px solid #eeeeee;
      display: flex;
      flex-direction: column;
      padding: 24px;

      .input {
        margin-bottom: 16px;

        :last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }
`;

const TimedTaskConfig: FC<CommonOverlayProps<any>> = ({
  closeAllOverlays,
  closeOverlay,
  props: {},
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [minPeriod, setMinPeriod] = useState(null);
  const [maxPeriod, setMaxPeriod] = useState(null);

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <div className="header">Time your Task</div>
        <div className="body">
          <Delete
            className="icon"
            fontSize="small"
            onClick={() => console.log('delete timer')}
          />
          <div className="timer-option">
            <Select
              label="Select Condition"
              options={[
                {
                  label: 'Complete the task under set time',
                  value: 'LESS_THAN',
                },
                {
                  label: 'Perform the task Not Less than set time',
                  value: 'NOT_LESS_THAN',
                },
              ]}
              onChange={(option) => setSelectedOption(option)}
              placeHolder="Choose an option"
            />
          </div>

          {/* {selectedOption ? (
            <div className="timer-values">
              {selectedOption.value === 'LESS_THAN' ? (
                <div className="timer-value">
                  <label>{selectedOption.label}</label>
                  <div>
                    <ArrowDropUp
                      className="icon"
                      onClick={() => {
                        console.log('increase quantity by 1');
                      }}
                    />
                    <span>{minPeriod}</span>
                    <ArrowDropDown
                      className="icon"
                      onClick={() => {
                        console.log('decrease quantity by 1');
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="timer-value">
                    <label>Set Minimum time </label>
                    <div>
                      <ArrowDropUp
                        className="icon"
                        onClick={() => {
                          console.log('increase quantity by 1');
                        }}
                      />
                      <span>{minPeriod}</span>
                      <ArrowDropDown
                        className="icon"
                        onClick={() => {
                          console.log('decrease quantity by 1');
                        }}
                      />
                    </div>
                  </div>
                  <div className="timer-value">
                    <label>Set Maximum time </label>
                    <div>
                      <ArrowDropUp
                        className="icon"
                        onClick={() => {
                          console.log('increase quantity by 1');
                        }}
                      />
                      <span>{maxPeriod}</span>
                      <ArrowDropDown
                        className="icon"
                        onClick={() => {
                          console.log('decrease quantity by 1');
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null} */}
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default TimedTaskConfig;
