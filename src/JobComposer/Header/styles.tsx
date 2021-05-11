import styled from 'styled-components';

const Wrapper = styled.div`
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  grid-area: header;
  z-index: 1;

  .header-item {
    &.active {
      border-bottom: 2px solid #1d84ff;
    }

    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    line-height: 0.75;
    color: #1d84ff;
    padding: 16px;
  }

  .auto-save-text {
    font-size: 12px;
    font-weight: 200;
    font-style: italic;
    line-height: 0.75;
    margin-left: auto;
    margin-right: 16px;
    visibility: hidden;
  }

  .buttons-container {
    display: flex;

    button {
      line-height: 1.14;
      padding: 8px 16px;
    }

    .bulk-assign,
    .job-summary,
    .print-job,
    .sign-off,
    .view-info {
      margin-right: 8px;
    }

    .dropdown-button {
      align-items: center;
      background-color: #1d84ff;
      border-radius: 4px;
      display: flex;
      margin-right: 8px;

      button {
        margin-right: 0;
      }

      .drop-menu {
        border-left: 1px solid #005dcc;
        display: flex;
        padding: 4px;

        .icon {
          color: #ffffff;
        }
      }
    }
  }
`;

export default Wrapper;
