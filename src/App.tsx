import React from 'react';
import {BrowserRouter} from 'react-router-dom'

import { Router } from './routes';
import {GlobalStyle} from './styles/global'

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <GlobalStyle />
    </>
  );
}

export default App;
