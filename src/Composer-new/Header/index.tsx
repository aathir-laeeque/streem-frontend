import { Button1 } from '#components';
import { ComposerEntity } from '#Composer-new/types';
import { useTypedSelector } from '#store';
import {
  AddCircle,
  Edit,
  FiberManualRecord,
  Group,
  PlayCircleFilled,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { addNewStage } from '../Stages/actions';
import HeaderWrapper from './styles';
import { addNewTask } from '../Tasks/actions';
import { Checklist } from '../checklist.types';

const JobHeader: FC = () => {
  return <HeaderWrapper>Composer Header for Job Entity</HeaderWrapper>;
};

const ChecklistHeader: FC = () => {
  const dispatch = useDispatch();
  const {
    data,
    stages: { activeStageId },
  } = useTypedSelector((state) => state.prototypeComposer);

  return (
    <HeaderWrapper>
      <div className="header-content">
        <div className="header-content-left">
          <span className="checklist-name-label">Checklist Name</span>
          <div className="checklist-name">{data?.name}</div>
          <div className="checklist-status">
            Configuration Status :<FiberManualRecord className="icon" />
            In Progress
          </div>
        </div>

        <div className="header-content-right">
          <Button1 id="edit" variant="textOnly">
            <Edit className="icon" fontSize="small" />
            Edit
          </Button1>

          <Button1 id="view-reviewers" variant="textOnly">
            <Group className="icon" fontSize="small" />
            View all Authors
          </Button1>

          <Button1 className="submit">Submit</Button1>
        </div>
      </div>

      <div className="prototype-add-buttons">
        <Button1
          variant="textOnly"
          id="new-stage"
          onClick={() => dispatch(addNewStage())}
        >
          <AddCircle className="icon" fontSize="small" />
          Add a new Stage
        </Button1>

        <Button1
          variant="textOnly"
          id="new-task"
          onClick={() => {
            if (activeStageId) {
              dispatch(
                addNewTask({
                  checklistId: (data as Checklist).id,
                  stageId: activeStageId,
                }),
              );
            }
          }}
        >
          <AddCircle className="icon" fontSize="small" />
          Add a new Task
        </Button1>

        <Button1 variant="textOnly" id="preview">
          <PlayCircleFilled className="icon" fontSize="small" />
          Preview
        </Button1>
      </div>
    </HeaderWrapper>
  );
};

const Header: FC = () => {
  const { entity } = useTypedSelector((state) => state.prototypeComposer);

  if (entity === ComposerEntity.CHECKLIST) {
    return <ChecklistHeader />;
  } else {
    return <JobHeader />;
  }
};

export default Header;
