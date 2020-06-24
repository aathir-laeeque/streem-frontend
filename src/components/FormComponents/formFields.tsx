import React from 'react';

export const renderInputField = ({
  input,
  type,
  label,
  placeholder,
  meta: { touched, error },
}) => (
  <div>
    {label ? <label>{label}</label> : null}
    <div>
      <input {...input} type={type} placeholder={placeholder} />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
);
