import { ProgressBar } from '#components';
import { Assignment, PanTool } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import { setActiveStage } from './actions';
import { StageCardProps } from './types';

const Wrapper = styled.div.attrs({
  className: 'stage-list-item',
})`
  background-color: #ffffff;
  border: solid 1px transparent;
  border-color: #eeeeee;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.08);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 16px;

  .stage {
    &-header {
      align-items: center;
      display: flex;

      .stage-order {
        color: #666666;
        font-size: 12px;
      }

      .stop-icon {
        margin-left: auto;
        visibility: hidden;
      }

      .stage-badge {
        align-items: center;
        background-color: #f4f4f4;
        border-radius: 4px;
        display: flex;
        padding: 4px;

        > .icon {
          margin-right: 4px;
        }

        span {
          font-size: 12px;
          line-height: 0.83;
          color: #999999;
        }
      }
    }

    &-name {
      color: #000000;
      font-size: 14px;
      margin-top: 8px;
    }

    &-task-bar {
      margin-top: 16px;

      span {
        color: #000000;
        display: block;
        font-size: 12px;
        margin-bottom: 8px;
      }
    }
  }

  ${({ isActive }) =>
    isActive
      ? css`
          border-color: #1d84ff;
          box-shadow: 0 8px 8px 0 rgba(153, 153, 153, 0.16);
        `
      : null}
`;

const StageCard: FC<StageCardProps> = ({ stage, isActive }) => {
  const dispatch = useDispatch();

  return (
    <Wrapper
      isActive={isActive}
      onClick={() => {
        if (!isActive) {
          dispatch(setActiveStage(stage.id));
        }
      }}
    >
      <div className="stage-header">
        <span className="stage-order">Stage {stage.orderTree}</span>

        <PanTool className="icon stop-icon" />

        <div className="stage-badge">
          <Assignment className="icon" />
          <span>Not Started</span>
        </div>
      </div>

      <div className="stage-name">{stage.name}</div>

      <div className="stage-task-bar">
        <span>0% Task completed</span>
        <ProgressBar percentage={isActive ? 50 : 0} />
      </div>
    </Wrapper>
  );
};

export default StageCard;
