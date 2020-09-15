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

  /* width */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #eeeeee;
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #1d84ff;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #005dcc;
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
  }

  .filter-container {
    width: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .MuiPickersStaticWrapper-root {
      border-bottom: 1px solid #dadada;

      .MuiPickersDesktopDateRangeCalendar-root {
        justify-content: center;

        .MuiPickersDesktopDateRangeCalendar-arrowSwitcher {
          padding: 16px 8px 8px 8px;
          
          .MuiSvgIcon-root {
            color: #333333;
          }
        }
      }
    }

    .MuiTypography-subtitle1 {
      font-family: 'Open Sans', sans-serif;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }

    .MuiPickersDesktopDateRangeCalendar-calendar {
      min-height: 230px;
    }

    .MuiInput-underline:before {
      border-bottom: 1px solid #999999;
    }

    .MuiInput-underline:after {
      border-bottom: 2px solid #1d84ff;
    }

    .MuiInput-underline:hover:not(.Mui-disabled):before {
      border-bottom: 1px solid #999999;
    }

    .MuiFormLabel-root {
      font-size: 10px;
    }

    .MuiIconButton-root {
      color: #999999;
    }

    .MuiFormLabel-root.Mui-focused {
      color: #1d84ff;
    }

    .MuiPickersCalendar-weekDayLabel {
      font-size: 12px;
      line-height: 0.83;
      color: #7f8fa4;
    }

    .MuiPickersDay-root {
      border-radius: 0px !important;
    }

    .MuiPickersDay-today {
      border: none !important;
    }

    .MuiPickersDay-root.Mui-selected {
      background-color: #1d84ff !important;
      color: #000;
    }

    .MuiPickersDateRangeDay-dayInsideRangeInterval {
      color: #000;
    }

    .MuiPickersDateRangeDay-rangeIntervalDayPreview {
      border-radius: 0px !important;
      border-top-left-radius: 0px !important;
      border-bottom-left-radius: 0px !important;
    }

    .MuiPickersDateRangeDay-rangeIntervalDayHighlight {
      background-color: rgba(29, 132, 255, 0.2);
      border-radius: 0px !important;
      border-top-left-radius: 0px !important;
      border-bottom-left-radius: 0px !important;
    }

    .MuiInputBase-input {
      font-family: 'Nunito', sans-serif;
      color: #999999;
    }

    .timepicker-container {
      display: flex;
      justify-content: space-between;
      flex: 1;
      padding: 16px;

      .MuiFormControl-root {
        margin-left: 8px;

        :first-child {
          margin-right: 8px;
          margin-left: 0px;
        }

        .MuiInputBase-adornedStart {
          svg {
            padding-left: 4px;
            padding-right: 4px;
            color: #999999;
          }
        }

        .MuiFormHelperText-root {
          display: none;
        }
      }
    }

    .picker-actions {
      width: 100%;
      padding: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .MuiMenu-list {
    > div:focus {
      outline: none;
    }

    li {
      .MuiSvgIcon-root {
        font-size: 16px;
      }
    }
  }
`;

export default GlobalStyles;
