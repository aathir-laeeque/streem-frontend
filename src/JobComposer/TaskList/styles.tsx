import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  grid-area: tasks;
  grid-template-areas: 'overview tasks-list';
  grid-template-rows: 1fr;
  grid-template-columns: auto 1fr;
  overflow: auto;

  .overview {
    overflow: auto;
    background-color: #fff;
    width: 36vw;
    display: flex;

    @media (max-width: 900px) {
      display: none;
    }
  }

  .tasks-list {
    grid-area: tasks-list;
    overflow: hidden;
    grid-template-rows: 1fr;
    display: grid;

    @media (max-width: 900px) {
      padding-right: 0;
    }
  }
`;

export default Wrapper;
