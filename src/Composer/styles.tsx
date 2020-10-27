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
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  height: inherit;
`;

export default ComposerWrapper;
