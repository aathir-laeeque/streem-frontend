import styled from 'styled-components';
export const Composer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
  }
`;

export const Header = styled.div`
  background-color: #eeeeee;
  display: flex;
  align-items: center;
  padding: 8px 40px;
  justify-content: space-between;
  width: 100%;
`;

export const Footer = styled.div`
  background-color: #eeeeee;
  display: flex;
  align-items: center;
  padding: 8px 40px;
  justify-content: space-between;
  width: 100%;

  .footer-info {
    font-size: 10px;
    color: #000000;
  }

  .page-info {
    width: 20px;
    height: 20px;
    border-radius: 100px;
    background-color: #bababa;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
