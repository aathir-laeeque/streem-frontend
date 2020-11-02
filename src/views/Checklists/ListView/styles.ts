import styled from 'styled-components';

export const Composer = styled.div`
  background: #fff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  height: inherit;

  .list-code {
    padding-left: 28px;
  }

  .list-header-columns {
    :first-child {
      padding-left: 40px;
    }
  }

  .list-options {
    padding: 0;
  }

  #more-actions {
    color: #1d84ff;

    > .icon {
      color: #1d84ff;
    }
  }

  #create-prototype {
    margin-left: auto;
  }

  .list-title {
    padding-left: 28px;
  }

  .item-state {
    font-size: 12px;
    display: flex;
    align-items: center;
    padding-left: 28px;
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
