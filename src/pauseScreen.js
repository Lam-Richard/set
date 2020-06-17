import React from 'react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import { SetList } from "./setList"; 



const useStyles = makeStyles({
  list: {
    width: 250,
    height: 1000, 
  },
  fullList: {
    width: 'auto',
  },
});



const AlertDialog = ({paused, setPaused}) => {
  const classes = useStyles();

  function unpause(){
      setPaused(false);
  }

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
        <div style={{display: "flex", flexFlow: "column nowrap", alignItems: "center", justifyContent: "center"}}>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div style={{height: "80%", display: "flex", justifyContent: "center", fontSize: 100, alignSelf: "center"}}>
               GAME PAUSED
            </div>
            <div>
                <Button style={{borderRadius:10, size:"large"}} onClick={unpause} variant="contained" color="primary">
                    RESUME
                </Button>
            </div>
        </div>
    </div>
  );

  return (
    <div>
      {['top'].map((anchor) => (
        <React.Fragment key={anchor}>
          <SwipeableDrawer
            transitionDuration={900}
            anchor={anchor}
            open={paused}
            style={{opacity:0.95}}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default AlertDialog;