import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchFacts, fetchPics } from '../catsStore';
import SingleCat from './singleCat';

var CatGrid = React.createClass({

  propTypes: {
    cats: PropTypes.array
  },

  componentDidMount: function() {
    this.props.dispatch(fetchFacts());
    this.props.dispatch(fetchPics());
  },

  render: function() {

    return (
      <div className="catGrid">
        {this.props.cats.map(function(catInfo) {
          return(
            <SingleCat catInfo={catInfo} />
          );
        })}
      </div>
    )
  }
});

export default CatGrid;
