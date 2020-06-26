import styled from 'styled-components';

export const Wrapper = styled.div.attrs({
  className: 'step-interaction',
})`
  display: flex;
  margin-top: 24px;

  :first-child {
    .arrow-up {
      visibility: hidden;
    }
  }

  :last-child {
    .arrow-down {
      visibility: hidden;
    }
  }

  .more-options {
    margin-left: 24px;
  }

  .step-interaction {
    &-container {
      flex: 1;
      padding: 24px 16px;
      border-radius: 4px;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2);

      .material-interaction {
        margin: 0;
        padding: 0;
        counter-reset: item;
        list-style-type: none;

        &-item {
          list-style-position: inside;
          display: flex;
          margin-bottom: 20px;
          align-items: center;

          &-header {
            display: flex;
            margin-bottom: 8px;

            > div {
              flex: 1;
              display: flex;
              justify-content: flex-end;
              color: #333333;
              font-size: 16px;
              font-weight: 600;

              :first-child {
                justify-content: center;
              }
            }
          }

          > span {
            color: #666666;
            font-size: 16px;
          }

          &-controls {
            display: flex;
            margin-left: auto;
            border: solid 1px #dadada;
            border-radius: 5px;

            > * {
              display: flex;
              align-items: center;
              justify-content: center;
              border-right: 1px solid #dadada;

              :last-child {
                border-right: none;
              }
            }

            > svg {
              color: #00aab4;
            }

            > .quantity {
              padding: 4px 8px;
              font-size: 14px;
              color: #666666;
            }
          }

          &-image {
            height: 54px;
            width: 56px;
            margin-right: 8px;
          }

          &::before {
            content: counter(item) ' ';
            counter-increment: item;
            margin-right: 16px;
            color: #999999;
          }
        }

        &-add-new {
          display: flex;
          align-items: center;
          cursor: pointer;

          > * {
            color: #12aab3 !important;
          }

          > svg {
            margin-right: 5px;
          }
        }
      }

      .yes-no-interaction {
        display: flex;
        flex-direction: column;

        > .buttons-container {
          display: flex;

          > .button-item {
            flex: 1;
            margin-right: 16px;

            :last-child {
              margin-right: 0;
            }

            > button {
              outline: none;
              border: 1px solid transparent;
              border-radius: 5px;
              box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12),
                0 2px 2px 0 rgba(0, 0, 0, 0.14),
                0 3px 1px -2px rgba(0, 0, 0, 0.2);
              width: 100%;
              background: none;
              display: flex;
              padding: 5px 0;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            }

            .yes-button {
              border-color: #12aab3;
              color: #12aab3;
            }

            .no-button {
              color: #e24c4c;
              border-color: #e24c4c;
            }
          }
        }
      }

      .checklist-interaction {
        .checklist-container {
          display: flex;
          flex-direction: column;

          .list-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 16px;

            :last-child {
              margin-bottom: 0;
            }

            > .icon {
              height: 12px;
              width: 12px;
              margin-left: auto;
              align-self: flex-start;
              margin-top: 3px;
            }
          }
        }
      }

      .shouldbe-interaction {
        display: flex;
        flex-direction: column;

        #target-rules {
          display: flex;

          > .form-field {
            flex: 1;
            margin-right: 16px;

            :last-child {
              margin-right: 0;
            }
          }
        }
      }

      .signature-interaction {
        border: 1px dashed #bababa;
        border-radius: 5px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;

        > span {
          color: #666666;
          font-size: 20px;
          text-align: center;
        }

        > .icon-container {
          display: flex;
          flex-direction: column;
        }
      }
    }

    &-position-control {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 16px;
      height: max-content;

      > span {
        color: #999999;
        margin: 5px 0;
      }
    }
  }

  /* TODO: remove this from here and make global */
  .form {
    &-field {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;

      :last-child {
        margin-bottom: 0;
      }

      > textarea {
        outline: none;
        border: none;
        padding: 8px;
        /* width: calc(100% - 16px); */
        resize: none;
        color: #666666;
        border-bottom: 2px solid transparent;

        :focus {
          border-bottom-color: #12aab3;
        }
      }
    }

    &-input {
      border: none;
      outline: none;
      border-bottom: 1px solid #bababa;
      color: #666666;

      &-label {
        font-size: 10px;
        color: #12aab3;
      }

      &-value {
        margin-top: 2px;
      }

      &-select {
      }
    }
  }
`;
