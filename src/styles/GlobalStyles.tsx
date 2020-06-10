import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    height: 100vh;
    width: 100vw;
  }

  * {
    font-family: 'Nunito', sans-serif;
    font-weight: normal;
  }

  #root {
    height: inherit;
    width: inherit;
  }
`;

export default GlobalStyles;
