import styled from 'styled-components';
export const Composer = styled.div`
  background: #fff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  height: inherit;

  .list-body {
    height: calc(100% - 150px);
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
