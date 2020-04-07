import React from 'react';
import paper from '../images/paper.svg';
import happyPaper from '../images/happy-paper.svg';

import '../styles/nothing.css';
import Typography from "@material-ui/core/Typography";

export default function Nothing({happy, children}) {
  return (
    <div className={"nothing"}>
      <img src={happy ? happyPaper : paper} alt={""}/>
      {/*<SentimentSatisfiedRoundedIcon/>*/}
      <br/>
      <Typography variant={"button"}>{children}
      </Typography>
    </div>
  )
}
