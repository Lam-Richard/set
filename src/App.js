import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

const NUM_PROPERTIES = 4; 

const SetCard = ({selected, setSelected, custom}) => {
  
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
    <div selected = {custom} onClick = {handleClick} className = "Card noSelect">
        <img src = "https://cdn.shopify.com/s/files/1/0200/7616/products/0003_blue-wheel-playing-cards-jack_1024x1024.png?v=1581782436"/>
    </div> 
  )
}

const App = () => {
  
  const [selected, setSelected] = useState([]);
  const [totalSets, setTotalSets] = useState(0);

  function checkSet () {
    let truths = 0;
    for (let property = 0; property < NUM_PROPERTIES; property++) {
      let truthTest = [];
      selected.forEach(element => truthTest.push(element[property]));
      let truthSet = new Set(truthTest);
      // Check for all different or all the same property in selected set 
      if (truthSet.size == 3 || truthSet.size == 1) {
        truths += 1;
      }
    }
    
    if (truths == NUM_PROPERTIES) {
      setTotalSets(totalSets + 1);
      truths = 0;
    }
  }

  useEffect(()=>{
    if (selected.length == 3) {
      checkSet();
    }
  }, [selected]);

  return (
    <div>
      <div>Number of Sets: {totalSets} </div>
      <div className = "Container">    
        <SetCard custom = "EBBA" selected = {selected} setSelected = {setSelected}></SetCard>
        <SetCard custom = "ELLI" selected = {selected} setSelected = {setSelected}></SetCard>
        <SetCard custom = "ELLE" selected = {selected} setSelected = {setSelected}></SetCard>
        <SetCard custom = "ELLO" selected = {selected} setSelected = {setSelected}></SetCard>
        <SetCard custom = "ELLU" selected = {selected} setSelected = {setSelected}></SetCard>
        <SetCard custom = "ELLY" selected = {selected} setSelected = {setSelected}></SetCard>
        <SetCard custom = "ELLQ" selected = {selected} setSelected = {setSelected}></SetCard>
        <SetCard custom = "ELLZ" selected = {selected} setSelected = {setSelected}></SetCard>
        <SetCard custom = "ELLB" selected = {selected} setSelected = {setSelected}></SetCard>
        <SetCard custom = "ELLN" selected = {selected} setSelected = {setSelected}></SetCard>
        <SetCard custom = "ELLM" selected = {selected} setSelected = {setSelected}></SetCard>
        <SetCard custom = "ELLC" selected = {selected} setSelected = {setSelected}></SetCard>
      </div>
    </div>
    
  )
};

export default App;
