import styled from 'styled-components';

export const Wrapper = styled.div`
  input[name='label'] {
    margin-top: 0;
  }

  .checklist-container {
    display: flex;
    flex-direction: column;

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
