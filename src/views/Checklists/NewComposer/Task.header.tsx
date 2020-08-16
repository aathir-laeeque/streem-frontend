import {
  AddCircleOutline,
  DateRangeOutlined,
  ErrorOutlineOutlined,
  TimerOutlined,
} from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import styled, { css } from 'styled-components';

import { Task } from './checklist.types';
import { useTypedSelector } from '#store';
import { ComposerState } from './composer.types';

const Wrapper = styled.div`
  grid-area: header;

  align-items: center;
  display: grid;
  /* grid-template-areas: 'vacant content header-icons'; */
  /* grid-template-columns: 16px 1fr 24px; */
  /* grid-column-gap: 24px; */

  ${(props) =>
    props.isEditing
      ? css`
          grid-template-areas: 'vacant content header-icons';
          grid-template-columns: 16px 1fr 24px;
          grid-column-gap: 24px;
        `
      : css`
          grid-template-areas: 'content';
          grid-template-columns: 1fr;
          /* grid-column-gap: 24px; */
        `}

  .vacant {
    grid-area: vacant;

    ${(props) =>
      !props.isEditing
        ? css`
            display: none;
          `
        : null}
  }

  .content {
    grid-area: content;

    background-color: #f4f4f4;
    border-radius: 5px;
    display: flex;
    flex-direction: column;

    > input,
    > span {
      background-color: transparent;
      border: none;
      border-bottom: 2px solid #ddd;
      font-size: 18px;
      font-weight: 400;
      outline: none;
      padding: 16px 8px;
      width: 100%;

      :focus {
        border-bottom-color: #1d84ff;
      }
    }

    > span {
      border-bottom: none;
    }

    .task-control {
      display: flex;

      &-item {
        align-items: center;
        border-right: 1px solid #dadada;
        cursor: pointer;
        display: flex;
        flex: 1;
        justify-content: center;
        padding: 8px 16px;

        :last-child {
          border-right: none;
        }

        > .icon {
          margin-right: 5px;
          height: 18px;
          width: 18px;
        }

        > span {
          color: #999999;
          font-size: 10px;
          line-height: 1;
        }

        &.active {
          > svg {
            color: #1d84ff;
          }

          > span {
            color: #1d84ff;
          }
        }
      }
    }
  }

  .header-icons {
    grid-area: header-icons;

    ${(props) =>
      !props.isEditing
        ? css`
            display: none;
          `
        : null}
  }
`;

const Header: FC<{ task: Task; index: number }> = ({ task, index }) => {
  const { register, getValues } = useFormContext();

  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <Wrapper isEditing={isEditing}>
      <div className="vacant" />

      <div className="content">
        {isEditing ? (
          <input
            name={`tasks[${index}].name`}
            ref={register()}
            defaultValue={task.name}
            // TODO: make api call to update data in the BE
            onChange={debounce(() => {
              const updatedValue = getValues()['tasks'][index];
              console.log('value from onChange event :: ', updatedValue);
            }, 500)}
            onBlur={debounce(() => {
              const updatedValue = getValues()['tasks'][index];
              console.log('value from onBlur event :: ', updatedValue);
            }, 500)}
          />
        ) : (
          <span>{task.name}</span>
        )}

        <div className={`task-control${!isEditing ? ' hide' : ''}`}>
          <div
            className={`task-control-item${task.hasStop ? ' active' : ''}`}
            // onClick={() => update({ hasStop: !task.hasStop })}
          >
            <ErrorOutlineOutlined className="icon" />
            <span>Add Stop</span>
          </div>
          <div className="task-control-item">
            <DateRangeOutlined className="icon" />
            <span>Due On</span>
          </div>
          <div
            className={`task-control-item${task.timed ? ' active' : ''}`}
            // onClick={() => update({ timed: !task.timed })}
          >
            <TimerOutlined className="icon" />
            <span>Timed</span>
          </div>
        </div>
      </div>

      <div className="header-icons">
        <AddCircleOutline className="icon" />
      </div>
    </Wrapper>
  );
};

export default Header;
