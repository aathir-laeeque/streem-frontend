import styled from 'styled-components';

export const Wrapper = styled.div`
  align-items: center;
  background-color: #fafafa;
  /* box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.2); */
  display: flex;
  flex-direction: row;
  grid-area: header;
  justify-content: space-between;
  padding: 0 12px;
`;

export const HeaderMenu = styled.div`
  display: flex;
  align-items: center;
`;

export const MenuText = styled.span`
  color: #12aab3;
  font-family: 'Open Sans', sans-serif;
  padding: 0 10px 0 7px;
`;
