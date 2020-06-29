import { ChecklistState } from '#views/Checklists/types';
import { useTypedSelector } from '#store';
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  FileCopyOutlined,
  PlaylistAddOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { setActiveStage, updateStage } from './actions';
import { Wrapper } from './styles';
import { Stage } from './types';

const StageList: FC = () => {
  const dispatch = useDispatch();

  const { stages, state, activeStageIndex } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const setAsActive = (index: number) =>
    index !== activeStageIndex ? dispatch(setActiveStage(index)) : undefined;

  const update = (stage: Partial<Stage>, index: number) =>
    dispatch(updateStage({ stage, index }));

  const isEditingEnabled = state === ChecklistState.ADD_EDIT;

  return (
    <Wrapper>
      <ol className="stage-list">
        {(stages as Array<Stage>).map((stage, index) => (
          <li
            key={index}
            className={`stage-list-item${
              index === activeStageIndex ? ' stage-list-item-active' : ''
            }`}
            onClick={() => setAsActive(index)}
          >
            <input
              type="text"
              name="stage-name"
              value={stage.name}
              onChange={(e) => update({ name: e.target.value }, index)}
              {...(!isEditingEnabled && { disable: true })}
            />
          </li>
        ))}
      </ol>

      <div className="stage-list-control-buttons">
        <div id="add_stage">
          <PlaylistAddOutlined className="icon" />
          <span>New Stage</span>
        </div>
        <div id="duplicate_stage">
          <FileCopyOutlined className="icon" />
          <span>Duplicate</span>
        </div>
        <div id="move_stage_up">
          <ArrowUpwardOutlined className="icon" />
          <span>Move up</span>
        </div>
        <div id="move_stage_down">
          <ArrowDownwardOutlined className="icon" />
          <span>Move down</span>
        </div>
      </div>
    </Wrapper>
  );
};

export default StageList;
