import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  grid-area: header;

  .job-primary-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid #f4f4f4;
    padding: 16px;

    .checklist-name {
      font-size: 20px;
      color: #000000;
      line-height: 24px;
      font-weight: 600;
    }

    .job-state {
      display: flex;
      align-items: center;
    }

    .buttons-container {
      display: flex;
      align-items: center;

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
    }
  }

  .job-secondary-header {
    display: flex;
    padding: 16px;

    .job-id,
    .checklist-id {
      display: flex;
      align-items: center;
      padding-right: 16px;
      border-right: 1px solid #f4f4f4;
      font-size: 14px;
      color: #000000;
    }

    .checklist-id {
      padding-left: 16px;
    }

    .job-assignees {
      padding: 0px 16px;
      display: flex;

      .avatar {
        background: #f4f4f4;
        color: #1d84ff;
        border: 1px solid #ffffff;
        transition: margin 0.1s ease-in-out;
      }

      .avatar:not(:first-child) {
        margin-left: -8px;
      }

      &:hover {
        .avatar:not(:last-child) {
          margin-right: 10px;
        }
      }
    }

    .job-activities {
      display: flex;
      align-items: center;
      padding: 0px 16px;
      color: #1d84ff;
      font-size: 14px;
      cursor: pointer;
    }
  }
`;

export default Wrapper;
