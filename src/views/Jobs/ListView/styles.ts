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
    gap: 12px;

    > button {
      margin-right: 0;
      padding: 8px;
    }

    .select-filter {
      width: 240px;
    }

    .dropdown-filter {
      padding-block: 4px;
      color: #1d84ff;
    }

    .upload-image > div {
      gap: 4px;
      margin-bottom: 8px;
    }

    .filter-buttons-wrapper {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 8px;
      color: #1d84ff;
      font-size: 14px;
      cursor: pointer;

      .icon {
        height: 18px;
        width: 18px;
        color: inherit;
      }
    }
  }

  #create {
    margin-left: auto;
    padding-block: 12px;
    padding-inline: 24px;
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
