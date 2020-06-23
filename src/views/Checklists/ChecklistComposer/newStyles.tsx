import styled from 'styled-components';

export const Wrapper = styled.div`
  display: grid;
  grid-template-areas:
    'header header'
    'stagelist steplist';
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  height: inherit;
`;
