import styled from 'styled-components';

export const Wrapper = styled.div`
  .checklist-container {
    display: flex;
    flex-direction: column;
    margin-top: 5px;

    .list-item {
      display: flex;
      align-items: flex-start;

      input[type='text'] {
        border-bottom-color: transparent;

        :focus {
          border-bottom-color: #12aab3;
        }
      }

      > .icon {
        height: 12px;
        width: 12px;
        margin-left: auto;
        align-self: center;
        margin-left: 32px;
      }
    }
  }
`;
