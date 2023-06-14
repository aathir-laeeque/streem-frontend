import styled from 'styled-components';

export const ComposerWrapper = styled.div<{ isSubJob?: boolean; showVerificationBanner: boolean }>`
  display: grid;
  grid-template-areas: 'header' 'tasks';
  grid-template-rows: ${({ isSubJob, showVerificationBanner }) =>
    isSubJob && showVerificationBanner
      ? '138px 1fr'
      : isSubJob
      ? '108px 1fr'
      : showVerificationBanner
      ? '96px 1fr'
      : '66px 1fr'};
  overflow: hidden;
  height: 100%;
  grid-gap: 0px;
  grid-row-gap: 0px;
  position: relative;

  .tasks-list-floating-btn {
    position: absolute;
    right: 5%;
    bottom: 12%;
    .MuiFab-primary {
      background-color: #1d84ff;
    }
  }
`;

export const JobLoadingWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
