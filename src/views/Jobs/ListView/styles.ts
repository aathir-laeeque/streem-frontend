import styled from 'styled-components';
export const Composer = styled.div`
  background: #fff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  height: inherit;

  .list-body {
    height: calc(100% - 150px);
  }

  .list-header-columns {
    :first-child {
      padding-left: 16px;
    }

    :nth-child(2) {
      justify-content: center;
    }
  }

  .list-status {
    font-size: 12px;
    line-height: 0.83;
    color: #f7b500;
    display: flex;
    align-items: center;
    margin-left: -4px;
  }

  .title-group {
    padding-left: 12px;
    margin-top: 0px;
  }
`;
