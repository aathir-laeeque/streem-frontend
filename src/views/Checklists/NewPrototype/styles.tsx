import background from '#assets/images/new-prototype-background.png';
import styled from 'styled-components';

export const Wrapper = styled.div`
  background-color: #ffffff !important;
  height: inherit;

  background: url(${background});
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  margin: 0 auto;
  position: relative;

  .prototype-form {
    background-color: #ffffff;
    border: 1px solid #eeeeee;
    box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.08);
    display: grid;
    grid-template-areas: 'header header' 'left-side right-side' 'footer footer';
    grid-template-columns: 1fr 1fr;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 800px;

    .heading {
      border-bottom: 1px solid #eeeeee;
      font-size: 20px;
      font-weight: bold;
      grid-area: header;
      line-height: normal;
      letter-spacing: normal;
      margin: 0;
      padding: 24px;
    }

    .left-side {
      border-right: 1px solid #eeeeee;
      grid-area: left-side;
      max-height: 450px;
      overflow: auto;
      padding: 24px;
      padding-right: 16px;

      .input-field {
        display: flex;
        flex-direction: column;
        margin-bottom: 24px;

        .label {
          color: #666666;
          font-size: 12px;
          margin: 0;
          margin-bottom: 8px;
        }

        .value {
          color: #000;
          font-size: 14px;
          margin: 0;
        }
      }

      .owner {
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;

        .label {
          color: #000000;
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          margin-bottom: 8px;

          &-light {
            font-weight: normal;
            color: #666666;
            font-size: 12px;
            margin: 0;
            margin-bottom: 8px;
          }
        }

        .container {
          display: flex;
        }

        &-details {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 16px;

          .owner-id {
            color: #666666;
            font-size: 10px;
            font-weight: 600;
          }

          .owner-name {
            color: #666666;
            font-size: 20px;
          }
        }
      }

      .revised {
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid #eeeeee;
      }

      .input {
        margin-top: 16px;
      }
    }

    .right-side {
      grid-area: right-side;
      max-height: 450px;
      overflow: auto;
      padding: 24px;
      padding-left: 16px;

      .textarea {
        margin-bottom: 24px;
      }

      .author {
        align-items: center;
        display: flex;
        margin-top: 8px;

        .select {
          flex: 1;
        }

        #remove {
          margin-left: 8px;
        }
      }
    }

    .form-submit-buttons {
      border-top: 1px solid #eeeeee;
      display: flex;
      grid-area: footer;
      padding: 24px;
    }
  }
`;
