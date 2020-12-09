import AuthBg from '#assets/svg/auth-bg.svg';
import CleenLogoWhite from '#assets/svg/CleenLogoWhite';
import MemoLeucineLogo from '#assets/svg/LeucineLogo';
import loginBg from '#assets/svg/login-bg.svg';
import { Router } from '@reach/router';
import React, { FC } from 'react';
import styled from 'styled-components';

import Forgot from './Forgot';
import Locked from './Locked';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';
import { AuthViewProps } from './types';

const Wrapper = styled.div`
  height: inherit;
  width: inherit;
  display: flex;

  .sections {
    display: flex;
    flex-direction: column;
    background-size: cover;
    align-items: center;
    justify-content: center;
    background-position: 0% 100%;
  }

  .left {
    flex: 4;
    background-image: url(${AuthBg});

    .tagline {
      margin-top: 16px;
      font-size: 32px;
      line-height: 40px;
      font-weight: 400;
      letter-spacing: 0px;
      text-align: center;
      color: #fff;
    }
  }

  .right {
    flex: 6;
    background-image: url(${loginBg});

    .credit-view {
      margin-top: 8px;
      display: flex;
      align-items: center;

      div {
        font-size: 16px;
        font-weight: 600;
        line-height: 1.5;
        letter-spacing: 0.15px;
        color: #999999;
      }
    }
  }
`;

const AuthView: FC<AuthViewProps> = () => (
  <Wrapper>
    <div className="sections left">
      <CleenLogoWhite width="60%" height="88px" />
      <div className="tagline">Digitalise Cleaning</div>
    </div>
    <div className="sections right">
      <Router style={{ width: '100%' }}>
        <Register path="register/:name/:email/:token" />
        <ResetPassword path="change-password/:token" />
        <Locked path="locked" />
        <Forgot path="forgot" />
        <Login path="/*" />
      </Router>
      <div className="credit-view">
        <div>A Product By</div>
        <a href="https://www.leucinetech.com">
          <MemoLeucineLogo height="28px" width="122px" />
        </a>
      </div>
    </div>
  </Wrapper>
);

export default AuthView;
