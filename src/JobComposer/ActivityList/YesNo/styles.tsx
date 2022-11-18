import styled from 'styled-components';

export const Wrapper = styled.div.attrs({
  className: 'yes-no-parameter',
})`
  display: flex;
  flex-direction: column;

  .buttons-container {
    display: flex;
    margin-top: 12px;

    .button-item {
      button {
        background-color: transparent;
        cursor: pointer;
        font-size: 14px;
        letter-spacing: 0.16px;
        line-height: 1.29;
        padding: 5px 20px;
      }

      :first-child {
        input {
          background-color: #e1fec0;
          border-bottom-color: #27ae60;

          :active,
          :focus {
            border-color: #27ae60;
          }
        }

        button {
          border: 1px solid #5aa700;
          color: #5aa700;
          outline: none;

          &.filled {
            color: #ffffff;
            background-color: #427a00;
          }
        }
      }

      :last-child {
        margin-left: 20px;

        input {
          background-color: #ffebeb;
          border-bottom-color: #eb5757;

          :active,
          :focus {
            border-color: #eb5757;
          }
        }

        button {
          border: 1px solid #ff6b6b;
          color: #ff6b6b;

          &.filled {
            color: #ffffff;
            background-color: #cc5656;
          }
        }
      }
    }
  }

  .decline-reason {
    margin-top: 16px;
  }
`;
