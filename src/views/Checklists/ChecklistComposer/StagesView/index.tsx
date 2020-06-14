import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  FileCopyOutlined,
  PlaylistAddOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';

import { StagesViewProps } from './types';

const StagesView: FC<StagesViewProps> = ({
  stages,
  activeStage,
  setActiveStage,
}) => {
  return (
    <div className="stage-container">
      <ol className="stage-list">
        {stages.map((stage, index) => (
          <li
            key={index}
            className={`stage-item ${
              index === activeStage ? 'stage-item-active' : ''
            }`}
            onClick={() => setActiveStage(index)}
          >
            <span>{stage.name}</span>
          </li>
        ))}
      </ol>
      <div className="stage-control-buttons">
        <div>
          <PlaylistAddOutlined />
          <span>New Section</span>
        </div>
        <div>
          <FileCopyOutlined />
          <span>Duplicate</span>
        </div>
        <div>
          <ArrowUpwardOutlined />
          <span>Move up</span>
        </div>
        <div>
          <ArrowDownwardOutlined />
          <span>move down</span>
        </div>
      </div>
    </div>
  );
};

export default StagesView;
