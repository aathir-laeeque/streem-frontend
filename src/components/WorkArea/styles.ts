import styled from 'styled-components';

export const Wrapper = styled.div`
  grid-area: workarea;
  background-color: #ecedf1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
`;

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;

  > div {
    display: flex;
    overflow: hidden;
    flex: 1;

    > div {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      flex: 1;
    }
  }
`;
