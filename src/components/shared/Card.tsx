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
    width: 528px;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    background-color: #fff;
    padding: 12px 12px 12px 12px;

    .error-span {
      color: #ff6b6b;
      align-self: center;
      padding-bottom: 16px;
      font-size: 14px;
      font-weight: bold;
    }

    .wrapper {
      border-bottom: none;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background-color: #f4f4f4;
      padding-top: 15px;

      > label {
        top: 4px;
        left: 4px;
        color: #666666;
      }

      .input {
        color: #333333;
      }

      #username {
        text-transform: lowercase;
      }
    }

    .wrapper.disabled {
      border-bottom: none;
      border: 1px dashed #999999;
      opacity: 0.6;
      padding-top: 0px;

      > label {
        position: unset;
        top: unset;
        color: #999999;
        left: unset;
        opacity: unset;
        padding: 4px 0px 0px 4px;
      }
    }

    .row {
      padding: 12px;
    }

    .hint {
      font-size: 10px;
      line-height: 1.2;
      color: #666666;
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
      font-size: 28px;
      line-height: 1.14;
    }

    .heading {
      font-size: 14px;
      letter-spacing: 0.16px;
      line-height: 1.14;
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
        line-height: normal;
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
        <span className="title" style={{ padding: '12px 12px 0px' }}>
          {heading}
        </span>
        <span className="heading" style={{ padding: '5px 12px 12px' }}>
          {subHeading}
        </span>
        {children}
      </div>
    </Wrapper>
  );
};
