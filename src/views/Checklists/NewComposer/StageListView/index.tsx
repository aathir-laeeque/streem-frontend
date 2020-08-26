import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { ComposerState } from '../composer.types';
import { setActiveStage, updateStage } from './action';

const Wrapper = styled.div.attrs({
  className: 'stage-list-view',
})`
  background-color: #fff;
  box-shadow: 1px 0 3px 0 rgba(0, 0, 0, 0.12), 1px 0 1px 0 rgba(0, 0, 0, 0.14);
  grid-area: stage-list-view;
  overflow: hidden;
  position: relative;

  .stage-list {
    counter-reset: item;
    display: flex;
    flex-direction: column;
    list-style-type: none;
    margin: 0;
    max-height: calc(100% - 80px);
    height: 100%;
    overflow: auto;
    padding: 8px;

    &-item {
      align-items: center;
      background-color: #ffffff;
      border: 1.5px solid #f4f4f4;
      border-radius: 3px;
      cursor: pointer;
      display: flex;
      line-height: normal;
      list-style-position: inside;
      margin-bottom: 8px;
      padding: 8px;

      :last-child {
        margin-bottom: 0;
      }

      &::before {
        content: counter(item) ' ';
        counter-increment: item;
        margin: 0 16px;
      }

      &.active {
        border-color: #1d84ff;
      }

      * {
        background-color: #f4f4f4;
        border-radius: 4px;
        color: #333333;
        font-size: 16px;
        font-weight: 600;
        padding: 8px;
        width: 100%;
      }

      input {
        border: none;
        outline: none;
      }
    }
  }
`;

const StageList: FC = () => {
  const {
    stages: { activeStageId, list, listOrder },
    composerState,
  } = useTypedSelector((state) => state.newComposer);

  const dispatch = useDispatch();

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <Wrapper>
      <ol className="stage-list">
        {listOrder.map((stageId) => {
          const stage = list[stageId];

          const isStageActive = stageId === activeStageId;

          return (
            <li
              key={stageId}
              className={`stage-list-item ${isStageActive ? 'active' : ''}`}
              onClick={() => dispatch(setActiveStage(stageId))}
            >
              {isEditing ? (
                <input
                  value={stage.name}
                  onChange={({ target: { value } }) => {
                    dispatch(updateStage({ id: stageId, name: value }));
                  }}
                  onBlur={({ target: { value } }) => {
                    dispatch(updateStage({ id: stageId, name: value }));
                  }}
                />
              ) : (
                <span>{stage.name}</span>
              )}
            </li>
          );
        })}
      </ol>
    </Wrapper>
  );
};

export default StageList;
