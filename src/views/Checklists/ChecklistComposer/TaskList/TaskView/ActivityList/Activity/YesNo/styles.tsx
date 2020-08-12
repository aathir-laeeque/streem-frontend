import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  .buttons-container {
    display: flex;
    margin-top: 12px;

    .button-item {
      :first-child {
        input {
          background-color: #ecfff4;
          border: 1px solid transparent;
          border-bottom-color: #27ae60;

          :active,
          :focus {
            border-color: #27ae60;
          }
        }
      }

      :last-child {
        margin-left: 20px;

        input {
          background-color: #ffebeb;
          border: 1px solid transparent;
          border-bottom-color: #eb5757;

          :active,
          :focus {
            border-color: #eb5757;
          }
        }
      }

      button {
        padding: 5px 20px;
        background-color: transparent;
      }

      .yes-button {
        border: 1px solid #27ae60;
        border-radius: 4px;
        color: #27ae60;

        &.filled {
          background-color: #27ae60;
          color: #ffffff;
        }
      }

      .no-button {
        border: 1px solid #eb5757;
        border-radius: 4px;
        color: #eb5757;

        &.filled {
          background-color: #eb5757;
          color: #ffffff;
        }
      }
    }
  }
`;
