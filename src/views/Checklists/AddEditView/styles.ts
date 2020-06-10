import styled, { css } from 'styled-components';

export const Layout = styled.div`
  display: grid;
  grid-template-areas:
    'header header'
    'stagelist steps';

  grid-template-rows: auto 1fr;
  grid-template-columns: 300px 1fr;
  height: inherit;
`;

export const Header = styled.div`
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  grid-area: header;
  justify-content: space-between;
  z-index: 1;
`;

export const HeaderItem = styled.div`
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.75;
  letter-spacing: normal;
  color: #12aab3;
  border-bottom: 2px solid #12aab3;
  padding: 18px 32px;
`;

export const AutoSaveText = styled.span`
  font-size: 12px;
  font-weight: 200;
  font-style: italic;
  line-height: 0.75;
  margin-left: auto;
  margin-right: 16px;
`;

export const ListContainer = styled.div`
  background-color: #fafafa;
  box-shadow: 1px 0 3px 0 rgba(0, 0, 0, 0.12), 1px 0 1px 0 rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

export const StagesList = styled.ol`
  counter-reset: item;
  display: flex;
  flex-direction: column;
  grid-area: stagelist;
  list-style-type: none;
  margin: 0;
  padding: 8px;
  max-height: calc(100% - 80px);
  overflow: scroll;
`;

export const StageItem = styled.li`
  align-items: center;
  background-color: #ffffff;
  border-radius: 3px;
  box-shadow: 1px 0 3px 0 rgba(0, 0, 0, 0.12), 1px 0 1px 0 rgba(0, 0, 0, 0.14);
  display: flex;
  line-height: normal;
  list-style-position: inside;
  padding: 8px 16px;
  margin-bottom: 8px;
  border: 1px solid transparent;

  ${(props: { active: boolean }) =>
    props.active &&
    css`
      border-color: #12aab3;
    `}

  :last-child {
    margin-bottom: 0;
  }

  &::last-child {
    margin-bottom: 0;
  }

  &::before {
    content: counter(item) ' ';
    counter-increment: item;
    margin-left: 8px;
    margin-right: 16px;
  }

  > span {
    display: flex;
    flex: 1;
    background-color: #fafafa;
    padding: 8px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
  }
`;

export const ListControlButtons = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  margin-top: auto;
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: calc(100% - 16px);

  > div {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;

    > img {
      margin-bottom: 8px;
    }

    > span {
      font-size: 8px;
      line-height: 0.5;
      color: #333333;
      text-transform: capitalize;
    }
  }
`;

export const Steps = styled.div`
  grid-area: steps;
`;
