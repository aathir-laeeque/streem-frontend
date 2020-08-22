import React, { FC } from 'react';
import styled from 'styled-components';

interface LabeledInfoProps {
  label: string;
  value: string;
}

const Wrapper = styled.div.attrs({})`
  flex: 1;
  display: flex;
  flex-direction: column;

  .label {
    font-size: 12px;
    font-weight: bold;
    color: #999999;
  }

  .value {
    font-size: 16px;
    color: #333333;
    margin-top: 8px;
  }
`;

export const LabeledInfo: FC<LabeledInfoProps> = ({ label, value }) => {
  return (
    <Wrapper>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </Wrapper>
  );
};
