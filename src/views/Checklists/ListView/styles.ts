import styled from 'styled-components';

export const Composer = styled.div`
  background: #fff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  height: inherit;

  .list-code {
    padding-left: 36px;
  }

  .list-header-columns {
    :first-child {
      padding-left: 40px;
    }
  }

  #more-actions {
    color: #1d84ff;

    > .icon {
      color: #1d84ff;
    }
  }

  #archive-unarchive {
    cursor: pointer;
  }
`;
