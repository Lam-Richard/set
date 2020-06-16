import React from 'react';
export const EachSet = ({oneSet}) => {
    console.log(oneSet)
    return (
      <div style={{display: "flex", flexFlow: "row nowrap", justifyContent: "center"}}className="eachSet noSelect">
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
  }
