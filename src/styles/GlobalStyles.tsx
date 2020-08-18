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
        border-bottom-color: #8d8d8d;
        border-bottom-width: 1px;
        color: #161616;
        flex: 1;
        letter-spacing: 0.16;
        line-height: 1.4;
        padding: 12px 16px;
        outline: none;

        ::placeholder {
          color: #a8a8a8;
        }

        :active,
        :focus {
          border-color: #1d84ff;
          // border-bottom-color: #1d84ff;
          border-width: 2px;
        }

        :disabled {
          background-color: transparent;
          border: none;
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
          border-bottom-color: #1d84ff;
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
        padding: 12px 16px;
        background-color: #f5f5f5;
        position: relative;

        :after {
          position: absolute;
          content: "";
          top: 14px;
          right: 10px;
          width: 0;
          height: 0;
          border: 6px solid transparent;
          border-color: #000 transparent transparent transparent;
        }
      }
    }
  }

  .form-field-label + .form-field-input,
  .form-field-label + .form-field-select {
    margin-top: 8px;
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

  .MuiMenuItem-root {
    padding: 8px 12px !important;
    font-size: 14px !important;
    justify-content: space-between !important;
    font-weight: normal !important;
    line-height: normal !important;
    letter-spacing: normal !important;
    color: #666666 !important;
    font-family: 'Nunito', sans-serif !important;
  }

  .MuiMenu-list {
    padding: 0px !important;
  }

  .MuiMenu-paper {
    min-width: 180px !important;
  }

  .MuiListItem-button:hover {
    text-decoration: none !important;
    background-color: rgba(29, 132, 255, 0.2) !important;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active  {
      -webkit-box-shadow: 0 0 0 30px #f4f4f4 inset !important;
  }

  .new-form-field {
    display: flex;
    flex-direction: column;

    &-label {
      color: #161616;
      font-size: 14px;
      letter-spacing: 0.16px;
      line-height: 1.29;
      margin-bottom: 8px;
    }

    &-input[type="text"] {
      background-color: #f4f4f4;
      border: 1px solid transparent;
      border-bottom-color: #bababa;
      outline: none;
      padding: 10px 16px;

      :active,
      :focus {
        border-color: #1d84ff;
      }
    }
  }
`;

export default GlobalStyles;
