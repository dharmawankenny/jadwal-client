import React from 'react';
import ReactDOM from 'react-dom';

import Store from './store/Store';
import App from './App';

ReactDOM.render(
  <Store>
    <App />
  </Store>,
  document.getElementById('jadwalApp')
);
