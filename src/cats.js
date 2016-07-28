import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CatsContainer from './components/catsContainer.js';
import catsInfo from './catsStore.js';
import { applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

let store = createStore(catsInfo, {}, applyMiddleware(thunkMiddleware));

render(
  <Provider store={store}>
    <CatsContainer />
  </Provider>,
  document.getElementById('cats')
);
