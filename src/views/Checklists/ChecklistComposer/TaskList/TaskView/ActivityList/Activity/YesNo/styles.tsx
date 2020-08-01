import styled from 'styled-components';

// .yes-no-interaction {
//   display: flex;
//   flex-direction: column;

//   .form-field {
//     margin-top: 24px;
//   }

//   > .buttons-container {
//     display: flex;

//     > .button-item {
//       flex: 1;
//       margin-right: 16px;

//       :last-child {
//         margin-right: 0;
//       }

//       > button {
//         outline: none;
//         border: 1px solid transparent;
//         border-radius: 5px;
//         width: 100%;
//         background: none;
//         display: flex;
//         padding: 5px 0;
//         align-items: center;
//         justify-content: center;
//         cursor: pointer;
//         margin-top: 24px;
//       }

//       .yes-button {
//         border-color: #12aab3;
//         color: #12aab3;

//         &-filled {
//           background-color: #12aab3;
//           color: #ffffff;
//         }
//       }

//       .no-button {
//         color: #e24c4c;
//         border-color: #e24c4c;

//         &-filled {
//           background-color: #e24c4c;
//           color: #ffffff;
//         }
//       }
//     }
//   }
// }

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  .buttons-container {
    display: flex;
    margin-top: 12px;

    .button-item {
      flex: 1;

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
        width: 100%;
        padding: 5px;
      }

      .yes-button {
        border: 1px solid #27ae60;
        border-radius: 4px;
        color: #27ae60;
      }

      .no-button {
        border: 1px solid #eb5757;
        border-radius: 4px;
        color: #eb5757;
      }
    }
  }
`;
