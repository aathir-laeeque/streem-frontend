import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  > .form-field {
    margin-top: 24px;

    :first-child {
      margin-top: 0;
    }

    :last-child {
      margin-top: 8px;
    }
  }

  #target-rules {
    display: flex;

    > .form-field {
      flex: 1;
      margin-right: 16px;
      margin-top: 24px;

      :last-child {
        margin-right: 0;
      }
    }
  }
`;
