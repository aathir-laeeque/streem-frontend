import styled from 'styled-components';

export const Wrapper = styled.div.attrs({})`
  align-items: center;
  display: flex;
  flex-direction: row;
  grid-area: header;
  justify-content: space-between;
  padding: 0 12px;
`;

export const HeaderMenu = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  .thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #666666;
    color: #fff;
    font-size: 12px;
  }
`;

export const MenuText = styled.span`
  color: #1d84ff;
  font-family: 'Open Sans', sans-serif;
  padding: 0 10px 0 7px;
`;
