import styled from 'styled-components';
export const Composer = styled.div`
  background: #fff;
  border-top-left-radius: 10px;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  height: inherit;

  .sidenav {
    height: 100%;
    width: 300px;
    position: fixed;
    z-index: 1;
    top: 0;
    right: -300px;
    background-color: #fff;
    overflow-x: hidden;
    transition: 0.5s;
    box-shadow: -5px 0 10px 0 rgba(0, 0, 0, 0.1);
  }

  .sidebar-button {
    width: 100%;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .sidebar-flat-button {
    width: 100%;
    margin-bottom: 8px;
    display: unset;
    padding: 10px 16px;
  }

  .danger {
    border: 1px solid #e24c4c;
    color: #e24c4c;
  }

  .sidebar-sections {
    border-top: 1px solid #999999;
  }

  .sidebar-heading {
    color: #999999;
    font-size: 14px;
    letter-spacing: 1px;
    padding: 10px 0;
    font-weight: 600;
  }

  .sidebar-title {
    color: #999999;
    font-size: 13px;
    letter-spacing: 1px;
    padding: 5px 0;
  }

  .sidebar-subtitle {
    color: #666666;
    font-size: 13px;
    letter-spacing: 1px;
    font-weight: 600;
    padding-bottom: 5px;
  }

  .sidebar-action {
    color: #12aab3;
    font-size: 14px;
    letter-spacing: 1px;
    padding: 10px 0;
  }

  @media screen and (max-height: 450px) {
    .sidenav a {
      font-size: 18px;
    }
  }

  .space-between {
    display: flex;
    flex: 1;
    justify-content: space-between;
  }

  .check-icon {
    font-size: 12px;
    color: #5aa700;
  }

  .sidenav {
    height: 100%;
    width: 300px;
    position: fixed;
    z-index: 1;
    top: 0;
    right: -300px;
    background-color: #fff;
    overflow-x: hidden;
    transition: 0.5s;
    box-shadow: -5px 0 10px 0 rgba(0, 0, 0, 0.1);
  }

  .sidebar-button {
    width: 100%;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .sidebar-flat-button {
    width: 100%;
    margin-bottom: 8px;
    display: unset;
    padding: 10px 16px;
  }

  .danger {
    border: 1px solid #e24c4c;
    color: #e24c4c;
  }

  .sidebar-sections {
    border-top: 1px solid #999999;
  }

  .sidebar-heading {
    color: #999999;
    font-size: 14px;
    letter-spacing: 1px;
    padding: 10px 0;
    font-weight: 600;
  }

  .sidebar-title {
    color: #999999;
    font-size: 13px;
    letter-spacing: 1px;
    padding: 5px 0;
  }

  .sidebar-subtitle {
    color: #666666;
    font-size: 13px;
    letter-spacing: 1px;
    font-weight: 600;
    padding-bottom: 5px;
  }

  .sidebar-action {
    color: #12aab3;
    font-size: 14px;
    letter-spacing: 1px;
    padding: 10px 0;
  }

  @media screen and (max-height: 450px) {
    .sidenav a {
      font-size: 18px;
    }
  }

  .space-between {
    display: flex;
    flex: 1;
    justify-content: space-between;
  }

  .check-icon {
    font-size: 12px;
    color: #5aa700;
  }
`;
