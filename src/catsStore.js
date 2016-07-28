import update from 'react/lib/update';
import fetch from 'isomorphic-fetch';
import xml2js from 'xml2js';

const REMOVE_FACT = 'REMOVE_FACT';
const RECEIVE_FACTS = 'RECEIVE_FACTS';
const RECEIVE_PICS = 'RECEIVE_PICS';

export const initialState = {
  cats: []
};

// Actions

export const fetchFacts = () => {
  return dispatch => {
    return fetch('http://mapd-cats.azurewebsites.net/catfacts')
      .then(response => response.json())
      .then(json => dispatch(receiveFacts(json.facts)))
      .catch(e => {
        console.log("FAILED: ", e);
      });
  }
};

export const fetchPics = () => {
  return dispatch => {
    return fetch('http://mapd-cats.azurewebsites.net/catpics')
      .then(response => response.text())
      .then(bodyText => {
        xml2js.parseString(bodyText, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            dispatch(receivePics(result.response.data[0].images[0].image.map((img) => {
              return img.url[0];
            })));
          }
        });
      })
      .catch(e => {
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

let receivePics = (pics) => {
  return {
    type: RECEIVE_PICS,
    pics
  }
}

export const removeFact = (factId) => {
  return {
    type: REMOVE_FACT,
    factId: factId
  }
};

let updateFactsArray = (oldCats, newFacts) => {
  if (oldCats.length === 0) {
    return newFacts.map((newFact) => {
      return { fact: newFact, factLength: newFact.length };
    });
  } else {
    return oldCats.map((oldCat, i) => {
      return { fact: newFacts[i], factLength: newFacts[i].length, pic: oldCat.pic };
    });
  }
};

let updatePicsArray = (oldCats, newPics) => {
  if (oldCats.length === 0) {
    return newPics.map((newPic) => {
      return { pic: newPic };
    });
  } else {
    return oldCats.map((oldCat, i) => {
      return { fact: oldCat.fact, factLength: oldCat.factLength, pic: newPics[i] };
    });
  }
};

// reducers

let receiveFactsReducer = (state, facts) => {
  // console.log(state, facts);
  return update(state, {
    cats: { $set: updateFactsArray(state, facts) }
  });
};

let receivePicsReducer = (state, pics) => {
  // console.log(state, pics);
  return update(state, {
    cats: { $set: updatePicsArray(state, pics) }
  });
};



export const catsInfo = (state = initialState, action) => {
  console.log(state);
  console.log(action);
  switch (action.type) {
    case RECEIVE_FACTS:
      return receiveFactsReducer(state.cats, action.facts);
    case RECEIVE_PICS:
      return receivePicsReducer(state.cats, action.pics);
    case REMOVE_FACT:
      return removeFactReducer(action.factId, state);
    default:
      return state;
  }
};

export default catsInfo;
