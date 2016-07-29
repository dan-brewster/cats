import React, { PropTypes } from 'react';
import { fetchFacts, fetchPics, receiveAllFacts, receiveAllPics } from '../catsStore';
import SingleCat from './singleCat';
import crypto from 'crypto';


var CatGrid = React.createClass({

  propTypes: {
    cats: PropTypes.array
  },

  componentDidMount: function() {
    this.props.dispatch(fetchFacts(receiveAllFacts));
    this.props.dispatch(fetchPics(receiveAllPics));
  },

  render: function() {
    return (
      <div className="catGrid">
        {this.props.cats.map(function(catInfo, i) {
          const hash = crypto.createHash('sha256');
          hash.update(catInfo.pic + catInfo.fact);
          let hashDigest = hash.digest('hex');
          return(
            <SingleCat key={hashDigest} catInfo={catInfo} catId={i} />
          );
        })}
      </div>
    );
  }
});

export default CatGrid;
