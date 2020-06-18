import styled from 'styled-components';
export const Composer = styled.div`
  background: #fff;
  border-top-left-radius: 10px;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  height: inherit;

  .list-header {
    display: flex;
    padding: 13px 0px 13px 0px;
    border-bottom: 1px solid #999999;
  }

  .list-options {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    padding: 8px 16px;
    align-items: center;
  }

  .list-header-columns {
    flex: 1;
    font-size: 12px;
    color: #666666;
    font-weight: bold;
    letter-spacing: 1px;
    display: flex;
    align-items: center;

    :first-child {
      flex: 3;
    }
  }

  .list-body {
    overflow: scroll;
    height: calc(100% - 88px);
  }

  .checklist-card {
    border-bottom: 1px solid #dadada;
    height: 80px;
    display: flex;
  }

  .checklist-card-columns {
    flex: 1;
    font-size: 12px;
    color: #666666;
    font-weight: bold;
    letter-spacing: 1px;
    display: flex;
    align-items: center;

    :first-child {
      flex: 3;
    }
  }

  .checklist-title {
    font-size: 16px;
    font-weight: 600;
    color: #12aab3;
    cursor: pointer;
  }

  .title-group {
    display: flex;
    margin-top: -10px;
    flex-direction: column;
  }

  .checklist-code {
    font-size: 11px;
    line-height: 14px;
    font-weight: 600;
    color: #333333;
  }

  .searchboxwrapper {
    position: relative;
    margin-right: 16px;
  }

  .searchbox {
    border: none;
    border-bottom: 1px solid #999999;
    outline: none;
    font-size: 13px;
    font-family: 'Open Sans', sans-serif;
    font-weight: lighter;
    color: #999999;
    width: 180px;
    height: 29px;
    background: #fff;
    padding-left: 10px;
  }

  .searchsubmit {
    width: 14px;
    height: 31px;
    position: absolute;
    top: 0;
    right: 0;
    background: #fff;
    border: none;
    border-bottom: 1px solid #999999;
    color: #999999;
    cursor: pointer;
  }

  .resetOption {
    cursor: pointer;
    color: #12aab3;
    font-size: 11px;
    font-weight: 600;
    font-style: italic;
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
