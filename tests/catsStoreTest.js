import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import nock from 'nock';
import { fetchFacts } from '../src/catsStore';
import catsInfo from '../src/catsStore';
import thunk from 'redux-thunk';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('creates a ReceiveFacts action when fetching cat facts has succeeded', () => {
    nock('http://mapd-cats.azurewebsites.net/').get('/catfacts').reply(200, { body: { cats: ["Cats love us", "We love cats"] }});
    const expectedActions = [
      { type: 'RECEIVE_FACTS', cats: ["Cats love us", "We love cats"] }
    ]
    const store = mockStore({});

    return store.dispatch(fetchFacts())
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
        catsInfo: []
      }
    );
  });

  it('should add facts when RECEIVE_FACTS fires', () => {
    expect(
      catsInfo({ cats: {} }, {
        type: 'RECEIVE_FACTS',
        cats: [ "I love cats", "You love cats" ]
      })
    ).toEqual(
      {
        cats: ["I love cats", "You love cats"]
      }
    );
  });
});
