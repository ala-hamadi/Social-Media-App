import React from 'react';
import './App.css';
import axios from 'axios';
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import AuthRoute from './util/AuthRoute'
import jwtDecode from 'jwt-decode'
import Navbar from './components/layout/Navbar'
import Home from './containers/Home'
import Login from './containers/Login'
import Signup from './containers/Signup'
import User from './containers/User'

//MUI imports
import {MuiThemeProvider} from '@material-ui/core/styles'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

//redux imports
import store from './redux/store';
import * as actionTypes from './redux/types';
import {logoutUser,getUserData} from './redux/actions/userActions'

//set your cloud functions link : https://firebase.google.com/docs/functions
//axios.defaults.baseURL="https://yourcloudfunctionslink"

const theme=createMuiTheme({
  palette: {
    primary:{
      light: '#33c9dc',
      main: '#15202b',
      dark: '#38444d',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#fff'
    },
  },
})


const token=localStorage.FBIdToken;
if(token){
  const decodeToken=jwtDecode(token);
  if(decodeToken.exp*1000< Date.now()){
    store.dispatch(logoutUser())
    window.location.href='/login';
  }
  else{
    store.dispatch({type:actionTypes.SET_AUTHENTICATED})
    axios.defaults.headers.common['Authorization']=token;
    store.dispatch(getUserData())
  }
}

function App() {
  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <AuthRoute exact path="/login" component={Login} />
              <AuthRoute exact path="/signup" component={Signup} />
              <Route exact path="/users/:handle" component={User} />
              <Route exact path="/users/:handle/scream/:screamId" component={User} />
            </Switch>
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
