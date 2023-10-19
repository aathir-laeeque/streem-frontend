import styled from 'styled-components';

const ViewWrapper = styled.div`
  display: grid;
  grid-row-gap: 16px;
  grid-template-areas: 'header' 'list-table';
  grid-template-rows: 50px minmax(0, 1fr);
  padding-inline: 8px;
  overflow: hidden;
  flex: 1;

  .list-table {
    display: grid;
    grid-area: list-table;
    grid-template-areas: 'tab-header' 'tab-body';
    grid-template-rows: 48px minmax(0, 1fr);
    overflow: hidden;
    flex: 1;
  }
`;

const TabContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  height: 100%;

  .filters {
    align-items: flex-end;
    display: flex;
    padding: 0 0 16px;

    .process-filter,
    .resource-filter {
      margin-left: 16px;
      width: 200px;
    }

    .upload-image > div {
      gap: 6px;
      margin-left: 24px;
      margin-bottom: 8px;
    }
    .verification-search {
      max-width: 306px;
      width: 306px;
    }
    .filter-buttons-wrapper {
      padding: 2px 16px;
      margin-block: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      span {
        color: #1d84ff;
        font-size: 14px;
      }
    }
  }

  #create {
    margin-left: auto;
  }

  .task-progress {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    > span {
      color: #666666;
      font-size: 12px;
      margin-top: 8px;
    }
  }

  #more-actions {
    display: flex;
    align-items: center;
    flex: 1;
    color: #1d84ff;
    cursor: pointer;

    > .icon {
      color: #1d84ff;
    }
  }

  #more-actions-disabled {
    display: flex;
    align-items: center;
    flex: 1;
    color: #bbbbbb;
    cursor: not-allowed;

    > .icon {
      color: #bbbbbb;
    }
  }

  .item-state {
    font-size: 12px;
    display: flex;
    align-items: center;
    margin-top: 4px;

    .icon {
      font-size: 12px;
      margin: 0px 4px 0px 0px;
      color: inherit;
    }
  }

  #archive-unarchive {
    flex: 1;
    display: flex;
    align-items: center;
    cursor: pointer;

    :hover {
      color: #1d84ff;
    }
  }
`;

export { ViewWrapper, TabContentWrapper };
