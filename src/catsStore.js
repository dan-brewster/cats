import { update } from 'react/lib/update';
const INITIALIZE_FACTS = 'INITIALIZE_FACTS';
const REMOVE_FACT = 'REMOVE_FACT';
const RECEIVE_FACTS = 'RECEIVE_FACTS';
import fetch from 'isomorphic-fetch'

const initialState = {
  cats: {}
};

// Actions

export const fetchFacts = () => {
  return dispatch => {
    dispatch(initializeFacts());
    //dispatch(setInitializing());
    return fetch('http://mapd-cats.azurewebsites.net/catfacts')
      .then((response) => response.json())
      .then((json) => {
        dispatch(receiveFacts(json.body.facts));
      }).catch(e => {
        console.log("FAILED: ", e);
      });
  }
};

let receiveFacts = (facts) => {
  return {
    type: RECEIVE_FACTS,
    facts
  }
};

export const removeFact = (factId) => {
  return {
    type: REMOVE_FACT,
    factId: factId
  }
};

export const initializeFacts = () => {
  return {
    type: INITIALIZE_FACTS
  }
};


// Reducers
let initializeFactsReducer = (state) => {
  return state;
};

let receiveFactsReducer = (state, facts) => {
  return update(state, {
    facts: { $set: facts }
  });
};



export const catsInfo = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_FACTS:
      return state;
    case RECEIVE_FACTS:
      return receiveFactsReducer(state, action.facts);
    case REMOVE_FACT:
      return removeFactReducer(action.factId, state);
    default:
      return state;
  }
};

export default catsInfo;
