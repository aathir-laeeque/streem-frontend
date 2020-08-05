import styled from 'styled-components';

export const Wrapper = styled.div.attrs({
  className: 'step-interactions-list',
})`
  display: flex;
  flex-direction: column;

  .interaction {
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

    &-content {
      flex: 1;
      padding: 16px;
      border: 1px solid transparent;
      border-radius: 4px;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2);

      &-active {
        border-color: #12aab3;
      }

      .optional-switch {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        &-label {
          font-size: 16px;
          color: #666666;
        }
      }
    }

    .more-options {
      margin-left: 24px;
    }
  }

  /* TODO: make styles better */
  .checklist-interaction {
    .checklist-container {
      display: flex;
      flex-direction: column;
      margin-top: 5px;

      .list-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 16px;

        :first-child {
          margin-top: 10px;
        }

        :last-child {
          margin-bottom: 0;
        }

        input[type='text'] {
          border-bottom-color: transparent;

          :focus {
            border-bottom-color: #12aab3;
          }
        }

        > .icon {
          height: 12px;
          width: 12px;
          margin-left: auto;
          align-self: flex-start;
          margin-top: 3px;
          margin-left: 10px;
        }
      }

      .add-new-item {
        align-items: center;
        color: #12aab3;
        cursor: pointer;
        display: flex;
        font-size: 20px;
        width: max-content;

        .icon {
          color: #12aab3;
          margin-right: 5px;
        }
      }
    }
  }

  /* TODO: make styles better */
  .material-interaction {
    margin: 0;
    padding: 0;
    counter-reset: item;
    list-style-type: none;

    .header {
      display: flex;
      margin-bottom: 8px;

      > span {
        display: flex;
        flex: 1;
        font-size: 16px;
        letter-spacing: 1px;
        color: #333333;

        :first-child {
          justify-content: center;
        }

        :last-child {
          justify-content: flex-end;
        }
      }
    }

    &-item {
      list-style-position: inside;
      display: flex;
      margin-bottom: 20px;
      align-items: center;

      :last-child {
        margin-bottom: 0;
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
        margin-left: 15px;

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

    .add-new-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #12aab3;
      width: max-content;

      > .icon {
        color: #12aab3;
        margin-right: 5px;
      }
    }
  }

  /* TODO: make styles better */
  .shouldbe-interaction {
    display: flex;
    flex-direction: column;

    > .form-field {
      margin-top: 24px;

      :first-child {
        margin-top: 0;
      }
    }

    #target-rules {
      display: flex;

      > .form-field {
        flex: 1;
        margin-right: 16px;
        margin-top: 24px;

        :last-child {
          margin-right: 0;
        }
      }
    }
  }

  /* TODO: make styles better */
  .yes-no-interaction {
    display: flex;
    flex-direction: column;

    .form-field {
      margin-top: 24px;
    }

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
          width: 100%;
          background: none;
          display: flex;
          padding: 5px 0;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-top: 24px;
        }

        .yes-button {
          border-color: #12aab3;
          color: #12aab3;

          &-filled {
            background-color: #12aab3;
            color: #ffffff;
          }
        }

        .no-button {
          color: #e24c4c;
          border-color: #e24c4c;

          &-filled {
            background-color: #e24c4c;
            color: #ffffff;
          }
        }
      }
    }
  }
`;
