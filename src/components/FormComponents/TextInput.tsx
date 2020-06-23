import React, { FC } from 'react';
import { useField } from 'formik';

interface TextInputProps {
  label: string;
  name: string;
  value: string;
}

const TextInput: FC<TextInputProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input {...props} {...field} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TextInput;
