import styled from 'styled-components';

export const Composer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

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

  #archive-unarchive {
    flex: 1;
    :hover {
      color: #1d84ff;
    }
  }

  .list-options {
    padding: 0;
  }

  #more-actions {
    flex: 1;
    color: #1d84ff;
    cursor: pointer;

    > .icon {
      color: #1d84ff;
    }
  }

  #create-prototype {
    margin-left: auto;
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
    cursor: pointer;
  }
`;

// import styled from 'styled-components';

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
  display: grid;
  grid-template-areas: 'filters' 'table';
  grid-template-rows: 40px 1fr;
  grid-row-gap: 16px;
  height: inherit;

  .filters {
    display: flex;
    grid-area: filters;

    #new-prototype {
      margin-left: auto;
    }
  }
`;

export { TabContentWrapper, ViewWrapper };
