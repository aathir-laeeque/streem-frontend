import styled from 'styled-components';

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

    #create-job {
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
