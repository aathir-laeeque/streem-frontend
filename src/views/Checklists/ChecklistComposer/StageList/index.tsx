import { useTypedSelector } from '#store';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  FileCopyOutlined,
  PlaylistAddOutlined,
} from '@material-ui/icons';

import { Wrapper } from './styles';
import { Stage } from './types';
import { setActiveStage, updateStageName } from './actions';

const StageList = () => {
  const { stages, activeStageIndex } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!activeStageIndex) {
      dispatch(setActiveStage(0));
    }
  }, []);

  return (
    <Wrapper>
      <ol className="stage-list">
        {(stages as Array<Stage>)?.map((stage, index) => (
          <li
            key={index}
            className={`stage-list-item${
              index === activeStageIndex ? ' stage-list-item-active' : ''
            }`}
            onClick={() => dispatch(setActiveStage(index))}
          >
            <input
              type="text"
              name="stageName"
              value={stage.name}
              onChange={(e) =>
                dispatch(updateStageName({ name: e.target.value, index }))
              }
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
