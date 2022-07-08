import 'normalize.css';

import React from 'react';
import { render } from 'react-dom';
import FontStyles from './assets/fonts/fonts';

import App from './App';

render(
  <>
    <FontStyles />
    <App />
  </>,
  document.getElementById('root'),
);
