import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  html {
    height: 100%
  }

  body {
    height: 100%;
    width: 100dvw;
    display: flex;
    flex: 1;
  }

  * {
    font-family: 'Nunito', sans-serif !important;
    font-weight: normal;
    box-sizing: border-box;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 18px;
    height: 18px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #fafafa;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #E0E0E0;
    border-radius: 10px;
    border:4px solid #fafafa;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #C6C6C6;
  }

  #root {
    display: flex;
    flex: 1;
  }

  .icon {
    color: #999999;
    cursor: pointer;
  }

  .hide {
    display: none !important;
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

      .optional-badge {
        color: #999999;
        font-size: 12px;
        margin-left: 4px;
      }
    }

    &-input[type="text"],
    &-input[type="number"] {
      background-color: #f4f4f4;
      border: 1px solid transparent;
      border-bottom-color: #bababa;
      outline: none;
      padding: 10px 16px;

      :active,
      :focus {
        border-color: #1d84ff;
      }

      &.error {
        border-color: #eb5757;
      }
    }

    &-textarea {
      border: 1px solid #bababa;
      border-radius: 4px;
      color: #000000;
      outline: none;
      resize: none;
      padding: 16px;

      :disabled {
        background-color: #fafafa;
        border-color: transparent;
        color: #999999;
      }

      :active,
      :focus {
        border-color: #1d84ff;
      }

      ::-webkit-input-placeholder {
        text-align: center;
        line-height: 74px;
        color: #a8a8a8;
      }

      :-moz-placeholder {
        text-align: center;
        line-height: 74px;
        color: #a8a8a8;
      }

      ::-moz-placeholder {
        text-align: center;
        line-height: 74px;
        color: #a8a8a8;
      }

      :-ms-input-placeholder {
        text-align: center;
        line-height: 74px;
        color: #a8a8a8;
      }

    }

    .field-error {
      color: #eb5757;
      margin-top: 8px;
    }
  }

  // Handle input heights on osx/ios devices
  input[type="number"],
  input[type="text"],
  input[type="email"],
  input[type="date"],
  input[type="datetime-local"] {
    min-height: 18px;
  }
`;

export default GlobalStyles;
