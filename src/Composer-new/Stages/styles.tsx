import { StageCardProps } from '#Composer/StageList/types';
import styled, { css } from 'styled-components';

const StageListWrapper = styled.div.attrs({
  className: 'stage-list-container',
})`
  grid-area: stage-list;
  overflow: auto;
`;

const StageCardWrapper = styled.div.attrs({
  className: 'stage',
})<Pick<StageCardProps, 'isActive'>>`
  background-color: #ffffff;
  border: solid 1px #eeeeee;
  border-radius: 4px;
  box-shadow: 1px 2px 8px 0 rgba(29, 132, 255, 0.2);
  display: flex;
  flex-direction: column;
  margin-right: 12px;
  margin-bottom: 16px;

  .stage {
    &-header {
      align-items: center;
      background-color: #fafafa;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      display: flex;

      .order-control {
        background-color: #f4f4f4;
        border-top-left-radius: 4px;
        display: flex;
        flex-direction: column;
        margin-right: 16px;
        padding: 4px;
      }

      #stage-delete {
        margin-left: auto;
        margin-right: 16px;
      }
    }

    &-name {
      color: #000000;
      font-size: 20px;
      font-weight: bold;
    }

    &-body {
      padding: 16px;
    }

    &-footer {
      align-items: center;
      background-color: #f4f4f4;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      color: #999999;
      cursor: pointer;
      display: flex;
      font-size: 14px;
      padding: 8px 16px;

      > .icon {
        margin-right: 8px;
      }
    }
  }

  ${({ isActive }) =>
    isActive
      ? css`
          border-color: #1d84ff;
        `
      : null}
`;

export { StageListWrapper, StageCardWrapper };
