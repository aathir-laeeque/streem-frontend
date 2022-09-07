import React, { FC } from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import styled from 'styled-components';

interface HeaderWithBack {
  heading: string;
  actionText: string;
  onActionPress: () => void;
}

const Wrapper = styled.div.attrs({})`
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  margin-bottom: 8px;

  .top-action {
    cursor: pointer;
    font-size: 12px;
    color: #1d84ff;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
  }

  .top-title {
    font-size: 20px;
    font-weight: 600;
    color: #333333;
  }
`;

export const HeaderWithBack: FC<HeaderWithBack> = ({ heading, onActionPress, actionText }) => {
  return (
    <Wrapper>
      <span className="top-action" onClick={onActionPress}>
        <ArrowBackIosIcon style={{ fontSize: 16, fontWeight: 'bold', padding: '0px 4px' }} />
        {actionText}
      </span>
      <span className="top-title">{heading}</span>
    </Wrapper>
  );
};
