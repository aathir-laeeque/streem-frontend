import styled from 'styled-components';

export const Wrapper = styled.div`
  grid-area: workarea;
  background-color: #ecedf1;
  border-top: 1.25px solid rgb(184, 184, 184);
  border-left: 0.75px solid rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
`;

export const ContentArea = styled.div`
  border-radius: 5px;
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
