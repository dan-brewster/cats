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
    nock('http://mapd-cats.azurewebsites.net/').get('/catfacts').reply(200, { body: { facts: ["Cats love us", "We love cats"] }});
    const expectedActions = [
      { type: 'INITIALIZE_FACTS' },
      { type: 'RECEIVE_FACTS', facts: ["Cats love us", "We love cats"] }
    ]
    const store = mockStore({});

    return store.dispatch(fetchFacts())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })
  });

});
