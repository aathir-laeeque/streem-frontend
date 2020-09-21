import styled from 'styled-components';
export const Composer = styled.div`
  height: inherit;
  display: flex;
  flex: 1;
  flex-direction: column;

  .bold {
    font-weight: 600;
  }

  .flex-row {
    display: flex;
    flex: 1;
    padding: 16px 0px;
    flex-wrap: wrap;
  }

  .content {
    flex: 0.75;
    padding: 16px;
    padding-bottom: 120px;
    height: 100%;
    border-radius: 4px;
    box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    overflow: auto;

    .heading {
      line-height: 32px;
      font-size: 24px;
      color: #333333;
      margin-bottom: 8px;
    }

    .sub-heading {
      line-height: 22px;
      font-size: 16px;
      color: #333333;
    }

    .sub-title {
      font-size: 12px;
      color: #666666;
      margin-top: 8px;
    }

    .left-gutter {
      padding-left: 10px;
    }

    .right-gutter {
      padding-right: 10px;
    }

    .outerwrapper {
      flex: 1;
    }

    .facilities {
      padding: 8px 0px;
      width: 50%;
      display: block;
    }

    .partition {
      display: flex;
      flex: 1;
      margin: 0px 0px 32px 0px;
      height: 1px;
      background-color: #bababa;
    }

    .flex-col {
      flex: 0.5;
    }

    .wrapper {
      background-color: #fff;
      border-bottom: 1px solid #999999;
      border-radius: 0px;
      margin-top: 13px;

      .input {
        color: #333333;
        padding: 4px;
      }

      input[name='email'] {
        text-transform: lowercase;

        ::-webkit-input-placeholder {
          text-transform: capitalize !important;
        }
      }
    }

    .wrapper.active {
      border-bottom: 2px solid #1d84ff;
    }

    .wrapper.error {
      border-bottom: 2px solid #ff6b6b;
    }

    .wrapper.disabled {
      border: none;
      border-bottom: 1px dashed #999999;
      opacity: 0.5;
    }
  }

  > form {
    display: flex;
    height: inherit;
    flex: 1;

    > .actions {
      flex: 0.25;
      padding: 0px 0px 8px 8px;

      .primary-button {
        margin-right: 0px;
        flex: 1;
        display: flex;
        font-size: 20px;
        width: 100%;
        justify-content: center;
        line-height: 22px;
        background-color: #1d84ff;
      }

      .primary-button.flat {
        background-color: transparent;
        color: #1d84ff;
        font-size: 16px;
      }
    }
  }
`;
