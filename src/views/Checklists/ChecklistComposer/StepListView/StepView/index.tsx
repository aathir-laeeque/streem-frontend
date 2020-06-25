import { useTypedSelector } from '#store';
import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@material-ui/icons';
import React, { FC } from 'react';
import { formValueSelector, FieldArray } from 'redux-form';

import Header from './Header';
import { Wrapper } from './styles';
import { StepViewProps } from './types';
import InteractionsView from './InteractionsView';

const StepView: FC<StepViewProps> = ({ active, onClick, field }) => {
  const formSelector = formValueSelector('stepsListForm');
  const { step } = useTypedSelector((state) => ({
    step: formSelector(state, field),
  }));

  const stepIndex = parseInt(field.replace(/[^0-9]/g, ''));

  return (
    <Wrapper>
      <div className="step-item-position-control">
        <ArrowUpwardOutlined className="icon icon-up" />
        <span className="step-number">{stepIndex + 1}</span>
        <ArrowDownwardOutlined className="icon icon-down" />
      </div>

      <div
        className={`step-item-content ${
          active ? 'step-item-content-active' : ''
        }`}
        onClick={onClick}
      >
        <Header step={step} field={field} />

        {/* <TimedCard step={step} /> */}

        <FieldArray
          name={`${field}.interactions`}
          // TODO: look into the type fo fields
          component={({ fields }: { fields: any }) => (
            <div className="step-interactions-list">
              {fields.map((field: string, index: number) => (
                <InteractionsView key={index} field={field} />
              ))}
            </div>
          )}
        />
      </div>

      <div className="step-item-media">step media</div>
    </Wrapper>
  );
};

export default StepView;
