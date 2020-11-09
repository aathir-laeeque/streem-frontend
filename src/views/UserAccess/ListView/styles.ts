import styled from 'styled-components';
export const Composer = styled.div`
  background: #fff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  height: inherit;

  .list-body {
    height: calc(100% - 150px);
  }

  .list-state {
    font-size: 12px;
    padding-top: 4px;
    line-height: 0.83;
    display: flex;
    align-items: center;
    color: #f7b500;

    .list-state-span {
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

const ViewWrapper = styled.div`
  display: grid;
  grid-row-gap: 16px;
  grid-template-areas: 'header' 'list-table';
  grid-template-rows: 50px 1fr;
  height: inherit;

  .header {
    display: flex;
    flex-direction: column;
    grid-area: header;
    justify-content: space-between;

    .heading {
      color: #000000;
      font-size: 20px;
      font-weight: bold;
      line-height: normal;
      text-align: left;
    }

    .sub-heading {
      color: #666666;
      font-size: 12px;
      line-height: normal;
      text-align: left;
    }
  }

  .list-table {
    display: grid;
    grid-area: list-table;
    grid-template-areas: 'tab-header' 'tab-body';
    grid-template-rows: 48px 1fr;
  }
`;

const TabContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .filters {
    align-items: flex-end;
    display: flex;
    padding: 0 0 16px;

    #add-user {
      margin-left: auto;
    }
  }

  .task-progress {
    > span {
      color: #666666;
      font-size: 12px;
      margin-top: 8px;
    }
  }

  .pagination {
    margin-top: auto;
    border-top: 1px solid #dadada;
    padding: 8px 0;
    display: flex;
    justify-content: center;
    align-items: center;

    > .icon {
      color: #000000;
    }

    > span {
      cursor: pointer;
      padding: 10px 0;
      margin: 0 10px;
      border-bottom: 4px solid transparent;

      &.active {
        border-bottom-color: #1d84ff;
      }
    }
  }
`;

export { ViewWrapper, TabContentWrapper };
