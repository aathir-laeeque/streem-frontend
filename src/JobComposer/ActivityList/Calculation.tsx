import { Button } from '#components';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { executeParameter, fixParameter } from './actions';
import { ParameterProps } from './types';

const CalculationParameter: FC<ParameterProps> = ({
  parameter,
  isCorrectingError,
  isTaskCompleted,
}) => {
  const dispatch = useDispatch();
  const {
    parameters: { parametersById, parametersMappedToJobById },
  } = useTypedSelector((state) => state.composer);

  return (
    <div className="calculation-parameter" data-id={parameter.id} data-type={parameter.type}>
      <span className="head">Calculation</span>
      <span className="expression" data-for={parameter.id}>
        {parameter.label} = {parameter.data.expression}
      </span>
      <span className="head">Input(s)</span>
      {Object.entries(parameter.data.variables).map(([key, value]: any) => {
        return (
          <span className="variable">
            <span className="name">{key}:</span>
            <span className="value">
              {value.label} =
              {parametersById?.[value.parameterId]?.response?.value ||
                parametersMappedToJobById?.[value.parameterId]?.response?.value ||
                '-'}
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
            {parameter.label} = {parameter.response.value} {parameter.data.uom}
          </span>
        </>
      )}
    </div>
  );
};

export default CalculationParameter;
