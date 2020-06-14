import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import moment from 'moment';
moment().format();

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));


const numProperties = 4; 

const SetCard = ({card, selected, setSelected}) => {
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
    console.log(selected)
    if (e.target.className.includes("Card") && selected.length < 3) {
      e.target.className = "Yellow noSelect";
      setSelected(selected.concat(e.target.selected));
      
    } else if (e.target.className.includes("Yellow")) {
      e.target.className = "Card noSelect";
      setSelected(selected.filter((yeah)=> {
        return yeah != e.target.selected;
      }))
    }      
  };
  return (
    <div selected={card} onClick={handleClick} className="Card noSelect" style={{backgroundColor: checkSelect(card) ? "red" : "whitesmoke"}}>
      <img src={require('./SetCards/'+ card + '.png.jpg')} /> 
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


    

const App = () => {
    
  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  const [totalSets, setTotalSets] = useState(0);
  const [cards, setCards] = useState(startingGrid);
  const [foundSets, setFoundSets] = useState([]);

  function shuffle () {
    let newGrid = generateCardGrid();
    setCards(newGrid);
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
      let tempFound = foundSets
      setFoundSets(tempFound.concat(tempSet));

      let tempCards = cards.filter(card => {
          return card != tempSet[0] && card != tempSet[1] && card != tempSet[2];
        });
      
      let tempCards1 = tempCards.concat([generateCard(),generateCard(),generateCard()]);
      

      setCards(tempCards1);

      setSelected([]);
    }
    
  }

  useEffect(()=>{
    if (selected.length === 3) {
      checkSet();
    }
  }, [selected]);

  return (
  <div>
    <div className = "Container" style={{float:"left"}}>    
      {cards.map(card => <SetCard  card={card} selected={selected} setSelected ={setSelected}></SetCard>)}
    </div>
    <div className = "Container" style={{float:"right", width:900, height:900}}>
      <div> Number of Sets Found: {totalSets} </div>
    </div>

    <div className={classes.root}>
      <Button onClick={shuffle} variant="contained" color="primary">
          SHUFFLE
      </Button>
    </div>
      
  </div>
  )
};

export default App;



   
    