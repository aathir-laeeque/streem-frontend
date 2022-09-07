import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';

const Notification = styled(ToastContainer)`
  .Toastify__toast-container {
  }
  .Toastify__toast {
    min-height: 48px;
    border-radius: 4px;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
      0 2px 4px -1px rgba(0, 0, 0, 0.2);
  }
  .Toastify__toast--default {
    padding: 0 8px 0 0;
  }
  .Toastify__toast-body {
    color: #666666;
    font-size: 14px;
    display: flex;
    margin: 0;

    .notification-layout {
      align-items: center;
      display: flex;
      padding: 8px 0 8px 8px;

      .content {
        display: flex;
        flex-direction: column;
        color: #000;
        font-size: 16px;

        span {
          margin-top: 4px;
          font-size: 12px;
          color: #333333;
        }
      }
    }
    .notification--success {
      border-left: 4px solid #5aa700;
    }
    .notification--error {
      border-left: 4px solid red;
    }

    .toast_icon {
      font-size: 18px;
      margin-right: 10px;
    }
    .toast_icon--success {
      color: #5aa700;
    }
    .toast_icon--error {
      color: red;
    }
  }
  .Toastify__progress-bar {
  }
  .Toastify__close-button {
    color: #999999;
    margin-top: 10px;
  }
`;

export default Notification;
