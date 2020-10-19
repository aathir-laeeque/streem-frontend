import { ChecklistStates } from '#Composer-new/checklist.types';
import styled, { css } from 'styled-components';

type HeaderWrapperProps = {
  checklistState: ChecklistStates;
};

const HeaderWrapper = styled.div<HeaderWrapperProps>`
  display: flex;
  flex-direction: column;
  grid-area: header;

  .before-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -6px 0px 4px 0px;

    .alert {
      padding: 4px 80px;
      border-radius: 4px;
      border: solid 1px #d6e9ff;
      background-color: #e7f1fd;
      min-width: 600px;
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

  .main-header {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);

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
              margin: 0px 0px 0px -4px;
            }

            span {
              font-size: 12px;
              line-height: 24px;
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
            color: #1d84ff;
            margin: 0px;
          }
        }

        #edit:hover {
          > .icon {
            color: #fff;
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
  }

  ${({ checklistState }) => {
    switch (checklistState) {
      case ChecklistStates.BEING_REVIEWED:
        return css`
          .prototype-add-buttons {
            display: none;
          }
        `;

      default:
        return null;
    }
  }}
`;

export default HeaderWrapper;
