import styled from 'styled-components';

export const Wrapper = styled.div`
  grid-area: workarea;

  background-color: #ecedf1;
  border-top: 1.25px solid rgb(184, 184, 184);
  border-left: 0.75px solid rgba(0, 0, 0, 0.14);
  padding: 10px 8px 0 12px;
  overflow: hidden;
`;

export const ContentArea = styled.div`
  /* background-color: #ffffff; */
  border-radius: 5px;
  /* box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1); */
  height: 100%;

  > div {
    height: inherit;

    > div {
      height: inherit;
    }
  }
`;
