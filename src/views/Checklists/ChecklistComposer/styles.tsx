import styled, { css } from 'styled-components';

export const Composer = styled.div`
  display: grid;
  grid-template-areas:
    'header header'
    'stagelist steps';

  grid-template-rows: auto 1fr;
  grid-template-columns: 300px 1fr;
  height: inherit;

  .header {
    align-items: center;
    background-color: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    grid-area: header;
    justify-content: space-between;
    z-index: 1;

    &-item {
      font-size: 16px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 0.75;
      letter-spacing: normal;
      color: #12aab3;
      border-bottom: 2px solid #12aab3;
      padding: 18px 32px;
    }

    &-auto-save {
      font-size: 12px;
      font-weight: 200;
      font-style: italic;
      line-height: 0.75;
      margin-left: auto;
      margin-right: 16px;
    }
  }

  .stage {
    &-container {
      background-color: #fff;
      box-shadow: 1px 0 3px 0 rgba(0, 0, 0, 0.12),
        1px 0 1px 0 rgba(0, 0, 0, 0.14);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    &-list {
      counter-reset: item;
      display: flex;
      flex-direction: column;
      grid-area: stagelist;
      list-style-type: none;
      margin: 0;
      padding: 8px;
      max-height: calc(100% - 80px);
      overflow: scroll;
    }

    &-item {
      align-items: center;
      background-color: #ffffff;
      border-radius: 3px;
      /* box-shadow: 1px 0 3px 0 rgba(0, 0, 0, 0.12), 1px 0 1px 0 rgba(0, 0, 0, 0.14); */
      display: flex;
      line-height: normal;
      list-style-position: inside;
      padding: 8px;
      margin-bottom: 8px;
      /* border: 1px solid transparent; */
      border: 1.5px solid transparent;
      border-color: #f4f4f4;

      :last-child {
        margin-bottom: 0;
      }

      &::before {
        content: counter(item) ' ';
        counter-increment: item;
        margin: 0 16px;
      }

      &-active {
        border-color: #12aab3;
      }

      > span {
        display: flex;
        flex: 1;
        background-color: #f4f4f4;
        padding: 8px;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
      }
    }

    &-control-buttons {
      display: flex;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
      margin-top: auto;
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: calc(100% - 16px);

      > div {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-right: 1.5px solid #f4f4f4;

        :last-child {
          border: none;
        }

        > img {
          margin-bottom: 8px;
        }

        > span {
          font-size: 8px;
          line-height: 0.5;
          color: #333333;
          text-transform: capitalize;
          margin-top: 5px;
        }
      }
    }
  }

  .steps {
    &-container {
      grid-area: steps;
      display: grid;
      grid-template-areas: 'stagenumber' 'stageName' 'steps';
      grid-template-rows: 16px 32px 1fr;

      padding: 24px 16px;
      overflow: hidden;
      padding-right: 0;
    }

    &-active-stage-number {
      grid-area: stagenumber;
      color: #666666;
      font-size: 12px;
    }

    &-active-stage-name {
      grid-area: stageName;
      color: #000000;
      font-size: 24px;
      font-weight: bold;
      margin-top: 4px;
    }

    &-list {
      &-container {
        margin-top: 16px;
        overflow: scroll;
        padding: 1px;
      }

      &-item {
        border-radius: 5px;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12),
          0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        margin-bottom: 24px;
        padding: 24px 16px;
        display: flex;
        flex: 1.5;
        border: 1px solid transparent;
        background-color: #ffff;

        &-active {
          border-color: #12aab3;
        }

        .add-circle {
          margin-left: 16px;
        }
      }
    }
  }

  .step {
    &-name {
      font-size: 20px;
      font-weight: 400;
      padding: 16px 8px;
      background-color: #f4f4f4;
      border-bottom: 2px solid transparent;

      &-active {
        border-bottom-color: #00aab4;
      }
    }

    &-controls {
      display: flex;
      background-color: #f4f4f4;

      &-item {
        flex: 1;
        align-items: center;
        display: flex;
        justify-content: center;
        border-right: 1px solid #dadada;
        padding: 16px;
        color: #00aab4;

        :last-child {
          border-right: none;
        }
      }
    }

    &-interactions {
      display: flex;
      flex-direction: column;
    }

    &-interaction {
      display: flex;
      margin-top: 16px;

      &-container {
        flex: 1;
        padding: 32px 16px;
        border-radius: 4px;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12),
          0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }

      > .more-options {
        margin-left: 16px;
      }

      > .sort-arrow {
        margin-right: 16px;
      }
    }
  }

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

      &-controls {
        display: flex;
        margin-left: auto;
        border: solid 1px #dadada;
        border-radius: 5px;

        > span {
          border-right: 1px solid #dadada;
          padding: 0 8px;
          display: flex;
          align-items: center;
          justify-content: center;

          :last-child {
            border-right: none;
          }
        }

        > .control-button {
          color: #00aab4;
          font-size: 24px;
        }

        > .quantity {
          font-size: 16px;
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
      font-size: 20px;
      color: #12aab3;
    }
  }

  .instruction-interaction {
    > textarea {
      outline: none;
      border: none;
      padding: 8px;
      width: calc(100% - 16px);
      resize: none;
      color: #666666;
      border-bottom: 2px solid #12aab3;
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
            0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          width: 100%;
          background: none;
          display: flex;
          padding: 5px 0;
          align-items: center;
          justify-content: center;
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

        &-value {
          margin-left: 16px;
          color: #666666;
          font-size: 18px;
        }

        > .checkbox {
          margin-top: 3px;
        }

        > .remove-button {
          margin-left: auto;
          color: #999999;
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

  .icon {
    color: #999999;
  }

  .form {
    &-field {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;

      :last-child {
        margin-bottom: 0;
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
