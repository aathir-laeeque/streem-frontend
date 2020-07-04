import { useTypedSelector } from '#store';
import { ChecklistState } from '#views/Checklists/types';
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

  const {
    stages: { list = {}, activeStageId },
    state,
  } = useTypedSelector((state) => state.checklist.composer);

  const setAsActive = (stageId: Stage['id']) =>
    stageId !== activeStageId ? dispatch(setActiveStage(stageId)) : undefined;

  const update = (stage: Pick<Stage, 'id' | 'name'>) =>
    dispatch(updateStage(stage));

  const isEditingEnabled = state === ChecklistState.ADD_EDIT;

  return (
    <Wrapper>
      <ol className="stage-list">
        {Object.values(list)?.map((stage, index) => (
          <li
            key={index}
            className={`stage-list-item${
              stage.id === activeStageId ? ' stage-list-item-active' : ''
            }`}
            onClick={() => setAsActive(stage.id)}
          >
            <input
              type="text"
              name="stage-name"
              value={stage.name}
              onChange={(e) => update({ name: e.target.value, id: stage.id })}
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
