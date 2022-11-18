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
    parameters: { parametersById },
  } = useTypedSelector((state) => state.composer);

  return (
    <div className="calculation-parameter">
      <span className="head">Calculation</span>
      <span className="expression">
        {parameter.label} = {parameter.data.expression}
      </span>
      <span className="head">Input(s)</span>
      {Object.entries(parameter.data.variables).map(([key, value]: any) => {
        return (
          <span className="variable">
            <span className="name">{key}:</span>
            <span className="value">
              {value.label} = {parametersById?.[value.parameterId]?.response?.value || '-'}
            </span>
          </span>
        );
      })}
      {(isCorrectingError || !isTaskCompleted) && (
        <Button
          style={{ marginTop: 24, maxWidth: 100 }}
          variant="secondary"
          onClick={() => {
            if (isCorrectingError) {
              dispatch(fixParameter(parameter));
            } else {
              dispatch(executeParameter(parameter));
            }
          }}
        >
          Calculate
        </Button>
      )}
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
