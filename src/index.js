import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Request from "./utils/Request";

import {Provider} from "react-redux"
import {createStore, combineReducers} from 'redux';
import userReducer from "./store/userReducer"

import {ThemeProvider} from "@material-ui/core/styles";
import theme from "./theme/theme";

import axios from "axios"
import './index.scss';

axios.defaults.baseURL = "http://localhost:4000/api/";
axios.defaults.headers.post['Content-Type'] = 'application/json';

const rootReducer = combineReducers({
    user: userReducer,

});

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

Request.baseURL = process.env.API_URL || process.env.REACT_APP_API_URL;


ReactDOM.render(
  // <React.StrictMode>
      <Provider store={store}>
          <ThemeProvider theme={theme}>
              <App />
          </ThemeProvider>
      </Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
