import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    height: 100vh;
    width: 100vw;
  }

  * {
    font-family: 'Nunito', sans-serif;
    font-weight: normal;
    box-sizing: border-box;
  }

  #root {
    height: inherit;
    width: inherit;
  }

  .icon {
    color: #999999;
    cursor: pointer;
  }

  .form {
    &-field {
      display: flex;
      flex-direction: column;

      &-label {
        font-size: 12px;
        color: #393939;
        line-height: 1.2;
        letter-spacing: 0.32px;
        font-weight: normal;
        font-style: normal;
      }

      &-input[type="number"],
      &-input[type="text"] {
        background-color: #f5f5f5;
        border: 2px solid transparent;
        border-bottom-color: #4f4f4f;
        border-bottom-width: 1px;
        color: #161616;
        flex: 1;
        letter-spacing: 0.16;
        line-height: 1.4;
        padding: 12px 5px;
        margin-top: 8px;
        outline: none;

        ::placeholder {
          color: #a8a8a8;
        }

        :active,
        :focus {
          border-color: #12aab3;
          border-width: 2px;
        }
      }

      &-input[type="checkbox"] {
        margin-right: 5px;
        margin-top: 3px;
      }

      &-textarea {
        border: none;
        border-bottom: 1px solid #bababa;
        color: #666666;
        outline: none;
        resize: none;

        :focus {
          border-bottom-color: #12aab3;
        }

        :disabled {
          border-bottom: none;
          background-color: transparent;
        }
      }

      &-select {
        border: none;
        outline: none;
        border-bottom: 1px solid #bababa;
        color: #666666;
      }
    }
  }

  .hide {
    display: none !important;
  }

  .no-margin {
    margin: 0 !important;
  }

  .no-border {
    border: 0 !important;
  }

  .no-background {
    background-color: transparent !important;
  }
`;

export default GlobalStyles;
