import styled from 'styled-components';
export const Composer = styled.div`
  margin: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .audit-logs-wrapper {
    grid-area: activity;
    background: #fff;
    box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
    padding: 8px;
    overflow: hidden;
    display: flex;
    flex: 1;

    .list-card-columns:first-child {
      width: unset;
      flex: 1;
    }

    .icon {
      font-size: 16px;
      color: #ff6b6b;
    }

    .log-header {
      display: flex;
      align-items: center;

      .header-item {
        font-size: 14px;
        color: #666666;
        margin-right: 16px;
        align-items: center;
        display: flex;
      }
    }

    .log-row {
      display: flex;
      flex-direction: column;
      padding: 8px 11px;
      margin-top: 16px;
      border-left: 1px dashed #bababa;

      .log-item {
        display: flex;
        align-items: center;
        padding: 8px 0px;
      }

      .circle {
        margin-left: -16px;
        background-color: #bababa;
        border-radius: 4px;
        height: 8px;
        width: 8px;
      }

      .content {
        margin-left: 16px;
        display: flex;
        align-items: center;

        .content-items {
          font-size: 12px;
          color: #666666;
          margin-right: 8px;
          word-break: keep-all;
        }
      }
    }

    .list-header-columns {
      :first-child {
        padding-left: 30px;
      }
    }

    .user-actions {
      font-size: 14px;
      color: #666666;
      font-weight: 600;
      letter-spacing: 1px;
      cursor: pointer;
    }
  }
`;

export const UserFilterWrapper = styled.div`
  padding: 16px 16px 0px;
  min-height: 380px;

  .top-content {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
    padding: 0px 0px 16px;

    span {
      padding: 4px 16px;
      color: #1d84ff;
      font-size: 14px;
      cursor: pointer;
    }

    .searchboxwrapper {
      position: relative;
      flex: 1;
      padding: 0px 13px;
      background-color: #fff;
      border-bottom: 1px solid #bababa;

      svg {
        background: #fff;
        border: 0;
        height: 40px;
        width: 20px;
        right: unset;
        color: #000;
        position: absolute;
        left: 16px;
        top: 0;
      }

      .searchbox {
        border: none;
        outline: none;
        font-size: 14px;
        color: #999999;
        background: #fff;
        height: 40px;
        width: calc(100% - 28px);
        margin-left: 28px;

        ::-webkit-input-placeholder {
          color: #bababa;
        }
      }
    }
  }

  .scrollable-content {
    height: 320px;
    overflow: auto;

    .item {
      display: flex;
      flex: 1;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      padding: 9px 0px 9px 15px;

      :last-child {
        border-bottom: none;
      }

      .thumb {
        border: 1px solid #fff;
        width: 36px;
        height: 36px;
        color: #1d84ff;
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ecedf1;
      }

      .middle {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 0 15px;

        .userId {
          font-size: 8px;
          font-weight: 600;
          color: #666666;
          margin-bottom: 4px;
        }
        .userName {
          font-size: 18px;
          color: #666666;
          text-transform: capitalize;
        }
      }

      .right {
        margin-top: -15px;

        .checkmark {
          border-radius: 0px;
          border-color: #333;
          background-color: #fff;
          border-width: 2px;
        }

        .container input:checked ~ .checkmark {
          background-color: #1d84ff;
          border: none;
        }

        .container input:disabled ~ .checkmark {
          background-color: #eeeeee;
          border: none;
        }
      }
    }
  }
`;
