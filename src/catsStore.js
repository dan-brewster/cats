import update from 'immutability-helper';
import fetch from 'isomorphic-fetch';
import xml2js from 'xml2js';

const REMOVE_CAT = 'REMOVE_CAT';
const RECEIVE_ALL_FACTS = 'RECEIVE_ALL_FACTS';
const RECEIVE_ALL_PICS = 'RECEIVE_ALL_PICS';
const RECEIVE_ONE_FACT = 'RECEIVE_ONE_FACT';
const RECEIVE_ONE_PIC = 'RECEIVE_ONE_PIC';

export const initialState = {
  cats: []
};

// Actions

export const fetchFacts = (fetchedFactsCallback, replaceCatId = null) => {
  return dispatch => {
    return fetch('http://mapd-cats.azurewebsites.net/catfacts')
      .then(response => response.json())
      .then(json => dispatch(fetchedFactsCallback(
                                json.facts.sort((a, b) =>
                                                    { return a.length - b.length }),
                                replaceCatId)))
      .catch(e => {
        console.error("FAILED: ", e);
      });
  };
};

export const fetchPics = (fetchedPicsCallback, replaceCatId = null) => {
  return dispatch => {
    return fetch('http://mapd-cats.azurewebsites.net/catpics')
      .then(response => response.text())
      .then(bodyText => {
        xml2js.parseString(bodyText, (err, result) => {
          if (err) {
            console.error(err);
          } else {
            dispatch(fetchedPicsCallback(result.response.data[0].images[0].image.map((img) => {
              return img.url[0];
            }), replaceCatId));
          }
        });
      })
      .catch(e => {
        console.error("FAILED: ", e);
      });
  };
};

export const receiveAllFacts = (facts) => {
  return {
    type: RECEIVE_ALL_FACTS,
    facts
  };
};

export const receiveOneFact = (facts, replaceCatId) => {
  return {
    type: RECEIVE_ONE_FACT,
    fact: facts[0],
    replaceCatId
  };
};

export const receiveAllPics = (pics) => {
  return {
    type: RECEIVE_ALL_PICS,
    pics
  };
};

export const receiveOnePic = (pics, replaceCatId) => {
  return {
    type: RECEIVE_ONE_PIC,
    pic: pics[0],
    replaceCatId
  };
};

export const removeCat = (catId) => {
  return {
    type: REMOVE_CAT,
    catId: catId
  };
};

let updateFactsArray = (oldCats, newFacts) => {
  if (oldCats.cats.length === 0) {
    return newFacts.map((newFact) => {
      return { fact: newFact, factLength: newFact.length };
    });
  } else {
    return oldCats.cats.map((oldCat, i) => {
      return { fact: newFacts[i], factLength: newFacts[i].length, pic: oldCat.pic };
    });
  }
};

let updatePicsArray = (oldCats, newPics) => {
  if (oldCats.cats.length === 0) {
    return newPics.map((newPic) => {
      return { pic: newPic };
    });
  } else {
    return oldCats.cats.map((oldCat, i) => {
      return { fact: oldCat.fact, factLength: oldCat.factLength, pic: newPics[i] };
    });
  }
};

// reducers

let receiveAllFactsReducer = (state, facts) => {
  return update(state, {
    cats: { $set: updateFactsArray(state, facts) }
  });
};

let receiveAllPicsReducer = (state, pics) => {
  return update(state, {
    cats: { $set: updatePicsArray(state, pics) }
  });
};

let removeCatReducer = (catId, state) => {
  return update(state, {
    cats: { $splice: [[catId, 1]] }
  });
};

let receiveOneFactReducer = (state, fact, replaceCatId) => {
  let newCatObj = state.cats[replaceCatId];
  newCatObj.fact = fact;
  newCatObj.factLength = fact.length;
  return update(state, {
    cats: { $splice: [[replaceCatId, 1, newCatObj]] }
  });
};

let receiveOnePicReducer = (state, pic, replaceCatId) => {
  let newCatObj = state.cats[replaceCatId];
  newCatObj.pic = pic;
  return update(state, {
    cats: { $splice: [[replaceCatId, 1, newCatObj]] }
  });
};

export const catsInfo = (state = initialState, action) => {
  switch (action.type) {
  case RECEIVE_ALL_FACTS:
    return receiveAllFactsReducer(state, action.facts);
  case RECEIVE_ONE_FACT:
    return receiveOneFactReducer(state, action.fact, action.replaceCatId);
  case RECEIVE_ALL_PICS:
    return receiveAllPicsReducer(state, action.pics);
  case RECEIVE_ONE_PIC:
    return receiveOnePicReducer(state, action.pic, action.replaceCatId);
  case REMOVE_CAT:
    return removeCatReducer(action.catId, state);
  default:
    return state;
  }
};

export default catsInfo;
