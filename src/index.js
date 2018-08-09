import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
// import App from './App';
import { DrizzleProvider } from 'drizzle-react';
import drizzleOptions from './config/drizzleOptions';

import { LoadingContainer } from 'drizzle-react-components'
import registerServiceWorker from './registerServiceWorker';

import store from './redux/store';

import { Router, browserHistory } from 'react-router';
import routes from './config/routes';
import { syncHistoryWithStore } from 'react-router-redux';

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store);


ReactDOM.render((
  <DrizzleProvider options={drizzleOptions}  store={store}>
    <LoadingContainer>
    <Router history={history} routes={routes}>
    </Router>
    </LoadingContainer>
  </DrizzleProvider>
  ), document.getElementById('root'));
registerServiceWorker();
