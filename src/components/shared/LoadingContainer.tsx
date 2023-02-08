import { CircularProgress } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const LoadingContainerWrapper = styled.div.attrs({
  className: 'loading-container-wrapper',
})`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const LoadingContainer = ({
  loading,
  component,
}: {
  loading: boolean;
  component?: JSX.Element;
}) => {
  return loading ? (
    <LoadingContainerWrapper>
      <CircularProgress style={{ color: 'rgb(29, 132, 255)' }} />
    </LoadingContainerWrapper>
  ) : (
    component || <></>
  );
};
