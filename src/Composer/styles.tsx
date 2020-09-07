import styled from 'styled-components';

const ComposerWrapper = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-row-gap: 16px;
  grid-template-areas: 'header header' 'stages tasks';
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  height: inherit;
`;

export default ComposerWrapper;
