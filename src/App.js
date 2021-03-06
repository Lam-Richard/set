import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Container} from '@material-ui/core/';
import moment from 'moment';
import SwipeableTemporaryDrawer from "./drawer";
import AlertDialog from "./pauseScreen";
import { SetList } from "./setList"; 
import './App.css';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const firebaseConfig = {
  apiKey: "AIzaSyCrw3TOOMQs26jEIy9y_oZdWvVGhKKNpDY",
  authDomain: "playsetsonline.firebaseapp.com",
  databaseURL: "https://playsetsonline.firebaseio.com",
  projectId: "playsetsonline",
  storageBucket: "playsetsonline.appspot.com",
  messagingSenderId: "206782632900",
  appId: "1:206782632900:web:82d3501e6caa9ae803ca91",
  measurementId: "G-5VL17EB6G2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};


const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

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


const SetCard = ({card, selected, setSelected, hintSet}) => {
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
    <div selected={card} onClick={handleClick} className="Card noSelect" style={{backgroundColor: checkSelect(card) ? "lightblue" : (hintSet.includes(card) ? "lavender" : "whitesmoke") , width:150, height:260, margin:0}}>
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


const Timer = ({timer, setTimer, gameOver, setGameOver, paused}) => {
  
  const [timeColor, setTimeColor] = useState("black");

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
    if (timer != 0 && paused == false) {
      setTimer(timer - 1);
    } else if (timer != 0 && paused == true) {
      return
    }
    else{
      if (gameOver == false) {
        setGameOver(true)
      }
    }

    if (timer == 30) {
      setTimeColor("red");
    }
    
  }, 1000);
  
  return <h1 style = {{color: timeColor }}>Time Left: {timer}s</h1>
}


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
  const [hintCount, setHintCount] = useState(0);
  const [hintMSG, setHintMSG] = useState([]);
  const [hintSet, setHintSet] = useState([]);
  const [paused, setPaused] = useState(false);
  const [home, setHome] = useState(true);
  const [user, setUser] = useState(null);
  const [leaderBoard, setLeaderBoard] = useState([]);

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setLeaderBoard(snap.val().leaderboard);
    }
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);


  function getHint () {
    let setFound = false;
    setHintCount(hintCount + 1);
    for(let firstIndex = 0; firstIndex < cards.length - 1; firstIndex++){
      for (let secondIndex = firstIndex + 1; secondIndex < cards.length; secondIndex++){
        let similarityString = "";
        let shapes = ["w", "o", "d"];
        let colors = ["g", "p", "r"];
        let fillings = ["e", "l", "s"];
        let numbers = ["1", "2", "3"];
        let properties = [shapes, colors, fillings, numbers];
        let similarityTypes = properties;
        for(let y = 0; y < 4; y++){
          if (cards[firstIndex][y] == cards[secondIndex][y]){
            similarityString += cards[firstIndex][y];
          }
          else{
            let voidedWhatever = properties[y].filter(property => property != cards[firstIndex][y] && property != cards[secondIndex][y]);
            similarityString += voidedWhatever[0];
          }
        }
        if (cards.includes(similarityString)){
          setFound = true;
          setHintSet([cards[firstIndex], cards[secondIndex], similarityString]);
          setSelected([]);
        }
      }

    }
    if (setFound === false) {
      setHintMSG(["RESHUFFLE"]);
    }
  }

  function shuffle () {
    let newGrid = generateCardGrid();
    setCards(newGrid);
    setSelected([]);
    setShufCount(shufCount + 1);
    setHintSet([]);
    setHintMSG([]);
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
  
  function togglePause () {
    if (paused == false) {
      setPaused(true);
    } else {
      setPaused(false);
    }
  }

  function playGame(){
    setHome(false);
  }

  return (
    <div>
    {home ? 
      <React.Fragment>
        <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
        <div>
          <div style={{display: "flex", flexFlow: "column nowrap", margin: "auto"}}>
            <h1 style={{fontSize:100, textAlign:"center", marginTop:"20%", marginBottom:"10%"}}> SET! The Game </h1>
            <h3 style={{textAlign:"center", marginBottom:"5%"}}> Hello, { user ? user.displayName : "Guest" } </h3> 
          </div>
          <div style={{display: "flex", flexFlow: "column nowrap", margin: "auto", width:"32%"}}>
            <Button variant="contained" color="secondary" onClick={playGame}> Play Game </Button>
            <br></br>
            <Button href="https://www.setgame.com/file/set-english" target="blank" variant="contained" color="secondary"> How to Play </Button>
            <br></br>
            <Button href="https://github.com/Lam-Richard/set" target="blank" variant="contained" color="secondary"> About </Button>
            <br></br>
          </div>
          <React.Fragment>
            { user ? 
              <div style={{display: "flex", flexFlow: "column nowrap", margin: "auto", width:"32%"}}>
                <Button variant="contained" color="secondary" onClick={() => firebase.auth().signOut()}>
                  Log out
                </Button> 
              </div> :           
              <div style={{display: "flex", flexFlow: "column nowrap", margin: "auto", width:"40%"}}>
                <SignIn />  
              </div> }
            </React.Fragment>
        </div>
        </div>
      </React.Fragment>

    :
      <div style={{display:"flex", flexFlow:"row nowrap"}}>
        <div style={{ display:"flex", flexFlow:"column nowrap", alignItems:"center", width:"55%"}}>
          <h1 className={classes.gameBanner}>SET! The Game</h1>
          <Timer paused={paused} timer={timer} setTimer={setTimer} gameOver={gameOver} setGameOver={setGameOver} ></Timer>
          <div style={{display:"flex", justifyContent:"center", width:300}}>
            <div style = {{display: "flex", flexFlow: "column nowrap"}}>
              <Button style={{borderRadius:10, size: "large"}} onClick={togglePause} variant="contained" color="primary"> PAUSE </Button>
              <br></br>
              <Button style={{borderRadius:10, size:"large"}} onClick={shuffle} variant="contained" color="primary">
                  SHUFFLE
              </Button>
              <br></br>
              <Button style={{borderRadius:10, size:"large"}} onClick={getHint} variant="contained" color="primary">
                  HINT
              </Button>
              <br></br>
              <EarlyEndGame setGameOver = {setGameOver}></EarlyEndGame>
              <p style = {{textAlign: "center"}}>{hintMSG.length === 1 ? hintMSG[0] : null}</p>
              
            </div>
          </div>
          <div>
            
            <h3 style={{paddingBottom: "5px", textAlign: "center"}}> Number of Sets Found: {totalSets} </h3>
            
            <div style={{overflowY: "scroll", maxHeight: 280}}>
              <SetList  foundSets={foundSets}></SetList>
            </div>
            <div style={{display: "flex", justifyContent: "space-around", flexFlow: "row nowrap"}}>
              <h5 style={{fontStyle: "oblique", paddingTop: "5px", margin: 0}}>You've shuffled {shufCount} times!</h5>
              
              <h5 style={{fontStyle: "oblique", paddingTop: "5px", margin: 0}}>&nbsp;&nbsp;&nbsp; You've used {hintCount} hints!</h5>
            </div>
          </div>
        </div>
        <div style={{width:"45%"}}>
          <Grid container spacing={4} justify={"space-evenly"} style={{height:"60%", margin:"5px"}}>    
            {cards.map(card => 
            <Grid item spacing={2} style={{padding:10}}> 
              <SetCard hintSet={hintSet} card={card} selected={selected} setSelected ={setSelected}></SetCard> 
            </Grid>)}
          </Grid>
          <SwipeableTemporaryDrawer gameOver={gameOver} totalSets={totalSets} foundSets={foundSets} home={home} setHome={setHome}>
          </SwipeableTemporaryDrawer>
          { paused ? <AlertDialog paused={paused} setPaused={setPaused}/> : null} 
        </div> 
      </div> 
    }
    </div>
  )
};

export default App;



   
