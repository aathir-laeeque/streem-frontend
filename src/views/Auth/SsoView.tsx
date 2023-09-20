import { LoadingContainer } from '#components';
import { navigate, useLocation } from '@reach/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { login, reLogin } from './actions';
import { releasePrototype, signOffPrototype } from '#PrototypeComposer/reviewer.actions';
import {
  acceptPeerVerification,
  completeSelfVerification,
} from '#JobComposer/ActivityList/actions';
import { SsoStates } from '#utils/globalTypes';

const SsoViewWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100dvw;
  justify-content: center;
  align-items: center;
`;

export const SsoView = () => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const extractedTOkenCode = search?.match(/code=([^&]*)/)?.[1] || '';
  const extractedState = search?.match(/state=([^&]*)/)?.[1] || '';
  const parsedState = JSON.parse(decodeURIComponent(extractedState));
  const { state, checklistId, location } = parsedState;

  useEffect(() => {
    const userName = localStorage.getItem('username') || '';
    switch (state) {
      case SsoStates.LOGIN:
        dispatch(login({ code: extractedTOkenCode, username: userName, state: state }));
        break;
      case SsoStates.SIGN_OFF:
        dispatch(signOffPrototype({ checklistId, code: extractedTOkenCode, state: state }));
        break;
      case SsoStates.RELEASE:
        dispatch(releasePrototype({ checklistId, code: extractedTOkenCode, state: state }));
        break;
      case SsoStates.SELF_VERIFICATION:
        dispatch(
          completeSelfVerification({
            parameterId: parsedState.parameterId,
            code: extractedTOkenCode,
            state: state,
          }),
        );
        break;
      case SsoStates.PEER_VERIFICATION:
        dispatch(
          acceptPeerVerification({
            parameterId: parsedState.parameterId,
            code: extractedTOkenCode,
            state: state,
          }),
        );
        break;
      case SsoStates.RE_LOGIN:
        dispatch(
          reLogin({
            username: userName,
            code: extractedTOkenCode,
            state,
            pathname: location,
          }),
        );
        break;
      default:
        break;
    }
    if (state !== SsoStates.RE_LOGIN) {
      navigate(location);
    }
  }, [extractedTOkenCode]);

  return (
    <SsoViewWrapper>
      <LoadingContainer loading={true} component={<div>SsoView</div>} />
    </SsoViewWrapper>
  );
};
