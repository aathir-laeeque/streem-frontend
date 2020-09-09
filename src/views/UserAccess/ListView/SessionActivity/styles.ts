import styled from 'styled-components';
export const Composer = styled.div`
  background: #fff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  height: inherit;

  .list-body {
    height: calc(100% - 150px);
  }

  .list-card-columns:first-child {
    width: unset;
    flex: 1;
  }

  .list-status {
    font-size: 12px;
    padding-top: 4px;
    line-height: 0.83;
    display: flex;
    align-items: center;
    color: #f7b500;

    .list-status-span {
      font-size: 12px;
      display: flex;
      align-items: center;
      text-transform: capitalize;

      .icon {
        font-size: 12px;
        margin: 0px 4px 0px 0px;
        color: inherit;
      }
    }
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
`;
