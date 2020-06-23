import React, { FC } from 'react';
import { Field } from 'formik';

interface SingleSelectProps {
  label: string;
  name: string;
  options: { label: string; value: string | number }[];
}

const SingleSelect: FC<SingleSelectProps> = ({ label, name, options }) => (
  <div className="form-field">
    <label className="field-label">{label}</label>
    <Field as="select" name={name} className="field-value">
      {options.map((option, index) => (
        <option value={option.value} key={index}>
          {option.label}
        </option>
      ))}
    </Field>
  </div>
);

export default SingleSelect;
