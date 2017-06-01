import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as firebase from 'firebase';

import './index.css';

import App   from './App';
import Login from './Login';
import Auth  from './utils/Auth'

//Touch events en material-ui
injectTapEventPlugin();

//Inicializa firebase
var config = {
    /*<YOUR FIREBASE CONFIGURATION>*/
};
firebase.initializeApp(config);

//Chequeo de autentificación
function requireAuth(nextState, replace) {
  if (!Auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}


render((
  <MuiThemeProvider>
    <Router history={browserHistory}>
      <Route path="/"           component={App} onEnter={requireAuth}/>
      <Route path="login"       component={Login} />
    </Router>
  </MuiThemeProvider>
), document.getElementById('root'))
