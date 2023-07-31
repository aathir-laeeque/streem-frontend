import { Parameter } from '#PrototypeComposer/checklist.types';
import { getParameterContent } from '#utils/parameterUtils';
import React, { FC } from 'react';

const JobCard: FC<{
  parameter: Parameter;
}> = ({ parameter }) => {
  return (
    <div className="info-item" key={parameter.label}>
      <label className="info-item-label">{parameter.label}</label>
      <span className="info-item-value">{getParameterContent(parameter)}</span>
    </div>
  );
};

export default JobCard;
