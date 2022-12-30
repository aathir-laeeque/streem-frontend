import Menu from '@material-ui/core/Menu';
import styled from 'styled-components';

export const StyledMenu = styled(Menu)`
  .MuiMenu-paper {
    min-width: 180px !important;
  }

  .MuiMenu-list {
    padding: 0px !important;

    > div:focus {
      outline: none;
    }

    li {
      .MuiSvgIcon-root {
        font-size: 16px;
      }
    }
  }

  .MuiMenuItem-root {
    padding: 8px 12px !important;
    font-size: 14px !important;
    justify-content: space-between !important;
    font-weight: normal !important;
    line-height: normal !important;
    letter-spacing: normal !important;
    color: #666666 !important;
  }

  .MuiListItem-button:hover {
    text-decoration: none !important;
    background-color: rgba(29, 132, 255, 0.2) !important;
  }
`;

export const ListActionMenu = styled(StyledMenu)`
  .MuiPaper-root {
    border: 1px solid #1d84ff;
    background: #f4f4f4 !important;
    border-radius: 0px !important;
    box-shadow: none !important;
  }

  .MuiMenuItem-root {
    padding: 0px !important;
    .list-item {
      margin: 0px 16px;
      border-bottom: 1px solid #dadada;
      display: flex;
      flex: 1;
      padding: 11px 0px;

      svg {
        font-size: 16px;
      }

      span {
        padding-left: 16px;
        font-size: 14px;
        line-height: 1.29;
        color: #000;
      }
    }
  }
`;
