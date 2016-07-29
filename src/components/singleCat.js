import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { removeCat, receiveOneFact, receiveOnePic, fetchFacts, fetchPics } from '../catsStore';
var SingleCat = React.createClass({

  propTypes: {
    catInfo: PropTypes.object.isRequired,
    catId: PropTypes.number.isRequired
  },

  removeCat: function () {
    this.props.dispatch(removeCat(this.props.catId));
  },

  replaceCat: function () {
    this.props.dispatch(fetchFacts(receiveOneFact, this.props.catId));
    this.props.dispatch(fetchPics(receiveOnePic, this.props.catId));
  },

  render: function () {
    return (
      <div className="singleCat">
        <span className="catFact">{this.props.catInfo.fact}</span>
        <img className="catPic" width="200" src={this.props.catInfo.pic} />
        <div className="catActions">
          <span className="removeCat"
                onClick={() => this.removeCat()}>Remove Cat</span>
          <span className="replaceCat"
                onClick={() => this.replaceCat()}>Replace Cat</span>
        </div>
      </div>
    );
  }
});

SingleCat = connect()(SingleCat);

export default SingleCat;
