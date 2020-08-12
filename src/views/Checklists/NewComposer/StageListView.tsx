import { useTypedSelector } from '#store';
import { debounce } from 'lodash';
import React, { FC } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { ComposerState } from './composer.types';
import { setActiveStage } from './stageListView.action';
import { Stage } from './checklist.types';

const Wrapper = styled.div.attrs({
  className: 'stage-list-view',
})`
  background-color: #fff;
  box-shadow: 1px 0 3px 0 rgba(0, 0, 0, 0.12), 1px 0 1px 0 rgba(0, 0, 0, 0.14);
  grid-area: stagelist;
  overflow: hidden;
  position: relative;

  .stage-list {
    counter-reset: item;
    display: flex;
    flex-direction: column;
    list-style-type: none;
    margin: 0;
    /* max-height: calc(100% - 80px); */
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
        border-color: #12aab3;
      }

      * {
        display: flex;
        flex: 1;
        background-color: #f4f4f4;
        padding: 8px;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        width: 100%;
      }

      input {
        border: none;
        outline: none;

        :disabled {
          cursor: pointer;
        }
      }
    }
  }
`;

const StageList: FC = () => {
  const {
    stages: { list, activeStageId },
    composerState,
  } = useTypedSelector((state) => state.newComposer);

  const dispatch = useDispatch();

  const isEditing = composerState === ComposerState.EDIT;

  const { control, register, getValues } = useForm<{ stages: Stage[] }>({
    defaultValues: { stages: list },
    mode: 'onChange',
  });

  const { fields } = useFieldArray({ control, name: 'stages' });

  return (
    <Wrapper>
      <ol className="stage-list">
        {fields.map((field, index) => (
          <li
            key={field.id}
            className={`stage-list-item ${
              field.id === activeStageId ? 'active' : ''
            }`}
            // TODO: look in to this type error
            onClick={() => dispatch(setActiveStage(field.id))}
          >
            {isEditing ? (
              <input
                name={`stages[${index}].name`}
                ref={register()}
                defaultValue={field.name}
                // TODO: make api call to update data in the BE
                onChange={debounce(() => {
                  const updatedValue = getValues()['stages'][index];
                  console.log('value from onChange event :: ', updatedValue);
                }, 500)}
                onBlur={debounce(() => {
                  const updatedValue = getValues()['stages'][index];
                  console.log('value from onBlur event :: ', updatedValue);
                }, 500)}
              />
            ) : (
              <span>{field.name}</span>
            )}
          </li>
        ))}
      </ol>
    </Wrapper>
  );
};

export default StageList;
