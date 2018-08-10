import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Router, browserHistory } from 'react-router';
import routes from './config/routes';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import registerServiceWorker from './registerServiceWorker';
import store from './redux/store';

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store);


ReactDOM.render((
    <Provider store={store}>
      <Router history={history} routes={routes}>
      </Router>
    </Provider>

  ), document.getElementById('root'));
registerServiceWorker();
