import { TextInput } from '#components';
import {
  ArrowDownward,
  ArrowUpward,
  Delete,
  FileCopy,
} from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';

import {
  deleteStage,
  duplicateStage,
  reOrderStage,
  setActiveStage,
} from './actions';
import { StageCardWrapper } from './styles';
import { StageCardProps } from './types';
import { updateStageName } from './actions';

const StageCard = forwardRef<HTMLDivElement, StageCardProps>(
  ({ index, isActive, isFirstItem, isLastItem, stage }, ref) => {
    const dispatch = useDispatch();

    return (
      <StageCardWrapper
        ref={ref}
        isActive={isActive}
        onClick={() => dispatch(setActiveStage(stage.id))}
      >
        <div className="stage-header">
          <div className="order-control">
            <ArrowUpward
              className="icon"
              fontSize="small"
              onClick={(event) => {
                event.stopPropagation();
                if (!isFirstItem) {
                  dispatch(
                    reOrderStage({ from: index, to: index - 1, id: stage.id }),
                  );
                }
              }}
            />
            <ArrowDownward
              className="icon"
              fontSize="small"
              onClick={(event) => {
                event.stopPropagation();
                if (!isLastItem) {
                  dispatch(
                    reOrderStage({ from: index, to: index + 1, id: stage.id }),
                  );
                }
              }}
            />
          </div>

          <div className="stage-name">Stage {index + 1}</div>

          <Delete
            className="icon"
            id="stage-delete"
            onClick={(event) => {
              event.stopPropagation();
              dispatch(deleteStage(stage?.id));
            }}
          />
        </div>

        <div className="stage-body">
          <TextInput
            defaultValue={stage.name}
            label="Name the Stage"
            name="stageName"
            onChange={debounce(({ value }) => {
              dispatch(updateStageName({ id: stage.id, name: value }));
            }, 500)}
          />
        </div>

        <div
          className="stage-footer"
          onClick={(event) => {
            event.stopPropagation();
            dispatch(duplicateStage(stage?.id));
          }}
        >
          <FileCopy className="icon" fontSize="small" />
          Duplicate
        </div>
      </StageCardWrapper>
    );
  },
);

StageCard.displayName = 'Stage-Card';

export default StageCard;
