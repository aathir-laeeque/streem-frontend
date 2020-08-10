import React, { FC } from 'react';
import { SentProps } from './types';
import { CheckCircleOutline } from '@material-ui/icons';
import styled from 'styled-components';

const Wrapper = styled.div`
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

    a {
      color: #1d84ff;
      text-decoration: unset;
    }
  }
`;

type Inputs = {
  emailid: string;
};

const Sent: FC<SentProps> = () => {
  return (
    <Wrapper>
      <div className="card">
        <span className="row title">Password Reset Email Sent</span>
        <span className="row heading">
          We’ve sent an email to marcelino.langworth@yahoo.com to reset your
          password.
        </span>
        <CheckCircleOutline
          style={{
            color: '#5aa700',
            fontSize: '144px',
            alignSelf: 'center',
            margin: '24px 0px 20px 0px',
          }}
        />
        <span className="row terms">
          Some text which can explain about <a href="#">terms & conditions</a>,
          if any
        </span>
      </div>
    </Wrapper>
  );
};

export default Sent;
