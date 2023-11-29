import React, { FC } from 'react';
import { ParameterProps } from './Parameter';

const CalculationParameter: FC<ParameterProps> = ({ parameter }) => {
  return (
    <div className="calculation-parameter" data-id={parameter.id} data-type={parameter.type}>
      <span className="head">Calculation</span>
      <span className="expression" data-for={parameter.id}>
        {parameter.label} = {parameter.data.expression}
      </span>
      <span className="head">Input(s)</span>
      {Object.entries(parameter.data.variables).map(([key, value]: any) => {
        const response = parameter?.response?.choices?.find((choice: any) => {
          return choice.parameterId === value.parameterId;
        });

        return (
          <span className="variable" key={key}>
            <span className="name">{key}:</span>
            <span className="value">
              {value.label} = {response?.value || ' -'}
            </span>
          </span>
        );
      })}
      {parameter?.response?.value && (
        <>
          <span className="head" style={{ marginTop: 24 }}>
            Result
          </span>
          <span className="result">
            {parameter.label} = {parameter.response.value} {parameter.data.uom || ''}
          </span>
        </>
      )}
    </div>
  );
};

export default CalculationParameter;
