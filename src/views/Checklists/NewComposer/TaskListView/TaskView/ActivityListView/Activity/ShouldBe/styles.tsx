import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  > .new-form-field {
    margin-bottom: 16px;

    :last-child {
      margin-bottom: 0;
    }
  }

  .is-between-values {
    display: flex;
    align-items: center;

    > .new-form-field {
      flex: 1;
    }
  }

  .parameter-text {
    color: #000;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 24px;
  }
`;
