import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { findAllByAltText } from '@testing-library/react';

const Cardi = ({setActives, actives, selected, setSelected, custom}) => {
  
  function handleClick(e) {
  
    if (e.target.className.includes("Card") && actives < 3) {
      e.target.className = "toYellow noSelect"
      setActives(actives + 1)
      setSelected(selected.concat(e.target.selected))
      
    } else if (e.target.className.includes("toYellow")) {
      e.target.className = "Card noSelect"
      setActives(actives - 1)
      setSelected(selected.filter((yeah)=> {
        return yeah != e.target.selected
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
  
  const [actives, setActives] = useState(0);
  const [selected, setSelected] = useState([]);
  let numberOfSets = 0;

  function checkSet () {
    let truths = 0;
    for (let x = 0; x < 5; x++) {
      let truthtest = []
      selected.forEach(element => truthtest.push(element[x]))
      let truthset = new Set(truthtest);
      if (truthset.size == 3 || truthset.size == 1) {
        truths += 1
      }
    }
    
    if (truths == 5) {
      console.log("YEEHAW")
      numberOfSets += 1
      truths = 0
    }
      
  }

  useEffect(()=>{

    if (selected.length == 3) {
      checkSet()
    }


  }, [selected]);

  return (
    <div>
      <div>Number of Sets: {numberOfSets} </div>
      <div className = "Container">    
      <Cardi custom = "HEBBA" selected = {selected} setSelected = {setSelected} actives = {actives} setActives = {setActives}></Cardi>
      <Cardi custom = "HELLI" selected = {selected} setSelected = {setSelected} actives = {actives} setActives = {setActives}></Cardi>
      <Cardi custom = "HELLE" selected = {selected} setSelected = {setSelected} actives = {actives} setActives = {setActives}></Cardi>
      <Cardi custom = "HELLO" selected = {selected} setSelected = {setSelected} actives = {actives} setActives = {setActives}></Cardi>
      <Cardi custom = "HELLU" selected = {selected} setSelected = {setSelected} actives = {actives} setActives = {setActives}></Cardi>
      <Cardi custom = "HELLY" selected = {selected} setSelected = {setSelected} actives = {actives} setActives = {setActives}></Cardi>
      <Cardi custom = "HELLQ" selected = {selected} setSelected = {setSelected} actives = {actives} setActives = {setActives}></Cardi>
      <Cardi custom = "HELLZ" selected = {selected} setSelected = {setSelected} actives = {actives} setActives = {setActives}></Cardi>
      <Cardi custom = "HELLB" selected = {selected} setSelected = {setSelected} actives = {actives} setActives = {setActives}></Cardi>
      <Cardi custom = "HELLN" selected = {selected} setSelected = {setSelected} actives = {actives} setActives = {setActives}></Cardi>
      <Cardi custom = "HELLM" selected = {selected} setSelected = {setSelected} actives = {actives} setActives = {setActives}></Cardi>
      <Cardi custom = "HELLC" selected = {selected} setSelected = {setSelected} actives = {actives} setActives = {setActives}></Cardi>
    </div>
    </div>
    
  )
};

export default App;
