import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

const numProperties = 4; 

const SetCard = ({card, selected, setSelected}) => {

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
  };
  
  return (
    <div selected={card} onClick={handleClick} className="Card noSelect">
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
  
  const [selected, setSelected] = useState([]);
  const [totalSets, setTotalSets] = useState(0);
  const [cards, setCards] = useState(startingGrid);

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
      truths = 0;
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
      <SetCard  card={cards[0]} selected={selected} setSelected ={setSelected}></SetCard>
      <SetCard  card={cards[1]} selected={selected} setSelected ={setSelected}></SetCard>
      <SetCard  card={cards[2]} selected={selected} setSelected ={setSelected}></SetCard>
      <SetCard  card={cards[3]} selected={selected} setSelected ={setSelected}></SetCard>
      <SetCard  card={cards[4]} selected={selected} setSelected ={setSelected}></SetCard>
      <SetCard  card={cards[5]} selected={selected} setSelected ={setSelected}></SetCard>
      <SetCard  card={cards[6]} selected={selected} setSelected ={setSelected}></SetCard>
      <SetCard  card={cards[7]} selected={selected} setSelected ={setSelected}></SetCard>
      <SetCard  card={cards[8]} selected={selected} setSelected ={setSelected}></SetCard>
      <SetCard  card={cards[9]} selected={selected} setSelected ={setSelected}></SetCard>
      <SetCard  card={cards[10]} selected={selected} setSelected ={setSelected}></SetCard>
      <SetCard  card={cards[11]} selected={selected} setSelected ={setSelected}></SetCard>
    </div>
    <div className = "Container" style={{float:"right", width:900, height:900}}>
      <div> Number of Sets Found: {totalSets} </div>
    </div>
  </div>
  )
};

export default App;



   
    