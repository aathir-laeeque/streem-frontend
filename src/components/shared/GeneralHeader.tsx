import { NavItem } from '#components/NavigationMenu/styles';
import { toggleIsDrawerOpen } from '#store/extras/action';
import { Menu } from '@material-ui/icons';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';

const GeneralHeaderWrapper = styled.div`
  display: flex;
  grid-area: header;
  padding-block: 14px;

  .header-meta {
    display: flex;
    flex-direction: column;
    grid-area: header;
    justify-content: space-between;
    .heading {
      color: #000000;
      font-size: 20px;
      font-weight: bold;
      line-height: normal;
      text-align: left;
    }

    .sub-heading {
      color: #666666;
      font-size: 12px;
      line-height: normal;
      text-align: left;
    }
  }

  .drawer-toggle {
    width: 0px;
    overflow: hidden;
    transition: width 0.2s ease-in;
    display: flex;
  }

  .back-button {
    cursor: pointer;
  }

  @media (max-width: 900px) {
    height: 64px;
    .drawer-toggle {
      width: 48px;
    }
    .header-meta {
      justify-content: center;
      .sub-heading {
        display: none;
      }
    }
    .back-button {
      padding-top: 8px;
    }
  }
`;

export const GeneralHeader = ({
  heading,
  subHeading,
  showBackButton,
  onBackButtonClick,
}: {
  heading?: string;
  subHeading?: string;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
}) => {
  const dispatch = useDispatch();
  return (
    <GeneralHeaderWrapper>
      <div className="drawer-toggle">
        <NavItem onClick={() => dispatch(toggleIsDrawerOpen())}>
          <Menu />
        </NavItem>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {showBackButton && (
          <KeyboardArrowLeftOutlinedIcon className="back-button" onClick={onBackButtonClick} />
        )}
        <div className="header-meta">
          {heading && <div className="heading">{heading}</div>}
          {subHeading && <div className="sub-heading">{subHeading}</div>}
        </div>
      </div>
    </GeneralHeaderWrapper>
  );
};
