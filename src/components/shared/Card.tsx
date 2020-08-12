import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface CardProps {
  heading: string;
  subHeading: string;
  children: ReactNode;
}

const Wrapper = styled.div.attrs({})`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  .card {
    width: 75%;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    background-color: #fff;
    padding: 28px 28px 20px 28px;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.2),
      0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 3px 4px 0 rgba(0, 0, 0, 0.14);

    .row {
      padding: 12px;
    }

    .right-align {
      display: flex;
      justify-content: flex-end;
    }

    .center-align {
      display: flex;
      font-size: 20px;
      justify-content: center;
    }

    .title {
      font-size: 24px;
      font-weight: bold;
    }

    .heading {
      font-size: 16px;
      font-weight: 600;
      color: #666666;
    }

    .terms {
      color: #999999;
      font-size: 16px;
      letter-spacing: 0.15px;
      padding-bottom: 0px;
      text-align: center;
    }

    .link {
      color: #1d84ff;
      text-decoration: unset;
      cursor: pointer;
    }

    .primary-button {
      margin-right: 0px;
      flex: 1;
      display: flex;
      font-size: 20px;
      width: 100%;
      justify-content: center;
      line-height: 1;
      background-color: #1d84ff;
    }

    .error-container {
      display: flex;
      flex-wrap: wrap;

      > div {
        display: flex;
        flex: 0 50%;
        width: 100%;
        font-size: 14px;
        line-height: 19px;
        color: #666666;
        align-items: center;

        .indicator {
          width: 7px;
          height: 7px;
          margin-right: 6px;
          border-radius: 4px;
          background-color: #5aa700;
          display: inline-block;
        }
      }
    }
  }
`;

export const Card: FC<CardProps> = ({ heading, subHeading, children }) => {
  return (
    <Wrapper>
      <div className="card">
        <span className="row title">{heading}</span>
        <span className="row heading">{subHeading}</span>
        {children}
      </div>
    </Wrapper>
  );
};