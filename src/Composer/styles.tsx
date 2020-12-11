import styled from 'styled-components';
import { Tabs } from './composer.types';

const ComposerWrapper = styled.div<{ activeTab: Tabs }>`
  display: grid;
  grid-gap: 8px;
  grid-row-gap: 16px;
  ${({ activeTab }) =>
    activeTab === Tabs.STAGES
      ? `
        grid-template-areas: 'header header' 'stages tasks';
    `
      : `
        grid-template-areas: 'header header' 'activity activity';
    `}
  grid-template-columns: 320px 1fr;
  grid-template-rows: auto 1fr;
  height: inherit;

  @media (max-width: 1200px) {
    grid-template-columns: 240px 1fr;
  }

  @media (min-width: 1201px) and (max-width: 1366px) {
    grid-template-columns: 280px 1fr;
  }
`;

export default ComposerWrapper;
