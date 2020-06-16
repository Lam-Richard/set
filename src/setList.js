import React from 'react';
import { EachSet } from './eachSet';


export const SetList = ({foundSets}) => {
    console.log(foundSets)
    return foundSets.map(found => {
      return <EachSet oneSet={found}></EachSet>
    })
  }