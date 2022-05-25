import styled from 'styled-components';

export const Wrapper = styled.div.attrs({
  className: 'checklist-activity',
})`
  .list {
    &-container {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    &-item {
      align-items: center;
      display: flex;

      .item-content {
        align-items: center;
        background-color: #f4f4f4;
        border: 1px solid transparent;
        border-bottom-color: #bababa;
        display: flex;
        flex: 1;
        padding: 10px 16px;

        background-color: transparent;
        cursor: pointer;
        padding-left: 0;
      }

      > .icon {
        margin-left: 24px;

        /* override for jobs view */
        display: none;
      }
    }
  }
`;
