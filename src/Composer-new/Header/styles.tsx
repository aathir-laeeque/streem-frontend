import styled from 'styled-components';

const HeaderWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  grid-area: header;

  .before-header {
    display: flex;
    align-items: center;
    justify-content: center;

    .alert {
      padding: 4px 80px;
      border-radius: 4px;
      border: solid 1px #d6e9ff;
      background-color: #e7f1fd;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        color: #1d84ff;
        font-size: 12px;
        line-height: 12px;
      }

      svg {
        color: #1d84ff;
        font-size: 13.3px;
        line-height: 13.3px;
        margin-right: 10px;
      }
    }
  }

  .header-content {
    display: flex;
    flex: 1;
    padding: 12px 16px;

    &-left {
      display: flex;
      flex-direction: column;

      .checklist {
        &-name {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;

          &-label {
            font-size: 14px;
            font-weight: normal;
            margin-bottom: 4px;
          }
        }

        &-status {
          align-items: center;
          display: flex;
          text-transform: capitalize;

          .icon {
            color: #1d84ff;
            margin: 0 4px;
          }
        }
      }
    }

    &-right {
      align-items: center;
      display: flex;
      margin-left: auto;

      #edit,
      #view-reviewers {
        > .icon {
          margin-right: 4px;
          color: #1d84ff;
        }
      }
    }
  }

  .prototype-add-buttons {
    border-top: 1px solid #dadada;
    display: grid;
    grid-template-areas: 'add-stage add-task preview';
    grid-template-columns: 300px 2fr 1fr;

    > button {
      justify-content: center;
      margin-right: 0;
      padding: 12px;

      > .icon {
        color: #1d84ff;
        margin-right: 8px;
      }
    }

    #new-stage {
      grid-area: add-stage;
    }

    #new-task {
      grid-area: add-task;
    }

    #preview {
      grid-area: preview;
    }
  }
`;

export default HeaderWrapper;
