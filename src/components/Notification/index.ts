import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';

export const Notification = styled(ToastContainer).attrs({
  // custom props
})`
  .Toastify__toast-container {
  }
  .Toastify__toast {
  }
  .Toastify__toast--error {
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
    background: #fff;
    border-left: 4px solid #5aa700;
  }
  .Toastify__toast-body {
    color: #000;
  }
  .Toastify__progress-bar {
  }
  .Toastify__close-button {
    color: #000;
    align-self: center;
  }
`;
