import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Container} from '@material-ui/core/';
import moment from 'moment';
import SwipeableTemporaryDrawer from "./drawer";
import { SetList } from "./setList"; 
moment().format();




const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  setCards: {
    pointerEvents:"none",
    align:"center",
    padding:"5px",
    margin:"5px", 
  },
  gameBanner:{
    fontSize:100,
    textAlign:"center",
  },
  list: {
    width: 250,
    height: 1000, 
  },
  fullList: {
    width: 'auto',
  },
}));

const numProperties = 4; 

const SetCard = ({card, selected, setSelected}) => {
  const classes = useStyles();
  const [yellow, setYellow] = useState(false);

  function checkSelect(card) {
    for(let i = 0; i < selected.length; i++){
      if (card == selected[i]){
        return true;
      }
    }
    return false; 
  }

  function handleClick(e) {
    if (e.target.className.includes("Card") && selected.length < 3) {
      e.target.className = "Yellow noSelect";
      setSelected(selected.concat(e.target.selected));
      
    } else if (e.target.className.includes("Yellow")) {
      e.target.className = "Card noSelect";
      setSelected(selected.filter((yeah)=> {
        return yeah != e.target.selected;
      }))
    }      
  }

  return (
    <div selected={card} onClick={handleClick} className="Card noSelect" style={{backgroundColor: checkSelect(card) ? "lightblue" : "whitesmoke", width:150, height:260, margin:0}}>
      <img src={require('./SetCards/'+ card + '.png.jpg')} width="130" height="240" className={classes.setCards} /> 
    </div> 
  )
}

function generateCard() {
  let shapes = ["w", "o", "d"];
  let colors = ["g", "p", "r"];
  let fillings = ["e", "l", "s"];
  let numbers = ["1", "2", "3"];
  let properties = [shapes, colors, fillings, numbers]
  let card = ""
  for (let property = 0; property < properties.length; property++) {
    card += properties[property][Math.floor(Math.random() * 3)];
  }
  return card
};

function generateCardGrid(){
  let grid = [];
  while (grid.length != 12) {
    let generated = generateCard()
    if (grid.includes(generated) == false) {
      grid.push(generated)
    }
  }
  return grid
}

let startingGrid = generateCardGrid()

const Timer = ({timer, setTimer, gameOver, setGameOver}) => {
  
  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(() => {
    // Your custom logic here
    if (timer != 0) {
      setTimer(timer - 1);
    }
    else{
      if (gameOver == false){
        setGameOver(true)
      }
    }
    
  }, 1000);
  
  return <h1>Time Left: {timer}s</h1>
  
}

/*const EachSet = ({oneSet}) => {
  console.log(oneSet)
  return (
    <div style={{display: "flex", flexFlow: "row nowrap", justifyContent: "center"}}className="eachSet">
      <div>
        <img width="150" height="260" src={require('./SetCards/'+ oneSet[0] + '.png.jpg')}/>
      </div>
      <div>
        <img width="150" height="260" src={require('./SetCards/'+ oneSet[1] + '.png.jpg')}/>
      </div>
      <div>
        <img width="150" height="260" src={require('./SetCards/'+ oneSet[2] + '.png.jpg')}/>
      </div>
    </div>
  )
}*/

/*const SetList = ({foundSets}) => {
  console.log(foundSets)
  return foundSets.map(found => {
    return <EachSet oneSet={found}></EachSet>
  })
}*/

let currentTime = new Date();
let expireTime = moment(currentTime).add(5, 'm').toDate();
let remaining = (expireTime-currentTime)/1000;



const EarlyEndGame = ({setGameOver}) => {
  return (
    <Button style={{borderRadius:10, size:"large"}} onClick={setGameOver} variant="contained" color="primary">END GAME</Button>
  )
}

const App = () => {

  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  const [totalSets, setTotalSets] = useState(0);
  const [cards, setCards] = useState(startingGrid);
  const [foundSets, setFoundSets] = useState([]);
  const [timer, setTimer] = useState(remaining);
  const [gameOver, setGameOver] = useState(false);
  const [shufCount, setShufCount] = useState(0);


  function shuffle () {
    let newGrid = generateCardGrid();
    setCards(newGrid);
    setSelected([]);
    setShufCount(shufCount + 1);
  }

  

  function checkSet () {
    let truths = 0;
    for (let property = 0; property < numProperties; property++) {
      let truthTest = [];
      selected.forEach(element => truthTest.push(element[property]));
      let truthSet = new Set(truthTest);
      // Check for all different or all the same property in selected set 
      if (truthSet.size === 3 || truthSet.size === 1) {
        truths += 1;
      }
    }
    
    if (truths === numProperties) {
      setTotalSets(totalSets + 1);
      let tempSet = selected; 
      let tempFound = foundSets;
      tempFound = tempFound.unshift([selected[0], selected[1], selected[2]])
      console.log(foundSets)
      let tempCards = cards.filter(card => {
          return card != tempSet[0] && card != tempSet[1] && card != tempSet[2];
        });

      while (tempCards.length != 12) {
        let newCard = generateCard();
        if (tempCards.includes(newCard) == false) {
          tempCards =tempCards.concat(newCard);
        }
      };

      setCards(tempCards);

      setSelected([]);
    }
  };

  function restart () {
    setSelected([]);
    setTotalSets(0);
    setCards(generateCardGrid());
    setFoundSets([]);
    let currentTime = new Date();
    let expireTime = moment(currentTime).add(5, 'm').toDate();
    let remaining = (expireTime-currentTime)/1000;
    setTimer(remaining);
    setGameOver(false);
  }



  useEffect(()=>{
    if (selected.length === 3) {
      checkSet();
    }
  }, [selected]);

  return (

  <div>
     


    <div style={{display:"flex", flexFlow:"row nowrap"}}>
      <div style={{ display:"flex", flexFlow:"column nowrap", alignItems:"center", width:"50%"}}>
        <h1 className={classes.gameBanner}>SET! The Game</h1>
        <Timer timer={timer} setTimer={setTimer} gameOver={gameOver} setGameOver={setGameOver} ></Timer>
        <div style={{display:"flex", justifyContent:"center", width:300}}>
          <div style = {{display: "flex", flexFlow: "column nowrap"}}>
            <EarlyEndGame setGameOver = {setGameOver}></EarlyEndGame>
            <br></br>
            <Button style={{borderRadius:10, size:"large"}} onClick={shuffle} variant="contained" color="primary">
                SHUFFLE
            </Button>
            <p style={{fontStyle: "oblique"}}>You've shuffled {shufCount} times!</p>
          </div>
          
         
        </div>
        <div>
          <h3> Number of Sets Found: {totalSets} </h3> 
          <div style={{overflowY: "scroll", maxHeight: 280}}>
            <SetList  foundSets={foundSets}></SetList>
          </div>
        </div>
      </div>
      <div style={{width:"45%"}}>
        <Grid container spacing={4} justify={"space-evenly"} style={{height:"60%", margin:"5px"}}>    
          {cards.map(card => 
          <Grid item spacing={2} style={{padding:10}}> 
            <SetCard card={card} selected={selected} setSelected ={setSelected}></SetCard> 
          </Grid>)}
        </Grid>
        <SwipeableTemporaryDrawer gameOver={gameOver} totalSets={totalSets} foundSets={foundSets}>
        </SwipeableTemporaryDrawer>
      </div> 
    </div> 

  </div>
  )
};

export default App;



   
