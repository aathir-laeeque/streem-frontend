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
      padding-left: 30px;
      width: 25%;
    }
  }

  .list-card-columns {
    :first-child {
      width: 25%;
    }
  }

  .title-group {
    padding-left: 12px;
    margin-top: 0px;
  }
`;
