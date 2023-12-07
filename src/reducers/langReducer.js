import {
    CHANGE_LANG
  } from "../constants/actionTypes";
  
  const initialState = {
    locale: "EN"
  }
  
  export default function(state = initialState, action) {
    switch(action.type){
      case CHANGE_LANG:
      return {
       locale: action.payload
      };
      default:
        return state;
    }
  }