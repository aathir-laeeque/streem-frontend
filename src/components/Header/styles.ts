import styled from 'styled-components';

export const Wrapper = styled.div.attrs({})`
  align-items: center;
  display: flex;
  flex-direction: row;
  grid-area: header;
  justify-content: space-between;
  padding: 0 16px;

  .select {
    margin-left: auto;
    margin-right: 12px;
    min-width: 200px;
  }

  .profile-icon {
    width: 25px;
    height: 25px;
  }

  .right-section {
    display: flex;
    gap: 16px;
  }
`;

export const HeaderMenu = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 4px;

  .thumb {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #666666;
    color: #fff;
    font-size: 12px;
  }
`;
