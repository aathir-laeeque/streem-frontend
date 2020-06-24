import { Form, renderInputField } from '#components/FormComponents';
import { RootState } from '#store';

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Field, FieldArray, reduxForm } from 'redux-form';

const renderSteps = ({ fields }) => (
  <ul className="step-list">
    {fields.map((field, index) => (
      <li key={index}>
        <Field
          name={`${field}.name`}
          type="text"
          component={renderInputField}
          placeHolder="Step header"
        />
      </li>
    ))}
  </ul>
);

const StepsListForm = () => (
  <Form>
    <FieldArray name="steps" component={renderSteps} />
  </Form>
);

const mapStateToProps = (state: RootState) => ({});

const withConnect = connect(mapStateToProps, null);

const withReduxForm = reduxForm({
  form: 'stepsListForm',
  enableReinitialize: true,
});

export default compose(withReduxForm, withConnect)(StepsListForm);
