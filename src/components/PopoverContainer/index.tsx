import { TaskAssignmentPopover } from '#Composer/Popovers/TaskAssignmentPopover';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { closeAllPopoverAction, closePopoverAction } from './actions';
import { PopoverNames } from './types';

const Wrapper = styled.div``;

const getPopover = (
  type: string,
  props: any,
  closePopover: (name: string) => void,
  i: number,
  closeAllPopovers: () => void,
  popOverAnchorEl: Element | ((element: Element) => Element),
) => {
  switch (type) {
    case PopoverNames.TASK_USER_ASSIGNMENT:
      return (
        <TaskAssignmentPopover
          {...props}
          popOverAnchorEl={popOverAnchorEl}
          closeAllPopovers={closeAllPopovers}
          closePopover={(...args) =>
            closePopover(PopoverNames.TASK_USER_ASSIGNMENT, ...args)
          }
          key={i}
        />
      );

    default:
      return null;
  }
};

const PopoverContainer: FC = () => {
  const dispatch = useDispatch();

  const { currentPopovers } = useTypedSelector(
    (state) => state.popoverContainer,
  );

  const closePopover = (params: string) => {
    dispatch(closePopoverAction(params));
  };

  const closeAllPopovers = () => {
    dispatch(closeAllPopoverAction());
  };
  return (
    <Wrapper>
      {currentPopovers.map((popover, i: number) =>
        getPopover(
          popover.type,
          popover.props,
          closePopover,
          i,
          closeAllPopovers,
          popover.popOverAnchorEl,
        ),
      )}
    </Wrapper>
  );
};

export default PopoverContainer;
