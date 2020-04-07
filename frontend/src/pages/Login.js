import React, {useState} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import deepOrange from "@material-ui/core/colors/deepOrange";
import * as firebase from "firebase";
import * as firebaseui from "firebaseui";
import Typography from "@material-ui/core/Typography";
import db from '../util/database';
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";

import '../styles/login.css';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: deepOrange["500"],
    height: '100%',
    width: '100%',
    textAlign: 'center'
  },
  authContainer: {
    color: '#fff',
  },
  phoneField: {
    borderColor: '#fff',
    color: '#fff'
  }
});

let ui;

export default function Login(props) {
  const classes = useStyles();
  const [auth, setAuth] = useState(false);
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [uid, setUid] = useState("");

  let uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: authResult => {
        // docRef
        console.log(authResult.user);
        console.log(authResult.credential);
        let uid = authResult.user.uid;
        setUid(uid);

        sessionStorage.setItem('uid', uid);

        let docRef = db.collection('users').doc(uid);
        docRef.get()
          .then(doc => {
            if (!doc.exists)
              docRef.set({
                uid: uid,
                displayName: authResult.user.displayName,
                photoURL: authResult.user.photoURL,
                email: authResult.user.email,
                hospitals: [],
                requests: []
              }).then(() => setAuth(true));
            else
              props.authenticated(uid);
          })
      }
    },
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  };

// Initialize the FirebaseUI Widget using Firebase.
  if (!ui) {
    ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebase-auth-container', uiConfig);
  }
// The start method will wait until the DOM is loaded.

  function handleClick() {
    db.collection('users').doc(uid).update({
      number,
      address
    }).then(() => {
      props.authenticated(uid);
    });
  }

  return (
    <div className={classes.root}>
      <div className={classes.authContainer + " login-container"}>
        <Typography variant={"h1"} style={{marginBottom: 16}}>
          Login
        </Typography>
        {auth ? (
          <div style={{textAlign: 'center'}}>
            <TextField label="Phone Number" variant="filled" className={classes.phoneField} onChange={e => setNumber(e.target.value)}/><br/>
            <TextField label="Address" variant="filled" className={classes.phoneField} onChange={e => setAddress(e.target.value)}/>
            <Button style={{display: 'block', margin: '8px auto 0'}} onClick={handleClick}>Sign In</Button>
          </div>) : <div id={"firebase-auth-container"}/>}
      </div>
    </div>
  )
}
