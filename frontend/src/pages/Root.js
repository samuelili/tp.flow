import React, {Component} from 'react';
import '../styles/root.css';
import 'firebase/auth'
import 'firebase/firestore' // <- needed if using firestore
import 'firebase/functions' // <- needed if using httpsCallable
import deepOrange from "@material-ui/core/colors/deepOrange";
import blue from "@material-ui/core/colors/blue";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import AppContext from "../AppContext";
import Main from "./Main";
import Login from "./Login";
import db from '../util/database';

export const palette = {
  primary: deepOrange,
  secondary: blue,
};

let subscribedMethods = [];

const theme = createMuiTheme({
  palette
});

class Root extends Component {
  state = {
    refreshMap: () => {
    },
    refresh: () => {
      for (let i = 0; i < subscribedMethods.length; i++)
        subscribedMethods[i]();
    },
    subscribedMethods: [],
    subscribeMethod: (method) => {
      subscribedMethods.push(method);
    },
    setRefreshMap: (refreshMap) => {
      this.setState({refreshMap})
    },
    authenticated: false,
    uid: "",
    user: {},
    updateUser: () => {
      db.collection('users').doc(this.state.uid).get()
        .then(doc => this.setState({user: doc.data()}))
    }
  };

  componentDidMount() {
    if (sessionStorage.getItem('uid')) {
      db.collection('users').doc(sessionStorage.getItem('uid')).get()
        .then(doc => this.setState({authenticated: true, user: doc.data(), uid: sessionStorage.getItem('uid')}));
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.uid !== this.state.uid) {
      db.collection('users').doc(this.state.uid).get()
        .then(doc => this.setState({authenticated: true, user: doc.data()}))
    }
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        <ThemeProvider theme={theme}>
          {this.state.authenticated ? <Main/> : <Login authenticated={(uid) => this.setState({uid})}/>}
        </ThemeProvider>
      </AppContext.Provider>
    );
  }
}

export default Root;
