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
        font-size: 8px;
        color: #666666;
      }

      &-input[type="number"],
      &-input[type="text"] {
        border: none;
        border-bottom: 1px solid #bababa;
        color: #666666;
        flex: 1;
        outline: none;

        :focus {
          border-bottom-color: #12aab3;
        }

        ::placeholder {
          color: #999999;
        }

        :disabled {
          border-bottom: none;
          background-color: transparent;
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
`;

export default GlobalStyles;
