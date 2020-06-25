import { Form } from '#components/FormComponents';

import React from 'react';
import { compose } from 'redux';
import { FieldArray, reduxForm } from 'redux-form';
import { noop } from 'lodash';

import StepView from './StepView';

const StepsListForm = () => (
  <Form style={{ overflow: 'scroll' }}>
    <FieldArray
      name="steps"
      // TODO: replace any type for fields
      component={({ fields }: { fields: any }) => (
        <ul className="step-list">
          {fields.map((field: string, index: number) => (
            <StepView field={field} key={index} active={false} onClick={noop} />
          ))}
        </ul>
      )}
    />
  </Form>
);

const withReduxForm = reduxForm({
  form: 'stepsListForm',
  enableReinitialize: true,
});

export default compose(withReduxForm)(StepsListForm);
