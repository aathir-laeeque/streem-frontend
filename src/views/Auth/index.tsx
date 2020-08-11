import React, { FC } from 'react';
import { Router } from '@reach/router';
import { AuthViewProps } from './types';
import styled from 'styled-components';

import Login from './Login';
import Locked from './Locked';
import Forgot from './Forgot';
import Register from './Register';
import whiteLogo from '#assets/images/streem-logo-white.png';
import mainBackground from '#assets/images/main-background.png';
import loginBackground from '#assets/images/login-module-background.png';
import leucineLogo from '#assets/images/leucine-logo-colored.png';

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
    flex: 6;
    background-image: url(${mainBackground});

    .tagline {
      margin-top: 16px;
      font-size: 64px;
      font-weight: 200;
      text-align: center;
      color: #fff;
    }
  }

  .right {
    flex: 4;
    background-image: url(${loginBackground});

    .credit-view {
      bottom: 24px;
      position: absolute;
      display: flex;
      align-items: center;
      flex-direction: column;

      div {
        font-size: 16px;
        font-weight: 600;
        line-height: 1.5;
        letter-spacing: 0.15px;
        color: #999999;
      }

      img {
        margin-top: 8px;
        width: 100%;
      }
    }
  }
`;

const AuthView: FC<AuthViewProps> = () => (
  <Wrapper>
    <div className="sections left">
      <img src={whiteLogo} style={{ width: '60%' }} />
      <span className="tagline">A tagline, if required</span>
    </div>
    <div className="sections right">
      <Router style={{ width: '100%' }}>
        <Register path="register/:name/:email" />
        <Locked path="locked" />
        <Forgot path="forgot" />
        <Login path="/*" />
      </Router>
      <div className="credit-view">
        <div>A Product By</div>
        <img src={leucineLogo} />
      </div>
    </div>
  </Wrapper>
);

export default AuthView;
