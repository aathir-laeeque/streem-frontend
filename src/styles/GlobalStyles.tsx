import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    height: 100vh;
    width: 100vw;
  }

  * {
    font-family: 'Nunito', sans-serif;
    font-weight: normal;
    box-sizing: border-box;
  }

  #root {
    height: inherit;
    width: inherit;
  }

  .icon {
    color: #999999;
    cursor: pointer;
  }

  .form-field {
    display: flex;
    flex-direction: column;

    > .field-label {}

    > .field-value {
      margin-top: 2px;
    }
  }
`;

export default GlobalStyles;
