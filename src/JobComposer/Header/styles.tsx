import styled from 'styled-components';

const Wrapper = styled.div<{ isInfoExpanded: boolean }>`
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  grid-area: header;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transition: all 0.2s ease-in;
  height: ${({ isInfoExpanded }) => (isInfoExpanded ? '40vh' : '64px')};
  max-height: 80vh;
  z-index: 1;

  .main-header {
    display: flex;
    .drawer-toggle {
      width: 0px;
      overflow: hidden;
      transition: width 0.2s ease-in;
      display: flex;
      gap: 12px;
      margin: 12px 0px 12px 12px;
      cursor: pointer;
      align-items: center;
      background: #f4f4f4;
      justify-content: center;
    }

    .job-primary-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border-bottom: 1px solid #f4f4f4;
      padding: 12px 16px;

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
        gap: 16px;

        .more {
          padding: 6px;
          border: none;
          cursor: pointer;
          background-color: #f4f4f4;
          color: #161616;
          display: flex;
          align-items: center;
        }

        .open-overview {
          @media (min-width: 900px) {
            display: none;
          }
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

    .expand-job-meta {
      position: absolute;
      width: 32px;
      height: 32px;
      left: calc(50% - 16px);
      bottom: -16px;
      z-index: 1;
      border-radius: 50%;
      background: #f4f4f4;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
        0 2px 4px -1px rgba(0, 0, 0, 0.2);
      cursor: pointer;

      @media (min-width: 900px) {
        bottom: ${({ isInfoExpanded }) => (isInfoExpanded ? '-16px' : '16px')};
        right: 68px;
        left: unset;
      }
    }
  }

  .job-info {
    overflow: hidden;
    display: grid;
    .content {
      height: 100%;
      overflow: auto;
      padding: 0px 24px 24px;
      h4 {
        font-weight: 700;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.16px;
        color: #161616;
      }
      .info-row {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        .info-item {
          width: 20%;
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-weight: 400;
          line-height: 16px;
          .info-item-label {
            font-size: 12px;
            letter-spacing: 0.32px;
            color: #525252;
          }
          .info-item-value {
            font-size: 14px;
            letter-spacing: 0.16px;
            color: #161616;
          }
        }
      }
    }
  }

  @media (max-width: 900px) {
    .main-header {
      .drawer-toggle {
        width: 40px;
        height: 40px;
      }
      .job-primary-header {
        .checklist-name {
          font-size: 14px;
          line-height: 1;
        }

        .job-state {
          font-size: 12px;
        }
      }
    }
  }
`;

export default Wrapper;
