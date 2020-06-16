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



const SwipeableTemporaryDrawer = ({gameOver, totalSets, foundSets}) => {
  const classes = useStyles();

  function refreshPage() {
    window.location.reload(false);
  }

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
        <div style={{display: "flex", flexFlow: "column nowrap", alignItems: "center"}}>
            <br></br>
            <br></br>
            <div style={{height: "80%", display: "flex", justifyContent: "center", fontSize: 100}}>
                TIME'S UP!
            </div>
            <div style = {{fontSize: 50, fontStyle: "oblique"}}>Final Score: {totalSets}</div>
            <br></br>
            <br></br>
            <br></br>
            <div style = {{fontSize: 50, fontStyle: "oblique"}}>Your Sets:</div>
            <br></br>
            <div style={{overflowY: "scroll", maxHeight: 280}}>
            <SetList foundSets={foundSets}></SetList>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            


            <div>
                <Button style={{borderRadius:10, size:"large"}} onClick={refreshPage} variant="contained" color="primary">
                    Play Again
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
            open={gameOver}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default SwipeableTemporaryDrawer;