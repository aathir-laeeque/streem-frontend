import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  FileCopyOutlined,
  PlaylistAddOutlined,
} from '@material-ui/icons';
import React, { FC, useEffect } from 'react';
import { FieldArray, Field } from 'formik';

import { ListView } from './styles';
import { Stage, StageListViewProps } from './types';

const StageListView: FC<StageListViewProps> = ({
  stages,
  activeStage,
  setActiveStage,
}) => {
  useEffect(() => {
    // TODO: dispatch action to update the name of the stage
    console.log(
      'something changed in one or more stage. Update values redux',
      stages,
    );
  }, [stages]);

  return (
    <ListView>
      <FieldArray
        name="stages"
        render={() => (
          <>
            <ol className="stage-list">
              {(stages as Array<Stage>).map((_, index) => (
                <li
                  key={index}
                  className={`stage-list-item ${
                    index === activeStage ? 'stage-list-item-active' : ''
                  }`}
                  onClick={() => setActiveStage(index)}
                >
                  <Field name={`stages.${index}.name`} />
                </li>
              ))}
            </ol>

            <div className="stage-list-control-buttons">
              <div>
                <PlaylistAddOutlined className="icon" />
                <span>New Section</span>
              </div>
              <div>
                <FileCopyOutlined className="icon" />
                <span>Duplicate</span>
              </div>
              <div>
                <ArrowUpwardOutlined className="icon" />
                <span>Move up</span>
              </div>
              <div>
                <ArrowDownwardOutlined className="icon" />
                <span>move down</span>
              </div>
            </div>
          </>
        )}
      />
    </ListView>
  );
};

export default StageListView;
