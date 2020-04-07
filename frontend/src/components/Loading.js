import React from 'react';
import tpflow from '../images/tpflow-back.svg';
import {palette} from "../pages/Root";
import Typography from "@material-ui/core/Typography";

export default function Loading({loaded}) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000000,
      display: 'flex',
      opacity: loaded ? 0 : 1,
      pointerEvents: loaded ? "none" : "auto",
      transition: "opacity 500ms",
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.primary["500"],
      height: '100%',
      width: '100%',
      flexDirection: 'column'
    }}>
      <img src={tpflow} alt={"TP.FLOW"} style={{height: '256px', width: 256}}/>
      <Typography variant={'h2'} style={{fontFamily: 'Roboto Slab', color: '#fff'}}>
        TP.FLOW
      </Typography>
    </div>
  )
}
