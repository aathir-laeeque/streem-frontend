import styled from 'styled-components';

export const Wrapper = styled.div`
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

        :focus-within {
          border-color: #1d84ff;
        }

        /* overrides for jobs view start */
        background-color: transparent;
        cursor: pointer;
        padding-left: 0;

        :focus-within {
          border-color: transparent;
          border-bottom-color: #bababa;
        }
        /* overrides for jobs view end */

        .dummy-checkbox {
          border: 1px solid #000000;
          border-radius: 2px;
          height: 20px;
          width: 20px;
          margin-right: 12px;
          cursor: not-allowed;

          /* override for jobs view */
          cursor: inherit;

          &.checked:before {
            content: "'\2713'";
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            background-color: #1d84ff;
          }
        }

        input {
          background-color: transparent;
          border: none;
          outline: none;
          flex: 1;

          /* override for jobs view */
          color: #000000;
          cursor: inherit;
        }

        .selected {
          text-decoration: line-through;
        }
      }

      > .icon {
        margin-left: 24px;

        /* override for jobs view */
        display: none;
      }
    }
  }
`;
