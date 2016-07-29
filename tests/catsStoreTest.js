import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import nock from 'nock';
import { fetchFacts, fetchPics, receiveAllFacts, receiveAllPics, receiveOneFact, receiveOnePic } from '../src/catsStore';
import catsInfo from '../src/catsStore';
import thunk from 'redux-thunk';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

let catPicXML = '<?xml version="1.0"?>' +
                  "<response>" +
                    "<data>" +
                      "<images>" +
                        "<image>" +
                          "<url>http://25.media.tumblr.com/tumblr_lqowwwZkSN1qbhms5o1_500.jpg</url>" +
                          "<id>6gp</id>" +
                          "<source_url>http://thecatapi.com/?id=6gp</source_url>" +
                        "</image>" +
                        "<image>" +
                          "<url>http://24.media.tumblr.com/tumblr_m13c6qhYKI1qz7bbqo1_1280.jpg</url>" +
                          "<id>b01</id>" +
                          "<source_url>http://thecatapi.com/?id=b01</source_url>" +
                        "</image>" +
                      "</images>" +
                    "</data>" +
                  "</response>";
let sampleCatPicsArray = [ "http://25.media.tumblr.com/tumblr_lqowwwZkSN1qbhms5o1_500.jpg",
                           "http://24.media.tumblr.com/tumblr_m13c6qhYKI1qz7bbqo1_1280.jpg"];

let sampleCatFactsArray = [ "Cats are great.",
                            "Cats are super great.",
                            "Cats are really great."];

let largerCatFactsArray = [].concat(sampleCatFactsArray).concat(
                            [ "Cats are cool.",
                              "Cats are super super awesome",
                              "Cats are nice",
                              "Cats are appreciated" ])

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('creates a receiveAllFacts action when fetching cat facts has succeeded', () => {
    nock('http://mapd-cats.azurewebsites.net/').get('/catfacts').reply(200, { facts: sampleCatFactsArray });
    const expectedActions = [
      { type: 'RECEIVE_ALL_FACTS', facts: sampleCatFactsArray }
    ]
    const store = mockStore({});

    return store.dispatch(fetchFacts(receiveAllFacts))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })
  });

  it('calling RECEIVE_ALL_FACTS returns the cat facts sorted by length', () => {
    nock('http://mapd-cats.azurewebsites.net/').get('/catfacts').reply(200, { facts: largerCatFactsArray });
    const expectedActions = [
      { type: 'RECEIVE_ALL_FACTS', facts: largerCatFactsArray.sort((a, b) =>
                                                                { return a.length - b.length }) }
    ]
    const store = mockStore({});

    return store.dispatch(fetchFacts(receiveAllFacts))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })
  });

  it('creates a receiveOneFact action when fetching a single cat fact has succeeded', () => {
    let replaceCatId = 1;
    nock('http://mapd-cats.azurewebsites.net/').get('/catfacts').reply(200, { facts: sampleCatFactsArray });
    const expectedActions = [
      { type: 'RECEIVE_ONE_FACT', fact: sampleCatFactsArray[0], replaceCatId: replaceCatId }
    ]
    const store = mockStore({});

    return store.dispatch(fetchFacts(receiveOneFact, replaceCatId))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })
  });

  it('creates a receiveAllPics action when fetching cat pics has succeeded', () => {
    nock('http://mapd-cats.azurewebsites.net/').get('/catpics').reply(200, catPicXML);
    const expectedActions = [
      { type: 'RECEIVE_ALL_PICS', pics: sampleCatPicsArray }
    ]
    const store = mockStore({});

    return store.dispatch(fetchPics(receiveAllPics))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })
  });

  it('creates a receiveOnePic action when fetching a single cat pics has succeeded', () => {
    let replaceCatId = 1;
    nock('http://mapd-cats.azurewebsites.net/').get('/catpics').reply(200, catPicXML);
    const expectedActions = [
      { type: 'RECEIVE_ONE_PIC', pic: sampleCatPicsArray[0], replaceCatId: replaceCatId }
    ]
    const store = mockStore({});

    return store.dispatch(fetchPics(receiveOnePic, replaceCatId))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })
  });

});

describe('reducers', () => {
  it('should return initial state when using unfamiliar action name', () => {
    expect(
      catsInfo(undefined, {})
    ).toEqual(
      {
        cats: []
      }
    );
  });

  it('should set all facts when RECEIVE_ALL_FACTS fires', () => {
    expect(
      catsInfo({ cats: [] }, {
        type: 'RECEIVE_ALL_FACTS',
        facts: [ "I love cats", "You love cats" ]
      })
    ).toEqual(
      {
        cats: [
          {
            fact: "I love cats",
            factLength: 11
          },
          {
            fact: "You love cats",
            factLength: 13
          }
        ]
      }
    );
  });

  it('should replace a single fact when RECEIVE_ONE_FACTS fires', () => {
    expect(
      catsInfo({ cats: [ { fact: "Cats = cool", factLength: 11 }, { fact: "Cats are nice", factLength: 13 } ] }, {
        type: 'RECEIVE_ONE_FACT',
        replaceCatId: 0,
        fact: "I love cats"
      })
    ).toEqual(
      {
        cats: [
          {
            fact: "I love cats",
            factLength: 11
          },
          {
            fact: "Cats are nice",
            factLength: 13
          }
        ]
      }
    );
  });

  it('should set all pics when RECEIVE_ALL_PICS fires', () => {
    expect(
      catsInfo({ cats: [] }, {
        type: 'RECEIVE_ALL_PICS',
        pics: sampleCatPicsArray
      })
    ).toEqual(
      {
        cats: [
          {
            pic: sampleCatPicsArray[0]
          },
          {
            pic: sampleCatPicsArray[1]
          }
        ]
      }
    );
  });

  it('should replace a single pic when RECEIVE_ONE_PIC fires', () => {
    expect(
      catsInfo({ cats: [ { pic: sampleCatPicsArray[0] }, { pic: sampleCatPicsArray[1] } ] }, {
        type: 'RECEIVE_ONE_PIC',
        replaceCatId: 0,
        pic: "http://27.media.tumblr.com/tumblr_m2s6bnSMCN1qzex9io1_1280.jpg"
      })
    ).toEqual(
      {
        cats: [
          {
            pic: "http://27.media.tumblr.com/tumblr_m2s6bnSMCN1qzex9io1_1280.jpg"
          },
          {
            pic: sampleCatPicsArray[1]
          }
        ]
      }
    );
  });

  it('should remove a pic and cat when REMOVE_CAT fires', () => {
    expect(
      catsInfo({ cats: [ { pic: sampleCatPicsArray[0], fact: "Cats love bacon", factLength: 15 },
                         { pic: sampleCatPicsArray[1], fact: "Cats love coconut", factLength: 17 } ] }, {
        type: 'REMOVE_CAT',
        replaceCatId: 0
      })
    ).toEqual(
      {
        cats: [
          {
            pic: sampleCatPicsArray[1],
            fact: "Cats love coconut",
            factLength: 17
          }
        ]
      }
    );
  });
});
