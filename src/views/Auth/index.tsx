import React, { FC } from 'react';
import { Router } from '@reach/router';
import { AuthViewProps } from './types';
import styled from 'styled-components';

import Login from './Login';
import Locked from './Locked';
import Forgot from './Forgot';
import Register from './Register';
import MemoStreemLogoWhite from '#assets/svg/StreemLogoWhite';
import MemoLeucineLogo from '#assets/svg/LeucineLogo';
import AuthBg from '#assets/svg/auth-bg.svg';
import mainBackground from '#assets/images/main-background.png';
import loginBg from '#assets/svg/login-bg.svg';

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
    background-image: url(${AuthBg});

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
    background-image: url(${loginBg});

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
    }
  }
`;

const AuthView: FC<AuthViewProps> = () => (
  <Wrapper>
    <div className="sections left">
      <MemoStreemLogoWhite width="60%" height="20%" />
      {/* <span className="tagline">A tagline, if required</span> */}
    </div>
    <div className="sections right">
      <Router style={{ width: '100%' }}>
        <Register path="register/:name/:email/:token" />
        <Locked path="locked" />
        <Forgot path="forgot" />
        <Login path="/*" />
      </Router>
      <div className="credit-view">
        <div>A Product By</div>
        <MemoLeucineLogo
          height="28px"
          width="auto"
          style={{ marginTop: '8px' }}
        />
      </div>
    </div>
  </Wrapper>
);

export default AuthView;
