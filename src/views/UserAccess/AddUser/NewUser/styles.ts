import styled from 'styled-components';
export const Composer = styled.div`
  height: calc(100% - 60px);
  display: flex;
  flex: 1;

  .bold {
    font-weight: 600;
  }

  .content {
    flex: 0.75;
    padding: 16px;
    height: 100%;
    border-radius: 4px;
    box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    overflow: auto;

    .heading {
      line-height: 32px;
      font-size: 24px;
      color: #333333;
      margin-bottom: 8px;
    }

    .sub-heading {
      line-height: 22px;
      font-size: 16px;
      color: #333333;
    }

    .sub-title {
      font-size: 12px;
      color: #666666;
      margin-top: 8px;
    }

    .left-gutter {
      padding-left: 10px;
    }

    .right-gutter {
      padding-right: 10px;
    }

    .outerwrapper {
      flex: 1;
    }

    .flex-row {
      display: flex;
      flex: 1;
      padding: 16px 0px;
    }

    .partition {
      display: flex;
      flex: 1;
      margin: 0px 0px 32px 0px;
      height: 1px;
      background-color: #bababa;
    }

    .flex-col {
      flex: 0.5;
    }

    .wrapper {
      background-color: #fff;
      border-bottom: 1px solid #999999;
      border-radius: 0px;

      .input {
        color: #333333;
        padding: 4px;
      }
    }

    .wrapper.active {
      border-bottom: 2px solid #1d84ff;
    }

    .wrapper.disabled {
      border: none;
      border-bottom: 1px dashed #999999;
      opacity: 0.5;
    }
  }

  > .actions {
    flex: 0.25;
    padding: 0px 0px 8px 8px;

    .primary-button {
      margin-right: 0px;
      flex: 1;
      display: flex;
      font-size: 20px;
      width: 100%;
      justify-content: center;
      line-height: 22px;
      background-color: #1d84ff;
    }

    .primary-button.flat {
      background-color: transparent;
      color: #1d84ff;
      font-size: 16px;
    }
  }
`;
