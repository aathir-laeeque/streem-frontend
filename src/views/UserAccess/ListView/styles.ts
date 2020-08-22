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
    line-height: 0.83;
    color: #f7b500;
    display: flex;
    align-items: center;
    margin-left: -4px;
  }

  .list-title {
    padding: 6px 0px 5px 0px;
  }

  .list-card {
    min-height: 90px;
  }

  .list-header-columns {
    :first-child {
      padding-left: 16px;
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
